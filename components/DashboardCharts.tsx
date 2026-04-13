'use client';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

const COLORS = [
  '#F5A623', // Amber
  '#3A8FE0', // Blue
  '#27AE60', // Green
  '#E03A3A', // Red
  '#B06AE0', // Purple
  '#60C0C0', // Cyan
  '#FF9632', // Orange
];

interface ChartDataItem {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  portData: ChartDataItem[];
  sectorData: ChartDataItem[];
  assetData: ChartDataItem[];
}

export function DashboardCharts({ portData, sectorData, assetData }: DashboardChartsProps) {
  const hasData = portData.length > 0 || sectorData.length > 0 || assetData.length > 0;

  if (!hasData) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-bright)', 
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {payload[0].name}
          </div>
          <div className="mono" style={{ fontSize: '13px', color: 'var(--amber)', fontWeight: 700 }}>
            ฿{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
      {/* Port Type Chart */}
      {portData.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">สัดส่วนตามประเภทพอร์ต (Port Type)</div>
          </div>
          <div style={{ height: '300px', width: '100%', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {portData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontFamily: 'Space Mono', textTransform: 'uppercase' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sector Chart */}
      {sectorData.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">สัดส่วนตามกลุ่มอุตสาหกรรม (Sector)</div>
          </div>
          <div style={{ height: '300px', width: '100%', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontFamily: 'Space Mono', textTransform: 'uppercase' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Asset Type Chart */}
      {assetData.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">สัดส่วนตามประเภทสินทรัพย์ (Asset)</div>
          </div>
          <div style={{ height: '300px', width: '100%', padding: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '10px', fontFamily: 'Space Mono', textTransform: 'uppercase' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
