import React from 'react';
import { PageHeader, Panel, AdminButton } from '../components/ui';
import { useAppState } from '../../hooks/useAppState';

export function AdminModulePage({ title, description }: { title: string; description: string }) {
  const { notify } = useAppState();

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title={title} subtitle={description} />
      <Panel title={title}>
        <p className="text-sm leading-relaxed text-[var(--admin-muted)]">{description}</p>
        <AdminButton className="mt-4" onClick={() => notify(`${title} workspace ready`, 'info')}>
          Open workspace
        </AdminButton>
      </Panel>
    </div>
  );
}
