
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
import jsonata from "jsonata";

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
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
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

  // Extract clean JSONata expression from API response (removing markdown backticks)
  const extractCleanExpression = (text: string): string => {
    // Remove markdown code blocks (```jsonata and ```)
    const codeBlockRegex = /```(?:jsonata)?\s*([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // If no code block markers, just return the text (trimmed)
    return text.trim();
  };

  // Generate JSONata expression using the prompt via OpenAI API
  const generateExpression = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!isJsonValid()) {
      toast.error("Please enter valid JSON");
      return;
    }

    // Check if we need to ask for API key
    if (!localStorage.getItem('openai_api_key') && !apiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = apiKeyInput || localStorage.getItem('openai_api_key') || '';
      
      if (apiKeyInput) {
        localStorage.setItem('openai_api_key', apiKeyInput);
        setShowApiKeyInput(false);
      }

      // Call the OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a JSONata expert. Given a JSON object and a description of what the user wants to extract or transform, provide only a valid JSONata expression that accomplishes this task. Do not include any explanations, do not format as a code block, just return the raw JSONata expression."
            },
            {
              role: "user",
              content: `JSON: ${jsonInput}\n\nTask: ${prompt}\n\nProvide only a valid JSONata expression.`
            }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate expression');
      }

      const data = await response.json();
      const rawExpression = data.choices[0].message.content.trim();
      const cleanExpression = extractCleanExpression(rawExpression);
      
      setJsonataExpression(cleanExpression);
      
      // Also evaluate the expression
      await evaluateExpression(cleanExpression);
    } catch (err) {
      console.error("Error generating expression:", err);
      setError(`Failed to generate expression: ${(err as Error).message}`);
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
      const parsedJson = JSON.parse(jsonInput);
      const expression = jsonata(expr);
      
      try {
        const resultValue = await expression.evaluate(parsedJson);
        const resultString = typeof resultValue === 'object' 
          ? JSON.stringify(resultValue, null, 2)
          : String(resultValue);
          
        setResult(resultString);
        onResultChange(resultString);
      } catch (e) {
        setError(`Error evaluating expression: ${(e as Error).message}`);
        console.error("Evaluation error:", e);
      }
    } catch (err) {
      setError(`Failed to evaluate: ${(err as Error).message}`);
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

  // Allow users to clear their saved API key
  const clearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKeyInput("");
    toast.success("API key removed");
    setShowApiKeyInput(true);
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

      {showApiKeyInput ? (
        <div className="p-4 bg-[#21252b] border-b border-[#181a1f]">
          <div className="space-y-2">
            <label className="text-white text-sm">
              Enter your OpenAI API key to generate JSONata expressions
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-[#282c34] text-sm text-white rounded px-3 py-1.5 border border-[#181a1f] focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={generateExpression}
                disabled={!apiKeyInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded px-3 py-1.5 transition-colors flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
              >
                Save & Generate
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Your API key is stored only in your browser's localStorage.
            </p>
          </div>
        </div>
      ) : (
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
          {localStorage.getItem('openai_api_key') && (
            <div className="flex justify-end mt-1">
              <button 
                onClick={clearApiKey} 
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Clear API key
              </button>
            </div>
          )}
        </div>
      )}
      
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
