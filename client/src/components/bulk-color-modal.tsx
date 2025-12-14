import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Palette, Loader2 } from "lucide-react";

interface BulkColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  routeOptions: string[];
  onUpdate: (route: string, color: string) => void;
  isPending: boolean;
  currentRows: Array<{ route: string; markerColor?: string }>;
}

export function BulkColorModal({ 
  open, 
  onOpenChange, 
  routeOptions, 
  onUpdate, 
  isPending,
  currentRows 
}: BulkColorModalProps) {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  // Color presets with themed design
  const colorPresets = [
    { color: "#3b82f6", name: "Blue", title: "Blue - Default" },
    { color: "#ef4444", name: "Red", title: "Red - KL4" },
    { color: "#22c55e", name: "Green", title: "Green - KL6" },
    { color: "#f97316", name: "Orange", title: "Orange - KL3" },
    { color: "#8b5cf6", name: "Violet", title: "Violet - KL1" },
    { color: "#eab308", name: "Yellow", title: "Yellow - KL5" },
    { color: "#6366f1", name: "Indigo", title: "Indigo - KL7" },
    { color: "#64748b", name: "Gray", title: "Gray - Others" },
    { color: "#ec4899", name: "Pink", title: "Pink - Special" },
    { color: "#14b8a6", name: "Teal", title: "Teal - Alternate" },
    { color: "#f59e0b", name: "Amber", title: "Amber - SL1" },
    { color: "#000000", name: "Black", title: "Black - Warehouse" },
  ];

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedRoute("");
      setSelectedColor("#3b82f6");
    }
  }, [open]);

  // Get current color for selected route
  const currentColor = selectedRoute 
    ? currentRows.find(r => r.route === selectedRoute)?.markerColor || '#3b82f6'
    : '#3b82f6';

  const handleUpdate = () => {
    if (selectedRoute) {
      onUpdate(selectedRoute, selectedColor);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/80 dark:bg-black/80 backdrop-blur-3xl border-2 border-purple-200/60 dark:border-purple-700/60 shadow-[0_20px_80px_0_rgba(168,85,247,0.4)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Set Color Marker by Route
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Route Selection */}
          <div className="space-y-2">
            <Label htmlFor="route-select" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Select Route
            </Label>
            <select
              id="route-select"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-800 rounded-xl font-medium shadow-sm hover:border-purple-400 dark:hover:border-purple-600 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            >
              <option value="">-- Select Route --</option>
              {routeOptions.map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>

          {/* Color Presets Grid */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
              <span>Choose Marker Color</span>
              {selectedRoute && (
                <span className="flex items-center gap-1.5 text-xs font-normal text-gray-600 dark:text-gray-400">
                  Current:
                  <span 
                    className="inline-block w-5 h-5 rounded-md border-2 border-gray-400 dark:border-gray-500 shadow-sm"
                    style={{ backgroundColor: currentColor }}
                    title={currentColor}
                  />
                  <span className="font-mono text-[10px]">{currentColor}</span>
                </span>
              )}
            </Label>
            
            {/* Color Picker + Hex Input */}
            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-xl border border-purple-200 dark:border-purple-800">
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-20 h-10 cursor-pointer border-2 border-purple-300 dark:border-purple-700"
              />
              <Input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 border-2 border-purple-300 dark:border-purple-700"
                style={{fontSize: '12px'}}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            
            {/* Color Presets */}
            <div className="grid grid-cols-6 gap-3 p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              {colorPresets.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => setSelectedColor(preset.color)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200 ${
                    selectedColor === preset.color
                      ? 'ring-4 ring-purple-500 dark:ring-purple-400 bg-purple-100 dark:bg-purple-900/50 scale-105'
                      : 'hover:bg-white/50 dark:hover:bg-black/30 hover:scale-105'
                  }`}
                  title={preset.title}
                  type="button"
                >
                  <div 
                    className={`w-10 h-10 rounded-full shadow-lg ${preset.color === '#000000' ? 'border-2 border-gray-300 dark:border-gray-600' : ''}`}
                    style={{ backgroundColor: preset.color }}
                  />
                  <span style={{ fontSize: '9px' }} className="text-gray-700 dark:text-gray-300 font-medium">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border border-purple-200 dark:border-purple-800 rounded-xl">
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              {selectedRoute 
                ? (
                  <>
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span> Will update marker colors for <span className="font-bold text-purple-700 dark:text-purple-300">ALL</span> locations in route <span className="font-bold">"{selectedRoute}"</span> to <span 
                      className="inline-block w-4 h-4 rounded border border-gray-400 align-middle mx-1"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </>
                )
                : (
                  <>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">💡</span> Select a route to bulk update marker colors for all locations in fullscreen map
                  </>
                )
              }
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border-gray-300 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!selectedRoute || isPending}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Update Colors
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
