
import React, { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <div className="glass-panel rounded-xl p-6 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Result</h2>
        <button
          onClick={copyToClipboard}
          disabled={!result.trim()}
          className="text-gray-500 hover:text-primary transition-colors p-1 rounded disabled:opacity-50 disabled:pointer-events-none"
          title="Copy to clipboard"
        >
          {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </button>
      </div>

      <div className="code-area w-full bg-accent text-accent-foreground overflow-auto">
        {result ? (
          <pre>{result}</pre>
        ) : (
          <div className="text-muted-foreground italic">
            The result of your JSONata expression will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonataResult;
