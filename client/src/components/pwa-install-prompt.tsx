import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, X } from "lucide-react";
import { promptPWAInstall, isPWA } from "@/lib/pwa";

/**
 * PWA Install Prompt Component
 * Shows an install button when the app can be installed
 * Hides automatically when app is already installed or in standalone mode
 */
export function PWAInstallPrompt() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running as PWA
    if (isPWA()) {
      setIsInstalled(true);
      setShowInstall(false);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = () => {
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const accepted = await promptPWAInstall();
    if (accepted) {
      setShowInstall(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    // Remember user dismissed (optional - store in localStorage)
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (!showInstall || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
              Install Pfresh App
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Get the app experience! Install Pfresh for quick access and offline use.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <Download className="w-3 h-3 mr-2" />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PWA Status Indicator (Optional)
 * Shows if app is running in standalone mode
 */
export function PWAStatusBadge() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(isPWA());
  }, []);

  if (!isStandalone) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg">
        <Check className="w-3 h-3" />
        <span>App Mode</span>
      </div>
    </div>
  );
}
