
import React, { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-[#21252b] text-white border-b border-[#181a1f]">
        <h2 className="text-sm font-medium">JSON</h2>
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

      <div className="flex-grow relative">
        <ScrollArea orientation="both" className="h-full">
          <div className="min-w-max">
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
                minWidth: "800px", // Set a minimum width to prevent content truncation
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
