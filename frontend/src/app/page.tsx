"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import EndpointCard, { Parameter, HeaderItem } from '../components/EndpointCard';
import Playground from '../components/Playground';
import Dashboard from '../components/Dashboard';
import SearchModal from '../components/SearchModal';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { FileDown } from 'lucide-react';

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navSectionIds = [
    'overview',
    'deliverables',
    'architecture',
    'authentication',
    'versioning',
    'role-access',
    'endpoints',
    'post-notifications',
    'error-codes',
    'playground',
    'testing-guide',
    'deployment-guide',
    'status-dashboard'
  ];

  const activeId = useScrollSpy(navSectionIds, 160);

  const handlePrint = () => {
    window.print();
  };

  const getNotificationsParams: Parameter[] = [
    { name: 'type', type: 'string', required: false, description: 'Filter history by notification channel type: Result, System, Alert, Maintenance' },
    { name: 'recipient', type: 'string', required: false, description: 'Filter history by recipient identifier string (e.g. student-101)' },
    { name: 'limit', type: 'integer', required: false, description: 'Limit the number of returned notifications records', default: '20' }
  ];

  const notificationsHeaders: HeaderItem[] = [
    { name: 'Authorization', type: 'string', required: true, description: 'Bearer authentication token wrapper', example: 'Bearer mock-token-12345' },
    { name: 'X-Version', type: 'string', required: false, description: 'Semantic version of the target API layer', example: '1.0.0' }
  ];

  const postNotificationsParams: Parameter[] = [
    { name: 'Type', type: 'string', required: true, description: 'Target channel. Must be one of: Result, System, Alert, Maintenance' },
    { name: 'Message', type: 'string', required: true, description: 'Plain text payload or formatting layout of the notification message' },
    { name: 'Recipient', type: 'string', required: true, description: 'Audience identifier or destination address/phone/channel name' }
  ];

  const sampleGetNotificationsCurl = `curl -X GET "http://localhost:3001/evaluation-service/notifications?limit=1&type=Result" \\
  -H "Authorization: Bearer mock-token-12345" \\
  -H "X-Version: 1.0.0"`;

  const sampleGetNotificationsResponse = `{
  "notifications": [
    {
      "ID": "d146095a-d806-4a34-9e69-3900a14576bc",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30",
      "Recipient": "student-101",
      "Status": "sent"
    }
  ]
}`;

  const samplePostNotificationsCurl = `curl -X POST "http://localhost:3001/evaluation-service/notifications" \\
  -H "Authorization: Bearer mock-token-12345" \\
  -H "Content-Type: application/json" \\
  -H "X-Version: 1.0.0" \\
  -d '{
    "Type": "Result",
    "Message": "mid-sem results published",
    "Recipient": "student-101"
  }'`;

  const samplePostNotificationsBody = `{
  "Type": "Result",
  "Message": "mid-sem results published",
  "Recipient": "student-101"
}`;

  const samplePostNotificationsResponse = `{
  "ID": "d146095a-d806-4a34-9e69-3900a14576bc",
  "Type": "Result",
  "Message": "mid-sem results published",
  "Timestamp": "2026-06-08 11:00:00",
  "Recipient": "student-101",
  "Status": "sent"
}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <Sidebar activeId={activeId} onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Documentation Area */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 no-print lg:border-b-0 lg:bg-transparent">
          <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
            <span>Docs</span>
            <span>/</span>
            <span className="font-semibold text-foreground">evaluation-service</span>
          </div>

          <div className="flex items-center gap-4 ml-auto lg:ml-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all font-semibold outline-none focus:ring-1 focus:ring-ring"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow px-6 py-10 sm:px-10 lg:px-12 max-w-7xl mx-auto w-full pt-20 lg:pt-10 print-full-width">
          <div className="grid grid-cols-1 gap-12 print-full-width">
            
            {/* 1. Main Static Guides & Details */}
            <MainContent />

            {/* 2. API Reference Section Header */}
            <div id="endpoints" className="border-t border-border pt-12 mt-4 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Endpoint References</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Detailed references for querying and dispatching notification payloads.
              </p>
            </div>

            {/* Endpoint 1: GET /notifications */}
            <EndpointCard
              id="get-notifications"
              method="GET"
              url="/evaluation-service/notifications"
              description="Retrieve notification histories. Supports granular filtering by channel Type, Recipient identifier tags, and result set limits."
              authRequired={true}
              requiredRole="Read:Notifications"
              parameters={getNotificationsParams}
              headers={notificationsHeaders}
              sampleRequestCurl={sampleGetNotificationsCurl}
              sampleResponse={sampleGetNotificationsResponse}
            />

            {/* Endpoint 2: POST /notifications */}
            <EndpointCard
              id="post-notifications"
              method="POST"
              url="/evaluation-service/notifications"
              description="Dispatch a new system/alert notification. The gateway asynchronously pushes the message task to Kafka queue."
              authRequired={true}
              requiredRole="Write:Notifications"
              parameters={postNotificationsParams}
              headers={notificationsHeaders}
              sampleRequestCurl={samplePostNotificationsCurl}
              sampleRequestBody={samplePostNotificationsBody}
              sampleResponse={samplePostNotificationsResponse}
            />

            {/* 3. Operational status dashboard */}
            <div className="border-t border-border pt-12 mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Operational Analytics</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Real-time API health stats, average response latency metrics, and network gateway status tracking.
              </p>
              <Dashboard />
            </div>

            {/* 4. Interactive playground */}
            <div className="border-t border-border pt-12 mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Live API Testing Console</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Interact with the notification services backend inside this active playground module.
              </p>
              <Playground />
            </div>

          </div>
        </main>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
