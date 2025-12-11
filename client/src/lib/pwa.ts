// Register Service Worker for PWA
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('🔄 New version available! Refresh to update.');
                  
                  // Optionally show a notification to the user
                  if (confirm('New version available! Reload to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  } else {
    console.warn('⚠️ Service Workers are not supported in this browser.');
  }
}

// Handle PWA install prompt
let deferredPrompt: any = null;

export function setupPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('💾 PWA install prompt available');
    
    // You can show your own install button here
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully!');
    deferredPrompt = null;
  });
}

// Function to show install promotion (you can customize this)
function showInstallPromotion() {
  // You can implement a custom UI to prompt the user to install
  // For now, we'll just log it
  console.log('📱 Show install promotion to user');
}

// Function to trigger PWA install
export async function promptPWAInstall() {
  if (!deferredPrompt) {
    console.log('⚠️ Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);

  // Clear the deferred prompt
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// Get PWA display mode
export function getPWADisplayMode(): string {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if ((document as any).referrer.startsWith('android-app://')) {
    return 'twa'; // Trusted Web Activity
  } else if ((navigator as any).standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}

// Update theme color for browser tab and PWA
export function updateThemeColor(color: string): void {
  // Update meta theme-color tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color);
  }
  
  // Update Apple status bar color for iOS
  const isDark = color === '#0f172a' || color.includes('dark');
  const metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (metaAppleStatusBar) {
    metaAppleStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
  }
  
  // Update Windows tile color
  const metaMsTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
  if (metaMsTileColor) {
    metaMsTileColor.setAttribute('content', color);
  }
}

// Predefined theme colors
export const THEME_COLORS = {
  light: '#3b82f6',  // Blue for light mode
  dark: '#0f172a',   // Slate-900 for dark mode
} as const;
