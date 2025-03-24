import React, { useState, useRef } from "react";
import { AlertTriangle, Check, Upload } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  error?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({ 
  value, 
  onChange, 
  isValid, 
  error 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a JSON file
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      toast.error("Please upload a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Validate JSON before setting
        JSON.parse(content);
        onChange(content);
        toast.success(`File "${file.name}" loaded successfully`);
      } catch (error) {
        toast.error("Invalid JSON file");
      }
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsText(file);
    
    // Clear the input so the same file can be uploaded again
    e.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-[#21252b] text-white border-b border-[#181a1f]">
        <div className="flex items-center">
          <h2 className="text-sm font-medium">JSON</h2>
          <button
            onClick={triggerFileUpload}
            className="ml-2 text-gray-300 hover:text-white transition-colors p-1 rounded"
            title="Upload JSON file"
          >
            <Upload className="h-4 w-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
        </div>
        <div className="flex items-center">
          {value && (
            <div className="flex items-center text-xs">
              {isValid ? (
                <span className="text-green-500 flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Valid JSON
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Invalid JSON
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow relative flex-1">
        <ScrollArea orientation="both" className="h-full absolute inset-0">
          <div className="min-w-max h-full">
            <textarea
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              spellCheck={false}
              className="w-full h-full bg-[#282c34] text-white font-mono text-sm p-4 resize-none outline-none border-0"
              style={{ 
                minHeight: "100%",
                lineHeight: 1.5,
                tabSize: 2,
                minWidth: "800px",
                overflow: "visible",
              }}
            />
          </div>
        </ScrollArea>
      </div>

      {error && !isValid && value && (
        <div className="p-2 text-red-500 text-xs flex items-center bg-[#21252b] border-t border-[#181a1f]">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default JsonInput;
