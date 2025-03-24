import React, { useState, useEffect, useRef } from "react";
import JsonInput from "../components/JsonInput";
import JsonataEditor from "../components/JsonataEditor";
import JsonataResult from "../components/JsonataResult";
import HowItWorksModal from "../components/HowItWorksModal";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";
import { toast } from "sonner";
import { JsonataEditorHandle } from "../components/JsonataEditor";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [jsonInput, setJsonInput] = useState<string>(`{
  "Account": {
    "Account Name": "Firefly",
    "Order": [
      {
        "OrderID": "order103",
        "Product": [
          {
            "Product Name": "Bowler Hat",
            "ProductID": 858383,
            "SKU": "0406654608",
            "Description": {
              "Colour": "Purple",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.75
            },
            "Price": 34.45,
            "Quantity": 2
          },
          {
            "Product Name": "Trilby hat",
            "ProductID": 858236,
            "SKU": "0406634348",
            "Description": {
              "Colour": "Orange",
              "Width": 300,
              "Height": 200,
              "Depth": 210,
              "Weight": 0.6
            },
            "Price": 21.67,
            "Quantity": 1
          }
        ]
      }
    ]
  }
}`);
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [jsonError, setJsonError] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [lastUploadTime, setLastUploadTime] = useState<number | null>(null);
  const [jsonExpression, setJsonExpression] = useState<string>("$");
  
  // Reference to the JSONata editor component
  const jsonataEditorRef = useRef<JsonataEditorHandle | null>(null);

  useEffect(() => {
    if (!jsonInput.trim()) {
      setIsJsonValid(false);
      setJsonError("");
      return;
    }

    try {
      JSON.parse(jsonInput);
      setIsJsonValid(true);
      setJsonError("");
    } catch (e) {
      setIsJsonValid(false);
      setJsonError((e as Error).message);
    }
  }, [jsonInput]);

  const handleResultChange = (newResult: string) => {
    setResult(newResult);
    
    // If this was from a file upload, offer to download
    if (lastUploadTime && Date.now() - lastUploadTime < 1000) {
      setTimeout(() => {
        if (document.querySelector('[title="Download result as JSON"]')) {
          toast.info("Result is ready for download", {
            action: {
              label: "Download",
              onClick: () => {
                // Find and click the download button
                const downloadBtn = document.querySelector('[title="Download result as JSON"]') as HTMLButtonElement;
                if (downloadBtn) downloadBtn.click();
              }
            }
          });
        }
      }, 500);
      
      // Reset upload time
      setLastUploadTime(null);
    }
  };

  // Handle file upload by triggering evaluation
  const handleJsonInputChange = (newValue: string) => {
    setJsonInput(newValue);
    // Set last upload time to trigger evaluation
    setLastUploadTime(Date.now());
  };

  // Effect to evaluate expression after file upload
  useEffect(() => {
    if (lastUploadTime && isJsonValid && jsonataEditorRef.current) {
      jsonataEditorRef.current.evaluateExpression();
    }
  }, [lastUploadTime, isJsonValid]);

  return (
    <div className="flex flex-col h-screen bg-[#282c34]">
      <header className="bg-[#21252b] text-white p-2 border-b border-[#181a1f] flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#7cb342] text-xl font-semibold ml-2">JSONata Genius</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white"
            title="View on GitHub"
            onClick={() => window.open("https://github.com/emilefyon/jsonata-genius", "_blank")}
          >
            <Github className="h-5 w-5" />
          </Button>
          <HowItWorksModal className="text-gray-300 hover:text-white" />
        </div>
      </header>
      
      <div className="flex-grow overflow-hidden flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <JsonInput 
                value={jsonInput} 
                onChange={handleJsonInputChange} 
                isValid={isJsonValid}
                error={jsonError}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={60} minSize={30}>
                  <div className="h-full">
                    <JsonataEditor 
                      ref={jsonataEditorRef}
                      jsonInput={jsonInput} 
                      onResultChange={handleResultChange} 
                    />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={40} minSize={20}>
                  <div className="h-full">
                    <JsonataResult result={result} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
