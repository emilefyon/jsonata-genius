
import React from "react";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-panel py-4 px-6 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="font-mono text-lg font-medium text-primary transition-colors">
              JSONata<span className="text-gray-900 font-bold">Genius</span>
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <a 
              href="https://jsonata.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Documentation
            </a>
            <a 
              href="https://github.com/jsonata-js/jsonata" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              JSONata Genius Viewer — Powered by AI
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a 
                href="https://jsonata.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                JSONata Documentation
              </a>
              <a 
                href="https://github.com/jsonata-js/jsonata" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
