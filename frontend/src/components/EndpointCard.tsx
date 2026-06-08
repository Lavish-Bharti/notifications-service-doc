"use client";

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Lock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}

export interface HeaderItem {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
}

export interface EndpointCardProps {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  authRequired: boolean;
  requiredRole?: string;
  parameters?: Parameter[];
  headers?: HeaderItem[];
  sampleRequestCurl: string;
  sampleRequestBody?: string;
  sampleResponse: string;
}

// Custom JSON syntax highlighting function
function highlightJson(json: string) {
  if (!json) return '';
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      let cls = 'text-amber-500 dark:text-amber-300'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-violet-600 dark:text-violet-400 font-semibold'; // key
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-sky-600 dark:text-sky-400 font-semibold'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 dark:text-rose-400 font-semibold'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function EndpointCard({
  id,
  method,
  url,
  description,
  authRequired,
  requiredRole,
  parameters = [],
  headers = [],
  sampleRequestCurl,
  sampleRequestBody,
  sampleResponse,
}: EndpointCardProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'body' | 'response'>(
    sampleRequestBody ? 'body' : 'response'
  );
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const getMethodBadgeClass = () => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'POST':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'PUT':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCodeSnippet = () => {
    if (activeTab === 'curl') return sampleRequestCurl;
    if (activeTab === 'body') return sampleRequestBody || '';
    return sampleResponse;
  };

  const handleCopy = () => {
    const textToCopy = getCodeSnippet();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={id} className="relative border border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all hover:shadow-md print-break-inside-avoid print-full-width my-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border p-4 gap-3 bg-muted/20">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-2.5 py-1 text-xs font-bold font-mono border rounded ${getMethodBadgeClass()}`}>
            {method}
          </span>
          <span className="font-mono text-sm sm:text-base font-semibold tracking-tight text-foreground select-all">
            {url}
          </span>
          {authRequired && (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
              <Lock className="w-3 h-3" /> Auth Required
            </span>
          )}
          {requiredRole && (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
              <Shield className="w-3 h-3" /> {requiredRole}
            </span>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-end sm:self-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {isExpanded ? (
            <>Collapse <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Expand <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Parameters / Explanations */}
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-border">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{description}</p>

                {/* Headers Table */}
                {headers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Request Headers</h4>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="p-2.5 font-semibold">Header</th>
                            <th className="p-2.5 font-semibold">Type</th>
                            <th className="p-2.5 font-semibold text-center">Required</th>
                            <th className="p-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border font-mono">
                          {headers.map(h => (
                            <tr key={h.name} className="hover:bg-muted/10">
                              <td className="p-2.5 font-bold text-foreground">{h.name}</td>
                              <td className="p-2.5 text-muted-foreground">{h.type}</td>
                              <td className="p-2.5 text-center">
                                <span className={h.required ? 'text-rose-500 font-semibold' : 'text-muted-foreground'}>
                                  {h.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="p-2.5 text-muted-foreground font-sans">{h.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Parameters Table */}
                {parameters.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Query / Body Parameters</h4>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border">
                            <th className="p-2.5 font-semibold">Parameter</th>
                            <th className="p-2.5 font-semibold">Type</th>
                            <th className="p-2.5 font-semibold text-center">Required</th>
                            <th className="p-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border font-mono">
                          {parameters.map(p => (
                            <tr key={p.name} className="hover:bg-muted/10">
                              <td className="p-2.5 font-bold text-foreground">{p.name}</td>
                              <td className="p-2.5 text-muted-foreground">{p.type}</td>
                              <td className="p-2.5 text-center">
                                <span className={p.required ? 'text-rose-500 font-semibold' : 'text-muted-foreground'}>
                                  {p.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="p-2.5 text-muted-foreground font-sans">
                                {p.description}
                                {p.default && (
                                  <span className="block text-[10px] text-muted-foreground mt-0.5 font-mono">
                                    Default: {p.default}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Code Examples */}
              <div className="bg-muted/30 lg:bg-muted/10 p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex flex-col h-full">
                  {/* Tabs */}
                  <div className="flex items-center justify-between border-b border-border mb-4 no-print">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('curl')}
                        className={`pb-2 text-xs font-medium border-b-2 px-1 transition-all ${
                          activeTab === 'curl'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        cURL Request
                      </button>
                      {sampleRequestBody && (
                        <button
                          onClick={() => setActiveTab('body')}
                          className={`pb-2 text-xs font-medium border-b-2 px-1 transition-all ${
                            activeTab === 'body'
                              ? 'border-primary text-foreground'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Request Body
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('response')}
                        className={`pb-2 text-xs font-medium border-b-2 px-1 transition-all ${
                          activeTab === 'response'
                            ? 'border-primary text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Sample Response
                      </button>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy code to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500 animate-scale" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Code Block */}
                  <div className="relative flex-grow rounded-lg border border-border bg-card/65 dark:bg-black/50 p-4 font-mono text-xs overflow-auto max-h-[350px] leading-relaxed shadow-inner">
                    {activeTab === 'response' || activeTab === 'body' ? (
                      <pre className="whitespace-pre overflow-x-auto text-foreground">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: highlightJson(getCodeSnippet()),
                          }}
                        />
                      </pre>
                    ) : (
                      <pre className="whitespace-pre overflow-x-auto text-foreground">
                        <code>{getCodeSnippet()}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
