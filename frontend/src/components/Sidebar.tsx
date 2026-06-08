"use client";

import React, { useState } from 'react';
import { Menu, X, Search, BookOpen, Key, Cpu, HelpCircle, Activity, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
}

interface NavigationCategory {
  title: string;
  icon: React.ReactNode;
  items: NavigationItem[];
}

interface SidebarProps {
  activeId: string;
  onOpenSearch: () => void;
}

export default function Sidebar({ activeId, onOpenSearch }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const categories: NavigationCategory[] = [
    {
      title: 'Getting Started',
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { id: 'overview', label: 'Overview' },
        { id: 'deliverables', label: 'Deliverables' },
        { id: 'architecture', label: 'Architecture' },
      ],
    },
    {
      title: 'Security & Auth',
      icon: <Key className="w-4 h-4" />,
      items: [
        { id: 'authentication', label: 'Authentication' },
        { id: 'versioning', label: 'API Versioning' },
        { id: 'role-access', label: 'Role-Based Access' },
      ],
    },
    {
      title: 'API Reference',
      icon: <Cpu className="w-4 h-4" />,
      items: [
        { id: 'endpoints', label: 'GET /notifications' },
        { id: 'post-notifications', label: 'POST /notifications' },
        { id: 'error-codes', label: 'Error Codes' },
      ],
    },
    {
      title: 'Developer Tools',
      icon: <HelpCircle className="w-4 h-4" />,
      items: [
        { id: 'playground', label: 'API Playground' },
        { id: 'testing-guide', label: 'Testing Guide' },
        { id: 'deployment-guide', label: 'Deployment Guide' },
      ],
    },
    {
      title: 'Operations',
      icon: <Activity className="w-4 h-4" />,
      items: [
        { id: 'status-dashboard', label: 'Status Dashboard' },
      ],
    },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Find top position and offset for layout header
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border text-foreground">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
            N
          </div>
          <span className="font-bold text-sm tracking-tight uppercase">Notify Service</span>
          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
            V1.0
          </span>
        </div>
        
        {/* Toggle Theme inline in header */}
        <div className="no-print hidden lg:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Spotlight Search Trigger */}
      <div className="px-4 py-4 border-b border-border/50 no-print">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/65 text-muted-foreground hover:text-foreground text-xs transition-all outline-none focus:ring-1 focus:ring-ring"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search docs...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-card border border-border rounded text-[9px] font-mono">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {categories.map(category => (
          <div key={category.title} className="space-y-2">
            <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/85">
              {category.icon}
              <span>{category.title}</span>
            </div>
            
            <div className="space-y-0.5">
              {category.items.map(item => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground font-mono flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> status: online
        </span>
        <span>© 2026</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header (floating navbar) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/90 backdrop-blur-md flex items-center justify-between px-6 z-40 no-print">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
            N
          </div>
          <span className="font-bold text-sm tracking-tight uppercase">Notify Service</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSearch} 
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <ThemeToggle />

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar (Permanent left column) */}
      <aside className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30 no-print">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Draw (Slide-over drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 no-print">
            {/* Backdrop */}
            <div 
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Drawer */}
            <div className="fixed top-0 bottom-0 left-0 w-64 shadow-2xl">
              <SidebarContent />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
