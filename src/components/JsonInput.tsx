
import React, { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";

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
    <div className="glass-panel rounded-xl p-6 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">JSON Input</h2>
        <div className="flex items-center">
          {value && (
            <div className="flex items-center text-sm">
              {isValid ? (
                <span className="text-green-500 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Valid JSON
                </span>
              ) : (
                <span className="text-destructive flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Invalid JSON
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`relative transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/30' : ''}`}>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste your JSON here"
          className="code-area w-full bg-accent text-accent-foreground"
          rows={10}
          spellCheck={false}
        />
      </div>

      {error && !isValid && value && (
        <div className="mt-2 text-destructive text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-muted-foreground">
        Tip: Paste your JSON data here. Make sure it's valid JSON to use with JSONata expressions.
      </div>
    </div>
  );
};

export default JsonInput;
