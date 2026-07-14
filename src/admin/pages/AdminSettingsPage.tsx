import React from 'react';
import { appConfig } from '../../lib/config';
import { PageHeader, Panel, AdminInput, AdminButton } from '../components/ui';
import { useAppState } from '../../hooks/useAppState';

export function AdminSettingsPage() {
  const { notify } = useAppState();

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Settings" subtitle="Store branding and operations" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Store">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--admin-muted)]">Brand name</label>
              <AdminInput readOnly value={appConfig.brandName} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-[var(--admin-muted)]">Tagline</label>
              <AdminInput readOnly value={appConfig.brandTagline} className="mt-1" />
            </div>
            <div>
              <label className="text-xs text-[var(--admin-muted)]">Currency</label>
              <AdminInput readOnly value={appConfig.currency} className="mt-1" />
            </div>
          </div>
        </Panel>
        <Panel title="Notifications">
          <p className="mb-4 text-sm text-[var(--admin-muted)]">
            WhatsApp order alerts, email automation, and SMS — configure in server .env
          </p>
          <AdminButton variant="secondary" onClick={() => notify('Settings saved', 'info')}>
            Save preferences
          </AdminButton>
        </Panel>
      </div>
    </div>
  );
}
