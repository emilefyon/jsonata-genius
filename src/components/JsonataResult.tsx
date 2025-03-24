
import React, { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface JsonataResultProps {
  result: string;
}

const JsonataResult: React.FC<JsonataResultProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Result copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Determine if result is a simple value or complex JSON
  const isSimpleValue = () => {
    if (!result) return true;
    
    try {
      const parsed = JSON.parse(result);
      return typeof parsed !== 'object' || parsed === null;
    } catch (e) {
      return true; // If it can't be parsed as JSON, it's a simple value
    }
  };

  return (
    <div className="border-t border-[#181a1f]">
      <div className="flex justify-between items-center p-2 bg-[#21252b] text-white">
        <h2 className="text-sm font-medium">Result</h2>
        <button
          onClick={copyToClipboard}
          disabled={!result.trim()}
          className="text-gray-300 hover:text-white transition-colors p-1 rounded disabled:opacity-50 disabled:pointer-events-none"
          title="Copy to clipboard"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <ScrollArea className="h-[150px]">
        <div className="bg-[#282c34] p-4 h-full">
          {result ? (
            <pre className={`font-mono text-sm ${isSimpleValue() ? 'text-amber-400' : 'text-white'}`}>
              {result}
            </pre>
          ) : (
            <div className="text-gray-500 italic text-sm">
              The result of your JSONata expression will appear here
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default JsonataResult;
