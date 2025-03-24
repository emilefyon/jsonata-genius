
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import JsonInput from "../components/JsonInput";
import JsonataEditor from "../components/JsonataEditor";
import JsonataResult from "../components/JsonataResult";

const Index = () => {
  const [jsonInput, setJsonInput] = useState<string>(`{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipcode": "12345"
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    },
    {
      "type": "work",
      "number": "555-5678"
    }
  ],
  "active": true
}`);
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [jsonError, setJsonError] = useState<string>("");
  const [result, setResult] = useState<string>("");

  // Validate JSON whenever input changes
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
    <Layout>
      <div className="mb-8 text-center max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          JSONata Genius
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Easily create and test JSONata expressions with AI assistance. 
          Enter your JSON data, describe what you want to do in plain English, 
          and get the corresponding JSONata expression.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <JsonInput 
            value={jsonInput} 
            onChange={setJsonInput} 
            isValid={isJsonValid}
            error={jsonError}
          />
          
          <JsonataResult result={result} />
        </div>

        <JsonataEditor 
          jsonInput={jsonInput} 
          onResultChange={handleResultChange} 
        />
      </div>
    </Layout>
  );
};

export default Index;
