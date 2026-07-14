import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader, Panel, EmptyState } from '../components/ui';

type Log = {
  _id?: string;
  action: string;
  entity?: string;
  createdAt?: string;
  userId?: string;
};

export function AdminActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await adminService.getLogs();
      setLogs((res as { logs?: Log[] }).logs ?? []);
    })();
  }, []);

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Activity logs" subtitle="Audit trail for admin and system events" />
      <Panel flush>
        <ul className="divide-y divide-[var(--admin-border)]">
          {logs.map((log) => (
            <li key={log._id ?? log.action} className="flex justify-between gap-4 px-5 py-4 text-sm">
              <span className="text-[var(--admin-fg)]">{log.action}</span>
              <span className="text-[var(--admin-muted)]">
                {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
              </span>
            </li>
          ))}
        </ul>
        {!logs.length && (
          <EmptyState title="No logs yet" description="Actions will appear after API activity." />
        )}
      </Panel>
    </div>
  );
}
