
import React, { useState, useEffect } from "react";
import JsonInput from "../components/JsonInput";
import JsonataEditor from "../components/JsonataEditor";
import JsonataResult from "../components/JsonataResult";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../components/ui/resizable";

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
  };

  return (
    <div className="flex flex-col h-screen bg-[#282c34]">
      <header className="bg-[#21252b] text-white p-2 border-b border-[#181a1f] flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-[#7cb342] text-xl font-semibold ml-2">JSONata Genius</span>
        </div>
      </header>
      
      <div className="flex-grow overflow-hidden flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <JsonInput 
                value={jsonInput} 
                onChange={setJsonInput} 
                isValid={isJsonValid}
                error={jsonError}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="flex-grow">
                <JsonataEditor 
                  jsonInput={jsonInput} 
                  onResultChange={handleResultChange} 
                />
              </div>
              
              <div>
                <JsonataResult result={result} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
