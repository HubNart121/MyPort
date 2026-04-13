'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { calcStats, formatCurrency, formatNumber } from '@/lib/calculations';
import type { Stock, BuyRound, RealizedTrade, StockStatus, AssetType, PortType } from '@/lib/types';
import { StockCard } from '@/components/StockCard';
import { FilterBar } from '@/components/FilterBar';
import { DashboardCharts } from '@/components/DashboardCharts';
import { ToastContainer } from '@/components/Toast';

async function fetchPortfolio() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('stocks')
    .select('*, buy_rounds(*), realized_trades(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as (Stock & { buy_rounds: BuyRound[]; realized_trades: RealizedTrade[] })[];
}

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState<StockStatus | 'All'>('All');
  const [filterType, setFilterType] = useState<AssetType | 'All'>('All');
  const [filterPort, setFilterPort] = useState<PortType | 'All'>('All');
  const [activeSort, setActiveSort] = useState<string>('created_desc');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rawStocks = [], isLoading, error } = useQuery({
    queryKey: ['portfolio'],
    queryFn: fetchPortfolio,
  });

  const stocks = useMemo(() =>
    rawStocks.map((s) => calcStats(s, s.buy_rounds ?? [], s.realized_trades ?? [])),
    [rawStocks]
  );

  const filtered = useMemo(() => {
    let result = stocks.filter((s) => {
      const statusOk = filterStatus === 'All' || s.status === filterStatus;
      const typeOk = filterType === 'All' || s.asset_type === filterType;
      const portOk = filterPort === 'All' || s.port_type === filterPort;
      const searchOk = searchQuery === '' || s.symbol.toUpperCase().includes(searchQuery.toUpperCase());
      return statusOk && typeOk && portOk && searchOk;
    });

    result = result.sort((a, b) => {
      switch (activeSort) {
        case 'symbol_asc':
          return a.symbol.localeCompare(b.symbol);
        case 'invested_desc':
          return b.total_invested - a.total_invested;
        case 'profit_desc':
          return b.expected_profit - a.expected_profit;
        case 'profit_asc':
          return a.expected_profit - b.expected_profit;
        case 'yield_desc':
          return (b.dividend_yield_pct || 0) - (a.dividend_yield_pct || 0);
        case 'created_desc':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [stocks, filterStatus, filterType, filterPort, activeSort, searchQuery]);

  // Portfolio summary stats (Now calculated from filtered stocks)
  const totalInvested = filtered.reduce((a, s) => a + s.total_invested, 0);
  const totalExpectedProfit = filtered.reduce((a, s) => a + s.expected_profit, 0);
  const totalDividend = filtered.reduce((a, s) => a + s.total_dividend, 0);
  const totalRealizedProfit = filtered.reduce((a, s) => a + s.total_realized_profit, 0);
  const holdCountInFiltered = filtered.filter((s) => s.status === 'Hold').length;

  // Pie Chart Data
  const portData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(s => {
      if (s.total_invested <= 0) return;
      map[s.port_type] = (map[s.port_type] || 0) + s.total_invested;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const sectorData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(s => {
      if (s.total_invested <= 0) return;
      const key = s.sector || 'Other';
      map[key] = (map[key] || 0) + s.total_invested;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const assetData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(s => {
      if (s.total_invested <= 0) return;
      map[s.asset_type] = (map[s.asset_type] || 0) + s.total_invested;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const stackedData = useMemo(() => {
    const portMap: Record<string, any> = {};
    const sectorSet = new Set<string>();
    
    filtered.forEach(s => {
      if (s.total_invested <= 0) return;
      const port = s.port_type;
      const sector = s.sector || 'Other';
      sectorSet.add(sector);
      
      if (!portMap[port]) {
        portMap[port] = { name: port, total: 0 };
      }
      portMap[port][sector] = (portMap[port][sector] || 0) + s.total_invested;
      portMap[port].total += s.total_invested;
    });
    
    return {
      data: Object.values(portMap).sort((a, b) => b.total - a.total),
      sectors: Array.from(sectorSet).sort()
    };
  }, [filtered]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="mono" style={{ fontSize: '12px' }}>LOADING PORTFOLIO...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: 'var(--red)', fontSize: '13px' }}>
          ⚠ ไม่สามารถโหลดข้อมูลได้: {(error as Error).message}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          กรุณาตรวจสอบ Supabase credentials ใน .env.local
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in">
        {/* Portfolio Summary */}
        <div className="page-header">
          <div>
            <div className="page-title">PORTFOLIO OVERVIEW</div>
            <div className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>
              <span className="mono" style={{ color: 'var(--amber)' }}>{filtered.length}</span> หุ้นที่แสดง ·{' '}
              <span className="mono" style={{ color: 'var(--amber)' }}>{holdCountInFiltered}</span> Hold (จากทั้งหมด {stocks.length})
            </div>
          </div>
          <Link href="/stocks/new" className="btn btn-primary">
            + เพิ่มหุ้นใหม่
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-stagger stats-grid">
          <div className="stat-card">
            <div className="stat-label">เงินลงทุนปัจจุบัน</div>
            <div className="stat-value amber">{formatCurrency(totalInvested)}</div>
            <div className="stat-sub" style={{ color: 'var(--text-secondary)' }}>Current holdings only</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ปันผลรวมคาดการณ์</div>
            <div className="stat-value green">{formatCurrency(totalDividend)}</div>
            <div className="stat-sub" style={{ color: 'var(--text-secondary)' }}>Annual estimate</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">กำไรสุทธิคาดการณ์</div>
            <div className={`stat-value ${totalExpectedProfit >= 0 ? 'green' : 'red'}`}>
              {formatCurrency(totalExpectedProfit)}
            </div>
            <div className="stat-sub" style={{ color: 'var(--text-secondary)' }}>Unrealized performance</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '2px solid var(--amber)' }}>
            <div className="stat-label">กำไรที่ทำได้จริง</div>
            <div className={`stat-value ${totalRealizedProfit >= 0 ? 'green' : 'red'}`}>
              {formatCurrency(totalRealizedProfit)}
            </div>
            <div className="stat-sub" style={{ color: 'var(--text-secondary)' }}>Total realized (closed trades)</div>
          </div>
        </div>

        <div className="divider" />

        {/* Charts Section */}
        <DashboardCharts 
          portData={portData} 
          sectorData={sectorData} 
          assetData={assetData} 
          stackedData={stackedData}
        />

        <div className="divider" />

        {/* Filters */}
        <FilterBar
          onStatusChange={setFilterStatus}
          onAssetTypeChange={setFilterType}
          onPortChange={setFilterPort}
          onSortChange={setActiveSort}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={filterStatus}
          activeType={filterType}
          activePort={filterPort}
          activeSort={activeSort}
          totalCount={stocks.length}
          filteredCount={filtered.length}
        />

        {/* Stock list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">
              {stocks.length === 0 ? 'ยังไม่มีหุ้นในพอร์ต' : 'ไม่พบหุ้นที่ตรงกับ Filter'}
            </div>
            <div className="empty-state-desc">
              {stocks.length === 0 ? 'เริ่มต้นด้วยการเพิ่มหุ้นตัวแรก' : 'ลองเปลี่ยน Filter เพื่อดูผลลัพธ์อื่น'}
            </div>
            {stocks.length === 0 && (
              <Link href="/stocks/new" className="btn btn-primary">+ เพิ่มหุ้นใหม่</Link>
            )}
          </div>
        ) : (
          <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Table header (Desktop only) */}
            <div className="stock-grid-layout desktop-only"
              style={{
                padding: '6px 20px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
              }}
            >
              <div>Symbol</div>
              <div>Avg Cost</div>
              <div className="tablet-hide">Invested</div>
              <div className="tablet-hide">Div Yield</div>
              <div className="tablet-hide">Expected Net</div>
              <div style={{ textAlign: 'right' }}>Type / Status</div>
            </div>
            {filtered.map((s) => (
              <StockCard key={s.id} stock={s} />
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
