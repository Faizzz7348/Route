// Service Worker for Pfresh PWA
const CACHE_NAME = 'pfresh-v3';
const RUNTIME_CACHE = 'pfresh-runtime-v3';
const IMAGE_CACHE = 'pfresh-images-v2';
const API_CACHE = 'pfresh-api-v1';
const MAX_IMAGE_CACHE_SIZE = 100; // Increased for better performance
const MAX_API_CACHE_SIZE = 50;
const IMAGE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const API_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/FamilyMart.png',
  '/assets/nav-icon.jpeg',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && 
                     cacheName !== RUNTIME_CACHE && 
                     cacheName !== IMAGE_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API caching with stale-while-revalidate
  if (url.pathname.startsWith('/api/')) {
    // Only cache GET requests
    if (request.method !== 'GET') {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        // Return cached response immediately if available
        const fetchPromise = fetch(request).then(async (response) => {
          if (response.ok) {
            // Manage cache size
            const keys = await cache.keys();
            if (keys.length >= MAX_API_CACHE_SIZE) {
              await cache.delete(keys[0]);
            }
            
            // Store with timestamp
            const responseClone = response.clone();
            const blob = await responseClone.blob();
            const headers = new Headers(response.headers);
            headers.set('sw-cache-time', Date.now().toString());
            
            const cachedResponseObj = new Response(blob, {
              status: response.status,
              statusText: response.statusText,
              headers: headers,
            });
            
            cache.put(request, cachedResponseObj);
          }
          return response;
        }).catch(() => cachedResponse);

        // Check cache age
        if (cachedResponse) {
          const cacheTime = cachedResponse.headers.get('sw-cache-time');
          const age = Date.now() - (parseInt(cacheTime) || 0);
          
          // Return cached if fresh, otherwise wait for network
          if (age < API_CACHE_TTL) {
            // Return cached and update in background
            fetchPromise.catch(() => {}); // Background update
            return cachedResponse;
          }
        }
        
        // Wait for network if cache is stale or missing
        return fetchPromise;
      })
    );
    return;
  }

  // Special handling for images - cache with size limit and TTL
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        // Check cache age if exists
        if (cachedResponse) {
          const cacheTime = cachedResponse.headers.get('sw-cache-time');
          const age = Date.now() - (parseInt(cacheTime) || 0);
          
          // Return cached if fresh
          if (age < IMAGE_CACHE_TTL) {
            return cachedResponse;
          }
        }

        try {
          const response = await fetch(request);
          if (response.ok) {
            // Manage cache size (LRU)
            const keys = await cache.keys();
            if (keys.length >= MAX_IMAGE_CACHE_SIZE) {
              // Remove oldest 10 entries
              for (let i = 0; i < 10; i++) {
                await cache.delete(keys[i]);
              }
            }
            
            // Add timestamp to headers
            const blob = await response.clone().blob();
            const headers = new Headers(response.headers);
            headers.set('sw-cache-time', Date.now().toString());
            
            const cachedResponseObj = new Response(blob, {
              status: response.status,
              statusText: response.statusText,
              headers: headers,
            });
            
            cache.put(request, cachedResponseObj);
          }
          return response;
        } catch (error) {
          // Return stale cache if network fails
          return cachedResponse || new Response('Image not available', { status: 404 });
        }
      })
    );
    return;
  }

  // Network first strategy for HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Cache first strategy for assets (JS, CSS, images)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Cache successful responses
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
