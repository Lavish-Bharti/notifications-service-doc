"use client";

import React, { useState, useEffect } from 'react';
import { Send, Check, Copy, Wifi, WifiOff, RefreshCw } from 'lucide-react';

// Custom JSON syntax highlighting
function highlightJson(json: string) {
  if (!json) return '';
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      let cls = 'text-amber-500 dark:text-amber-300';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-violet-600 dark:text-violet-400 font-semibold';
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400';
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-sky-600 dark:text-sky-400 font-semibold';
      } else if (/null/.test(match)) {
        cls = 'text-rose-500 dark:text-rose-400 font-semibold';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

const BACKEND_URL = 'http://localhost:3001';

type EndpointPath = 'GET /notifications' | 'POST /notifications' | 'GET /health';

export default function Playground() {
  const [endpoint, setEndpoint] = useState<EndpointPath>('GET /notifications');
  const [authHeader, setAuthHeader] = useState('Bearer mock-token-12345');
  const [versionHeader, setVersionHeader] = useState('1.0.0');
  
  // GET params
  const [queryType, setQueryType] = useState('');
  const [queryRecipient, setQueryRecipient] = useState('');
  const [queryLimit, setQueryLimit] = useState('5');

  // POST params
  const [bodyType, setBodyType] = useState('Result');
  const [bodyMessage, setBodyMessage] = useState('semester results declared');
  const [bodyRecipient, setBodyRecipient] = useState('student-402');

  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [sandboxed, setSandboxed] = useState(false);

  // Check if backend is reachable on load
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/evaluation-service/health`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      } catch (e) {
        setBackendOnline(false);
      }
    };
    checkHealth();
  }, []);

  const handleSend = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseTime(null);
    setResponseBody('');
    setSandboxed(false);

    const start = Date.now();
    let url = '';
    let method = 'GET';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Version': versionHeader,
    };

    if (endpoint !== 'GET /health' && authHeader) {
      headers['Authorization'] = authHeader;
    }

    let bodyData: string | undefined = undefined;

    if (endpoint === 'GET /notifications') {
      method = 'GET';
      const params = new URLSearchParams();
      if (queryType) params.append('type', queryType);
      if (queryRecipient) params.append('recipient', queryRecipient);
      if (queryLimit) params.append('limit', queryLimit);
      url = `${BACKEND_URL}/evaluation-service/notifications?${params.toString()}`;
    } else if (endpoint === 'POST /notifications') {
      method = 'POST';
      url = `${BACKEND_URL}/evaluation-service/notifications`;
      bodyData = JSON.stringify({
        Type: bodyType,
        Message: bodyMessage,
        Recipient: bodyRecipient
      });
    } else {
      method = 'GET';
      url = `${BACKEND_URL}/evaluation-service/health`;
    }

    try {
      // Attempt to query the backend
      const res = await fetch(url, {
        method,
        headers,
        body: bodyData,
        signal: AbortSignal.timeout(3000)
      });
      
      const duration = Date.now() - start;
      const data = await res.json();
      
      setResponseStatus(res.status);
      setResponseTime(duration);
      setResponseBody(JSON.stringify(data, null, 2));
      
      const headersMap: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headersMap[key] = val;
      });
      setResponseHeaders(headersMap);
      setBackendOnline(true);
    } catch (error) {
      console.warn("Express backend offline or timed out. Falling back to sandbox execution:", error);
      // Run mock fallback
      runSandboxMock(method, start, bodyData);
    } finally {
      setIsLoading(false);
    }
  };

  const runSandboxMock = (method: string, start: number, bodyData?: string) => {
    setSandboxed(true);
    const mockLatency = Math.floor(Math.random() * 80) + 70; // 70-150ms

    setTimeout(() => {
      const duration = Date.now() - start + mockLatency;
      setResponseTime(duration);
      setResponseHeaders({
        'content-type': 'application/json; charset=utf-8',
        'x-sandbox-fallback': 'true',
        'cache-control': 'no-store'
      });

      // Quick auth check simulator
      if (endpoint !== 'GET /health' && !authHeader) {
        setResponseStatus(401);
        setResponseBody(JSON.stringify({
          error: "Unauthorized",
          message: "Authentication credentials missing. Provide a Bearer Token in the Authorization header."
        }, null, 2));
        return;
      }

      if (endpoint === 'GET /notifications') {
        let mockData = [
          {
            ID: "d146095a-d806-4a34-9e69-3900a14576bc",
            Type: "Result",
            Message: "mid-sem results published",
            Timestamp: "2026-04-22 17:51:30",
            Recipient: "student-101",
            Status: "sent"
          },
          {
            ID: "c257195a-e907-5b45-0f70-4a00b24687cd",
            Type: "System",
            Message: "Backup complete",
            Timestamp: "2026-06-08 09:30:15",
            Recipient: "admin-system",
            Status: "sent"
          },
          {
            ID: "a368295b-f018-6c56-1a81-5b11c35798de",
            Type: "Alert",
            Message: "High database memory utilisation",
            Timestamp: "2026-06-08 10:15:00",
            Recipient: "devops-team",
            Status: "sent"
          }
        ];

        if (queryType) {
          mockData = mockData.filter(n => n.Type.toLowerCase() === queryType.toLowerCase());
        }
        if (queryRecipient) {
          mockData = mockData.filter(n => n.Recipient.toLowerCase() === queryRecipient.toLowerCase());
        }
        const limitVal = parseInt(queryLimit);
        if (!isNaN(limitVal)) {
          mockData = mockData.slice(0, limitVal);
        }

        setResponseStatus(200);
        setResponseBody(JSON.stringify({ notifications: mockData }, null, 2));
      } else if (endpoint === 'POST /notifications') {
        try {
          const body = JSON.parse(bodyData || '{}');
          if (!body.Type || !body.Message || !body.Recipient) {
            setResponseStatus(400);
            setResponseBody(JSON.stringify({
              error: "Bad Request",
              message: "Missing required fields: Type, Message, and Recipient are mandatory."
            }, null, 2));
            return;
          }

          setResponseStatus(201);
          setResponseBody(JSON.stringify({
            ID: crypto.randomUUID ? crypto.randomUUID() : "mock-uuid-8893-bcde",
            Type: body.Type,
            Message: body.Message,
            Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            Recipient: body.Recipient,
            Status: 'sent'
          }, null, 2));
        } catch (e) {
          setResponseStatus(400);
          setResponseBody(JSON.stringify({ error: "Invalid JSON body payload" }, null, 2));
        }
      } else {
        setResponseStatus(200);
        setResponseBody(JSON.stringify({
          status: "healthy (sandbox)",
          timestamp: new Date().toISOString(),
          uptime: 3600,
          services: {
            database: "operational",
            emailGateway: "operational",
            smsGateway: "operational",
            pushGateway: "operational"
          },
          latency: {
            dbResponseMs: 10,
            averageReqLatencyMs: 85
          }
        }, null, 2));
      }
    }, mockLatency);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(responseBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="playground" className="border border-border rounded-xl bg-card overflow-hidden shadow-sm no-print my-8">
      {/* Playground Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
          <h3 className="font-semibold text-foreground text-sm sm:text-base">Interactive API Playground</h3>
        </div>
        
        {/* Backend Connectivity Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {backendOnline === true ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Wifi className="w-3.5 h-3.5" /> Backend Connected
            </span>
          ) : backendOnline === false ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium" title="Will fallback to local mock sandbox">
              <WifiOff className="w-3.5 h-3.5" /> Sandbox Mode
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              <RefreshCw className="w-3 h-3 animate-spin" /> Verifying Connection
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Controls / Inputs */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-border space-y-5">
          {/* Endpoint Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Endpoint</label>
            <select
              value={endpoint}
              onChange={e => setEndpoint(e.target.value as EndpointPath)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="GET /notifications">GET /evaluation-service/notifications</option>
              <option value="POST /notifications">POST /evaluation-service/notifications</option>
              <option value="GET /health">GET /evaluation-service/health</option>
            </select>
          </div>

          {/* Headers Block */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Headers</h4>
            <div className="space-y-3 p-3.5 border border-border rounded-lg bg-muted/10">
              {endpoint !== 'GET /health' && (
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Authorization</label>
                  <input
                    type="text"
                    value={authHeader}
                    onChange={e => setAuthHeader(e.target.value)}
                    placeholder="Bearer token"
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">X-Version</label>
                <input
                  type="text"
                  value={versionHeader}
                  onChange={e => setVersionHeader(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Parameters Section (Dynamic based on endpoint selected) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Parameters</h4>

            {endpoint === 'GET /notifications' && (
              <div className="space-y-3 p-3.5 border border-border rounded-lg bg-muted/10">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">type (filter)</label>
                  <select
                    value={queryType}
                    onChange={e => setQueryType(e.target.value)}
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">No Filter (All)</option>
                    <option value="Result">Result</option>
                    <option value="System">System</option>
                    <option value="Alert">Alert</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">recipient (query filter)</label>
                  <input
                    type="text"
                    value={queryRecipient}
                    onChange={e => setQueryRecipient(e.target.value)}
                    placeholder="student-101"
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">limit (pagination)</label>
                  <input
                    type="number"
                    value={queryLimit}
                    onChange={e => setQueryLimit(e.target.value)}
                    placeholder="5"
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            {endpoint === 'POST /notifications' && (
              <div className="space-y-3 p-3.5 border border-border rounded-lg bg-muted/10">
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Type (JSON property)</label>
                  <select
                    value={bodyType}
                    onChange={e => setBodyType(e.target.value)}
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="Result">Result</option>
                    <option value="System">System</option>
                    <option value="Alert">Alert</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Message</label>
                  <input
                    type="text"
                    value={bodyMessage}
                    onChange={e => setBodyMessage(e.target.value)}
                    placeholder="Message content"
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted-foreground mb-1">Recipient</label>
                  <input
                    type="text"
                    value={bodyRecipient}
                    onChange={e => setBodyRecipient(e.target.value)}
                    placeholder="student-402"
                    className="w-full rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            )}

            {endpoint === 'GET /health' && (
              <div className="p-3.5 border border-dashed border-border rounded-lg text-center text-xs text-muted-foreground">
                No parameters required for health check.
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-opacity-90 active:scale-[0.99] text-primary-foreground font-semibold px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Executing Request...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Request
              </>
            )}
          </button>
        </div>

        {/* Results Screen */}
        <div className="bg-muted/10 p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Response Console</span>
              {responseStatus && (
                <div className="flex items-center gap-2">
                  {sandboxed && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">
                      Sandbox Output
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {responseStatus} Status
                  </span>
                  {responseTime && (
                    <span className="text-xs text-muted-foreground font-mono font-medium">
                      {responseTime}ms
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Response Console Box */}
            <div className="relative flex-grow rounded-lg border border-border bg-card/60 dark:bg-black/50 p-4 font-mono text-xs overflow-auto h-72 lg:h-96 leading-relaxed shadow-inner">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/30 dark:bg-black/20 backdrop-blur-xs">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">Waiting for response...</span>
                </div>
              ) : responseBody ? (
                <>
                  <button
                    onClick={handleCopyBody}
                    className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
                    title="Copy response JSON"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <pre className="whitespace-pre overflow-x-auto text-foreground mt-2">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightJson(responseBody),
                      }}
                    />
                  </pre>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-xs text-muted-foreground italic">
                  Run standard queries to inspect returned responses.
                </div>
              )}
            </div>
            
            {/* Headers preview if loaded */}
            {responseStatus && Object.keys(responseHeaders).length > 0 && (
              <div className="border border-border rounded-lg bg-card/45 p-3">
                <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Response Headers</span>
                <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[10px] text-muted-foreground">
                  {Object.entries(responseHeaders).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-border/50 pb-0.5">
                      <span className="font-semibold">{key}:</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
