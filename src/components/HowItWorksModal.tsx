import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface HowItWorksModalProps {
  className?: string;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ className }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          title="How It Works"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-[#21252b] text-white border-[#181a1f]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#7cb342]">How JSONata Genius Works</DialogTitle>
          <DialogDescription className="text-gray-300">
            Learn how to use this app to transform your JSON data efficiently
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-2 text-sm">
          <div>
            <h3 className="font-semibold text-white mb-1">What is JSONata?</h3>
            <p className="text-gray-300">
              JSONata is a lightweight query and transformation language for JSON data. 
              It allows you to extract, transform, and restructure data easily using 
              concise expressions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Getting Started</h3>
            <ol className="list-decimal pl-5 text-gray-300 space-y-1">
              <li>Enter or upload your JSON data in the left panel</li>
              <li>Write a JSONata expression in the middle panel, or use AI to generate one</li>
              <li>Click the Play button to execute the expression</li>
              <li>View and download your results in the bottom panel</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Using AI to Generate Expressions</h3>
            <p className="text-gray-300">
              This app uses OpenAI's API to automatically generate JSONata expressions based 
              on your natural language descriptions:
            </p>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              <li>
                <strong>OpenAI API Key:</strong> You need to provide your own OpenAI API key 
                (stored only in your browser's local storage)
              </li>
              <li>
                <strong>Description:</strong> Type what you want to extract or transform 
                in plain English
              </li>
              <li>
                <strong>Generation:</strong> The app will send your JSON structure and 
                description to OpenAI and generate a JSONata expression
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Features</h3>
            <ul className="list-disc pl-5 text-gray-300 space-y-1">
              <li>Load JSON from file or paste directly</li>
              <li>AI-powered expression generation</li>
              <li>Real-time expression evaluation</li>
              <li>Download results as JSON</li>
              <li>Resize panels for better workflow</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-1">Privacy</h3>
            <p className="text-gray-300">
              Your JSON data and OpenAI API key are processed locally and never stored on 
              any server. API keys are stored only in your browser's localStorage and can 
              be cleared at any time.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => window.open("https://docs.jsonata.org/", "_blank")}
            className="bg-transparent text-white border-[#181a1f] hover:bg-[#181a1f]"
          >
            JSONata Documentation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal; 