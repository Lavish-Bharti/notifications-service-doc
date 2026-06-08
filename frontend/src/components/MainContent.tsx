"use client";

import React from 'react';
import { BookOpen, Shield, Code, Settings, ListCollapse, AlertTriangle, ArrowRight, Play, Terminal } from 'lucide-react';

export default function MainContent() {
  return (
    <div className="space-y-16 max-w-4xl text-foreground">
      {/* SECTION: Overview */}
      <section id="overview" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Overview</h2>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Welcome to the official API Documentation for the <strong>Notifications Microservice</strong>. 
          This high-throughput enterprise-grade service serves as the unified orchestration layer for outbound notifications 
          across the entire organization. It simplifies communication dispatch by abstracting integration details for 
          email, SMS, mobile pushes, and Slack alerts.
        </p>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          The microservice is engineered to support auto-scaling, intelligent routing fallback mechanisms, 
          and audit trails. It is part of the <code>evaluation-service</code> cluster, exposing high-availability RESTful 
          endpoints designed to process notifications reliably at scale.
        </p>
      </section>

      {/* SECTION: Deliverables */}
      <section id="deliverables" className="scroll-mt-24 space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Deliverables & Channels</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The service handles asynchronous dispatching of messages using prioritized worker queues.
          Depending on the request parameters, the notification will be parsed and formatted for the corresponding channel:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-border p-4 rounded-xl bg-card">
            <h4 className="font-bold text-foreground text-sm mb-1.5">📧 Email Dispatcher</h4>
            <p className="text-xs text-muted-foreground">Uses SMTP/SES gateways. Supports custom HTML templates, attachments, and tracking pixels.</p>
          </div>
          <div className="border border-border p-4 rounded-xl bg-card">
            <h4 className="font-bold text-foreground text-sm mb-1.5">💬 SMS Dispatcher</h4>
            <p className="text-xs text-muted-foreground">Powered by Twilio and Sinch. Implements smart number pooling and localized country-code routing.</p>
          </div>
          <div className="border border-border p-4 rounded-xl bg-card">
            <h4 className="font-bold text-foreground text-sm mb-1.5">📱 Mobile Push Gateway</h4>
            <p className="text-xs text-muted-foreground">Integrates with Firebase (FCM) and Apple Push (APNs) using device token mapping databases.</p>
          </div>
          <div className="border border-border p-4 rounded-xl bg-card">
            <h4 className="font-bold text-foreground text-sm mb-1.5">🤖 Slack Webhooks</h4>
            <p className="text-xs text-muted-foreground">Posts rich message payloads (Blocks layout) directly into Slack workspace channels.</p>
          </div>
        </div>
      </section>

      {/* SECTION: Architecture */}
      <section id="architecture" className="scroll-mt-24 space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Microservice Architecture</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The notification flow is decoupled using an event-driven architecture. Standard API requests hit the Gateway, 
          which validates authorization before pushing tasks to our message broker queue for async workers.
        </p>

        {/* Visual Architecture Flow Diagram */}
        <div className="border border-border rounded-xl p-6 bg-muted/20 space-y-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2 py-4">
            {/* Box 1 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card w-32 shadow-xs text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Client App</span>
              <span className="text-xs text-foreground font-semibold mt-1">evaluation-service</span>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />

            {/* Box 2 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card w-36 shadow-xs text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">API Gateway</span>
              <span className="text-xs text-foreground font-semibold mt-1">Authentication check</span>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />

            {/* Box 3 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-primary/30 bg-primary/10 w-40 shadow-xs text-center">
              <span className="text-[10px] font-bold text-primary uppercase">Notifications API</span>
              <span className="text-xs text-foreground font-semibold mt-1">Express Node Engine</span>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />

            {/* Box 4 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card w-32 shadow-xs text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Broker Queue</span>
              <span className="text-xs text-foreground font-semibold mt-1">RabbitMQ / Kafka</span>
            </div>

            <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />

            {/* Box 5 */}
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-card w-36 shadow-xs text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Workers</span>
              <span className="text-xs text-foreground font-semibold mt-1">SES/Twilio Gateway</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-muted-foreground font-mono">
            Event-Driven Architecture: Ensuring low-latency dispatch and horizontal scaling
          </div>
        </div>
      </section>

      {/* SECTION: Authentication */}
      <section id="authentication" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Authentication</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The API supports two authentication modes depending on whether it is accessed by an end-user client or an internal service:
        </p>

        <div className="space-y-4 mt-4">
          <div className="border border-border p-4 rounded-xl bg-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-secondary px-2 py-0.5 rounded">Mode A</span>
              <h4 className="font-bold text-foreground text-sm">Bearer Token (JWT)</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Pass as a standard Authorization header. Required for user-facing applications.
            </p>
            <pre className="text-[11px] font-mono p-2.5 rounded bg-muted/65 border border-border text-foreground overflow-x-auto">
              Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
            </pre>
          </div>

          <div className="border border-border p-4 rounded-xl bg-card space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-secondary px-2 py-0.5 rounded">Mode B</span>
              <h4 className="font-bold text-foreground text-sm">X-API-Key Header</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Required for machine-to-machine integrations or system microservices within the internal VPC.
            </p>
            <pre className="text-[11px] font-mono p-2.5 rounded bg-muted/65 border border-border text-foreground overflow-x-auto">
              X-API-Key: ns_live_8892f03bc7e1a384bcda90
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION: API Versioning */}
      <section id="versioning" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">API Versioning</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          All endpoints in the notification microservice support explicit versioning to prevent breaking client changes.
          Clients are required to send the version header:
        </p>
        <pre className="text-xs font-mono p-3 rounded-lg bg-card border border-border text-foreground overflow-x-auto">
          X-Version: 1.0.0
        </pre>
        <p className="text-xs text-muted-foreground">
          If the <code>X-Version</code> header is absent, the system defaults routing to the latest stable release (V1.0.0).
        </p>
      </section>

      {/* SECTION: Role-Based Access Control */}
      <section id="role-access" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Role-Based Access (RBAC)</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The gateway inspects token scopes or API key credentials to enforce granular access privileges:
        </p>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-3 font-semibold text-foreground">Endpoint</th>
                <th className="p-3 font-semibold text-foreground">Required Scope</th>
                <th className="p-3 font-semibold text-foreground text-center">User Role</th>
                <th className="p-3 font-semibold text-foreground text-center">System Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-bold text-foreground">GET /notifications</td>
                <td className="p-3 text-muted-foreground">read:notifications</td>
                <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">Allowed</td>
                <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-bold text-foreground">POST /notifications</td>
                <td className="p-3 text-muted-foreground">write:notifications</td>
                <td className="p-3 text-center text-rose-500 font-semibold font-sans">Denied</td>
                <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">Allowed</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-bold text-foreground">GET /health</td>
                <td className="p-3 text-muted-foreground">public</td>
                <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">Allowed</td>
                <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">Allowed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: Error Codes */}
      <section id="error-codes" className="scroll-mt-24 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Error Codes</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Standard JSON payloads are returned for all client/server errors:
        </p>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-3 font-semibold text-foreground">HTTP Status</th>
                <th className="p-3 font-semibold text-foreground">Error Name</th>
                <th className="p-3 font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs sm:text-sm">
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-mono font-bold text-rose-500">400 Bad Request</td>
                <td className="p-3 font-mono text-foreground">Invalid Payload</td>
                <td className="p-3 text-muted-foreground">Required JSON property (e.g. Type, Message) is missing.</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-mono font-bold text-rose-500">401 Unauthorized</td>
                <td className="p-3 font-mono text-foreground">Credentials Missing</td>
                <td className="p-3 text-muted-foreground">Authorization token or API key header is missing or malformed.</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-mono font-bold text-rose-500">403 Forbidden</td>
                <td className="p-3 font-mono text-foreground">Scope Violation</td>
                <td className="p-3 text-muted-foreground">Authenticated identity lacks the required scope (e.g. write:notifications).</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-3 font-mono font-bold text-rose-500">429 Too Many Requests</td>
                <td className="p-3 font-mono text-foreground">Rate Limit Exceeded</td>
                <td className="p-3 text-muted-foreground">Standard limit is 100 requests per minute per IP.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: Testing Guide */}
      <section id="testing-guide" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Code className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Testing Guide</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We provide automated test suites and cURL configurations to expedite system verification.
        </p>

        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">1. Automated Integration Tests (Jest)</h4>
          <p className="text-xs text-muted-foreground">
            Run integration tests locally using Node to verify route payloads:
          </p>
          <pre className="text-xs font-mono p-3 rounded-lg bg-card border border-border text-foreground flex items-center justify-between overflow-x-auto">
            <span>npm run test:integration</span>
            <Terminal className="w-4 h-4 text-muted-foreground no-print" />
          </pre>

          <h4 className="text-sm font-semibold text-foreground">2. Manual Terminal Testing</h4>
          <p className="text-xs text-muted-foreground">
            Test the live REST endpoints directly from your CLI:
          </p>
          <pre className="text-[11px] sm:text-xs font-mono p-3 rounded-lg bg-card border border-border text-foreground overflow-x-auto leading-relaxed">
            {`curl -X POST http://localhost:3001/evaluation-service/notifications \\
  -H "Authorization: Bearer mock-token-12345" \\
  -H "Content-Type: application/json" \\
  -d '{
    "Type": "Result",
    "Message": "Final semester grades posted",
    "Recipient": "student-301"
  }'`}
          </pre>
        </div>
      </section>

      {/* SECTION: Deployment Guide */}
      <section id="deployment-guide" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Deployment Guide</h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The microservice is compiled into a lightweight Docker image for production deployments.
        </p>

        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-semibold text-foreground">Dockerizing the Service</h4>
          <p className="text-xs text-muted-foreground">
            Use the standard Dockerfile pattern to build the containerized service:
          </p>
          <pre className="text-[11px] sm:text-xs font-mono p-3 rounded-lg bg-card border border-border text-foreground overflow-x-auto leading-relaxed">
            {`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]`}
          </pre>

          <h4 className="text-sm font-semibold text-foreground">Kubernetes Pod Specification</h4>
          <p className="text-xs text-muted-foreground">
            Integrate within standard Kubernetes deployments with horizontal pod scaling:
          </p>
          <pre className="text-[10px] sm:text-xs font-mono p-3 rounded-lg bg-card border border-border text-foreground overflow-x-auto leading-relaxed">
            {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: notifications-deployment
  namespace: evaluation-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: notifications-microservice`}
          </pre>
        </div>
      </section>
    </div>
  );
}
