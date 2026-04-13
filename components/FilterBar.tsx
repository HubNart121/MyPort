'use client';

import { useState } from 'react';
import { STOCK_STATUS, ASSET_TYPE, PORT_TYPE } from '@/lib/types';
import type { StockStatus, AssetType, PortType } from '@/lib/types';

interface FilterBarProps {
  onStatusChange: (status: StockStatus | 'All') => void;
  onAssetTypeChange: (type: AssetType | 'All') => void;
  onPortChange: (port: PortType | 'All') => void;
  activeStatus: StockStatus | 'All';
  activeType: AssetType | 'All';
  activePort: PortType | 'All';
  totalCount: number;
  filteredCount: number;
}

export function FilterBar({
  onStatusChange,
  onAssetTypeChange,
  onPortChange,
  activeStatus,
  activeType,
  activePort,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Port Type row */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
          Filter by Port Type
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            className={`filter-chip ${activePort === 'All' ? 'active' : ''}`}
            onClick={() => onPortChange('All')}
          >
            All Ports
          </button>
          {PORT_TYPE.map((p) => (
            <button
              key={p}
              className={`filter-chip ${activePort === p ? 'active' : ''}`}
              onClick={() => onPortChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Status row */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
          Filter by Status
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            className={`filter-chip ${activeStatus === 'All' ? 'active' : ''}`}
            onClick={() => onStatusChange('All')}
          >
            All
          </button>
          {STOCK_STATUS.map((s) => (
            <button
              key={s}
              className={`filter-chip ${activeStatus === s ? 'active' : ''}`}
              onClick={() => onStatusChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Type row */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
          Filter by Asset Type
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            className={`filter-chip ${activeType === 'All' ? 'active' : ''}`}
            onClick={() => onAssetTypeChange('All')}
          >
            All Types
          </button>
          {ASSET_TYPE.map((t) => (
            <button
              key={t}
              className={`filter-chip ${activeType === t ? 'active' : ''}`}
              onClick={() => onAssetTypeChange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <span className="mono" style={{ color: 'var(--amber)' }}>{filteredCount}</span>
        <span> of </span>
        <span className="mono">{totalCount}</span>
        <span> stocks</span>
      </div>
    </div>
  );
}
