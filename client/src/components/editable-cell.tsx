import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Pencil } from "lucide-react";

interface EditableCellProps {
  value: any;
  type: string;
  onSave: (value: any) => void;
  onCancel?: () => void;
  onChange?: (value: any) => void;
  options?: string[];
  dataKey?: string;
  autoSave?: boolean;
  editMode?: boolean;
}

export function EditableCell({ 
  value, 
  type, 
  onSave, 
  onCancel,
  onChange,
  options, 
  dataKey,
  autoSave = true,
  editMode = false
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [showHover, setShowHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isSaving && !isEditing) {
      setEditValue(value);
    }
  }, [value, isSaving, isEditing]);

  // Auto-focus when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving || editValue === value) {
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);
    let processedValue = editValue;
    
    if (type === 'number') {
      processedValue = parseInt(editValue) || 0;
    } else if (type === 'currency') {
      processedValue = parseFloat(editValue.toString().replace(/[^0-9.]/g, '')) || 0;
      processedValue = processedValue.toFixed(2);
    }
    
    try {
      await onSave(processedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editValue, value, type, onSave, isSaving]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
    setIsSaving(false);
    onCancel?.();
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, [value, onCancel]);

  const handleChange = useCallback((newValue: any) => {
    setEditValue(newValue);
    onChange?.(newValue);
    
    // Auto-save after 1 second of no changes
    if (autoSave && editMode) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 1000);
    }
  }, [onChange, autoSave, editMode, handleSave]);

  const getPlaceholder = () => {
    if (dataKey === 'latitude') {
      return "e.g. 3.139003";
    }
    if (dataKey === 'longitude') {
      return "e.g. 101.686855";
    }
    if (type === 'currency') {
      return "0.00";
    }
    if (type === 'number') {
      return "Enter number";
    }
    return "Enter value";
  };

  // For select types (route, delivery, or generic select)
  if (((['route', 'delivery'].includes(dataKey || '') || type === 'select') && options && options.length > 0)) {
    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-[120px]">
          <select
            ref={selectRef as any}
            value={editValue || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setEditValue(newValue);
              if (autoSave) {
                handleChange(newValue);
              }
            }}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
            }}
            className="flex-1 h-7 px-2 text-xs border border-blue-500 rounded bg-blue-50 dark:bg-blue-950/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          >
            <option value="">Select {dataKey}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {!autoSave && (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 rounded transition-colors"
                title="Save"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div 
        className="group relative px-2 py-1 min-w-[60px] text-center cursor-pointer hover:bg-blue-500/10 rounded transition-all"
        onDoubleClick={() => editMode && setIsEditing(true)}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        <span className="text-xs">
          {value || <span className="text-gray-400">—</span>}
        </span>
        {showHover && editMode && (
          <Pencil className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    );
  }

  // For text/number/currency inputs - inline editing
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[80px]">
        <input
          ref={inputRef}
          type={type === 'number' || type === 'currency' ? 'number' : 'text'}
          step={type === 'currency' ? '0.01' : undefined}
          value={type === 'currency' ? editValue.toString().replace(/[^0-9.]/g, '') : editValue || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              handleCancel();
            }
          }}
          placeholder={getPlaceholder()}
          className="flex-1 h-7 px-2 text-xs border border-blue-500 rounded bg-blue-50 dark:bg-blue-950/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSaving}
        />
        {!autoSave && (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 rounded transition-colors"
              title="Save"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    );
  }

  // Display mode
  return (
    <div 
      className="group relative px-2 py-1 min-w-[40px] text-center cursor-pointer hover:bg-blue-500/10 rounded transition-all"
      onDoubleClick={() => editMode && setIsEditing(true)}
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
    >
      <span className="text-xs">
        {type === 'currency' && value ? `RM ${parseFloat(value).toFixed(2)}` : (value || <span className="text-gray-400">—</span>)}
      </span>
      {showHover && editMode && (
        <Pencil className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
