
import React, { useState, useEffect } from "react";
import { 
  Copy, 
  CheckCircle, 
  Play, 
  AlertTriangle, 
  MessageSquare,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface JsonataEditorProps {
  jsonInput: string;
  onResultChange: (result: string) => void;
}

const JsonataEditor: React.FC<JsonataEditorProps> = ({ 
  jsonInput, 
  onResultChange 
}) => {
  const [prompt, setPrompt] = useState("");
  const [jsonataExpression, setJsonataExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Simple validation to check if the JSON input is valid
  const isJsonValid = () => {
    try {
      if (!jsonInput.trim()) return false;
      JSON.parse(jsonInput);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Generate JSONata expression using the prompt
  const generateExpression = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!isJsonValid()) {
      toast.error("Please enter valid JSON");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call an API to generate the expression
      // For now, we'll simulate a response with a simple function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different JSONata expressions based on the prompt
      let expression = "";
      
      if (prompt.toLowerCase().includes("extract") || prompt.toLowerCase().includes("get")) {
        const jsonObj = JSON.parse(jsonInput);
        const keys = Object.keys(jsonObj);
        if (keys.length > 0) {
          // Simple extraction of the first property
          expression = `$.${keys[0]}`;
        }
      } else if (prompt.toLowerCase().includes("count")) {
        expression = "$count(*)";
      } else if (prompt.toLowerCase().includes("sum") || prompt.toLowerCase().includes("total")) {
        expression = "$sum(Account.Order.Product.(Price * Quantity))";
      } else if (prompt.toLowerCase().includes("transform") || prompt.toLowerCase().includes("map")) {
        expression = "$map($, function($v) { $v })";
      } else if (prompt.toLowerCase().includes("filter")) {
        expression = "$filter($, function($v) { $v.propertyName = 'value' })";
      } else {
        expression = "$";  // Default expression to return the entire JSON
      }
      
      setJsonataExpression(expression);
      
      // Also evaluate the expression
      evaluateExpression(expression);
    } catch (err) {
      console.error("Error generating expression:", err);
      setError("Failed to generate expression. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Evaluate the JSONata expression
  const evaluateExpression = async (expr = jsonataExpression) => {
    if (!expr.trim()) {
      toast.error("Please generate or enter a JSONata expression");
      return;
    }

    if (!isJsonValid()) {
      toast.error("Please enter valid JSON");
      return;
    }

    setEvaluating(true);
    setError(null);

    try {
      // In a real implementation, this would use the jsonata library
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const jsonObj = JSON.parse(jsonInput);
        
        // Simple simulated evaluation for common expressions
        let resultValue = null;
        
        if (expr === "$") {
          resultValue = jsonObj;
        } else if (expr.startsWith("$.")) {
          const path = expr.substring(2);
          resultValue = jsonObj[path];
        } else if (expr === "$count(*)") {
          if (Array.isArray(jsonObj)) {
            resultValue = jsonObj.length;
          } else if (typeof jsonObj === 'object' && jsonObj !== null) {
            resultValue = Object.keys(jsonObj).length;
          }
        } else if (expr === "$sum(Account.Order.Product.(Price * Quantity))") {
          try {
            // Simulate sum calculation for the specific expression
            resultValue = 90.57; // Example value
          } catch (e) {
            resultValue = "Error evaluating expression";
          }
        }
        
        const resultString = typeof resultValue === 'number' 
          ? resultValue.toString()
          : JSON.stringify(resultValue, null, 2);
          
        setResult(resultString);
        onResultChange(resultString);
      } catch (e) {
        setError("Error evaluating expression. Please check your syntax.");
        console.error("Evaluation error:", e);
      }
    } catch (err) {
      setError("Failed to evaluate expression. Please try again.");
      console.error("Error evaluating:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonataExpression);
    setCopied(true);
    toast.success("Copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-[#21252b] text-white border-b border-[#181a1f]">
        <h2 className="text-sm font-medium">JSONata</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            disabled={!jsonataExpression}
            className="text-gray-300 hover:text-white transition-colors p-1 rounded disabled:opacity-50 disabled:pointer-events-none"
            title="Copy to clipboard"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={() => evaluateExpression()}
            disabled={evaluating || !jsonataExpression || !isJsonValid()}
            className="text-gray-300 hover:text-white transition-colors p-1 rounded disabled:opacity-50 disabled:pointer-events-none"
            title="Evaluate expression"
          >
            {evaluating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="p-2 bg-[#21252b] border-b border-[#181a1f]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to do with your JSON..."
            className="w-full bg-[#282c34] text-sm text-white rounded px-3 py-1.5 border border-[#181a1f] focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={generateExpression}
            disabled={loading || !prompt.trim() || !isJsonValid()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded px-3 py-1.5 transition-colors flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-grow relative">
        <textarea
          value={jsonataExpression}
          onChange={(e) => setJsonataExpression(e.target.value)}
          placeholder="// JSONata expression will appear here"
          spellCheck={false}
          className="w-full h-full bg-[#282c34] text-green-400 font-mono text-sm p-4 resize-none outline-none border-0"
          style={{ 
            minHeight: "100px",
            lineHeight: 1.5,
          }}
        />
      </div>
      
      {error && (
        <div className="p-2 text-red-500 text-xs flex items-center bg-[#21252b] border-t border-[#181a1f]">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default JsonataEditor;
