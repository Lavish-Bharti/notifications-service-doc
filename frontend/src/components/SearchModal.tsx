"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, CornerDownLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: 'overview', title: 'Overview', category: 'Getting Started', description: 'Brief introduction to the notifications service' },
  { id: 'deliverables', title: 'Deliverables', category: 'Getting Started', description: 'Available communication channels and integrations' },
  { id: 'architecture', title: 'Architecture', category: 'Getting Started', description: 'System overview and core service modules' },
  { id: 'authentication', title: 'Authentication', category: 'Security', description: 'How to authenticate using API Keys and Bearer Tokens' },
  { id: 'versioning', title: 'API Versioning', category: 'Security', description: 'Versioning policies and active API headers' },
  { id: 'endpoints', title: 'API Endpoints', category: 'API Reference', description: 'Overview of all notification REST endpoints' },
  { id: 'get-notifications', title: 'GET /notifications', category: 'API Reference', description: 'Fetch notification histories with filters' },
  { id: 'post-notifications', title: 'POST /notifications', category: 'API Reference', description: 'Send/create a new service notification' },
  { id: 'error-codes', title: 'Error Codes', category: 'API Reference', description: 'Error payload formats and status code tables' },
  { id: 'role-access', title: 'Role-Based Access', category: 'Security', description: 'Access control matrices for microservices' },
  { id: 'playground', title: 'API Playground', category: 'Developer Tools', description: 'Interactive panel to fire live request tests' },
  { id: 'testing-guide', title: 'Testing Guide', category: 'Developer Tools', description: 'Local and automated integration testing configurations' },
  { id: 'deployment-guide', title: 'Deployment Guide', category: 'Developer Tools', description: 'Dockerizing, CI/CD, and deploying the service' },
  { id: 'status-dashboard', title: 'Status Dashboard', category: 'Operations', description: 'System health statuses and latency metrics' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredItems = query.trim() === '' 
    ? SEARCH_ITEMS 
    : SEARCH_ITEMS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    // Keep selected item visible in list
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const handleSelect = (id: string) => {
    onClose();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 no-print">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal content */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl"
          >
            <div className="flex items-center px-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search endpoints, guides, and metrics..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full h-14 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder-muted-foreground text-base"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div 
              ref={resultsRef}
              className="max-h-96 overflow-y-auto p-2"
            >
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No results found for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                          index === selectedIndex 
                            ? 'bg-primary-foreground/20 text-primary-foreground' 
                            : 'bg-secondary text-muted-foreground'
                        }`}>
                          {item.category}
                        </span>
                        <span className="font-medium text-sm sm:text-base">{item.title}</span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        index === selectedIndex ? 'text-primary-foreground/85' : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    {index === selectedIndex && (
                      <span className="text-xs flex items-center gap-1 opacity-70">
                        Select <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center px-4 py-2.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
              <div className="flex gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-secondary border border-border rounded text-[10px]">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-secondary border border-border rounded text-[10px]">Enter</kbd> Select</span>
              </div>
              <span>Press <kbd className="px-1.5 py-0.5 bg-secondary border border-border rounded text-[10px]">ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
