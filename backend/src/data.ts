export interface Notification {
  ID: string;
  Type: 'Result' | 'System' | 'Alert' | 'Maintenance';
  Message: string;
  Timestamp: string;
  Recipient?: string;
  Status?: 'sent' | 'pending' | 'failed';
}

export const notificationsDb: Notification[] = [
  {
    ID: "d146095a-d806-4a34-9e69-3900a14576bc",
    Type: "Result",
    Message: "mid-sem",
    Timestamp: "2026-04-22 17:51:30",
    Recipient: "student-101",
    Status: "sent"
  },
  {
    ID: "c257195a-e907-5b45-0f70-4a00b24687cd",
    Type: "System",
    Message: "Database migration successful",
    Timestamp: "2026-06-08 09:30:15",
    Recipient: "admin-system",
    Status: "sent"
  },
  {
    ID: "a368295b-f018-6c56-1a81-5b11c35798de",
    Type: "Alert",
    Message: "High CPU usage detected on pods",
    Timestamp: "2026-06-08 10:15:00",
    Recipient: "devops-team",
    Status: "sent"
  },
  {
    ID: "e479395c-a129-7d67-2b92-6c22d46809ef",
    Type: "Maintenance",
    Message: "Scheduled maintenance window starting at 23:00 UTC",
    Timestamp: "2026-06-08 10:45:22",
    Recipient: "all-users",
    Status: "sent"
  }
];
