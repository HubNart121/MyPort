'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { STOCK_STATUS, ASSET_TYPE, PORT_TYPE } from '@/lib/types';
import type { Stock } from '@/lib/types';

const toNum = (v: unknown) => (v === '' || v === undefined || v === null ? 0 : Number(v));

const schema = z.object({
  symbol: z.string().min(1, 'Required'),
  name: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  status: z.enum(['Hold', 'Plan-buy', 'Plan-sell', 'Choice']),
  asset_type: z.enum(['StockThai', 'DR', 'ETF', 'ReitThai', 'Fund', 'FundAllocation']),
  port_type: z.enum(['Private', 'Business']),
  dividend_per_share: z.coerce.number().min(0),
  target_price: z.coerce.number().min(0),
  note: z.string().optional().nullable(),
});

export type StockFormData = z.output<typeof schema>;
type StockFormInput = z.input<typeof schema>;

interface StockFormProps {
  initialData?: Partial<Stock>;
  onSubmit: (data: StockFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function StockForm({ initialData, onSubmit, onCancel, loading, submitLabel = 'บันทึก' }: StockFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StockFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      symbol: initialData?.symbol || '',
      name: initialData?.name || '',
      sector: initialData?.sector || '',
      status: (initialData?.status as any) || 'Hold',
      asset_type: (initialData?.asset_type as any) || 'StockThai',
      port_type: (initialData?.port_type as any) || 'Private',
      dividend_per_share: initialData?.dividend_per_share || 0,
      target_price: initialData?.target_price || 0,
      note: initialData?.note || '',
    },
  });

  const onFormSubmit = (data: StockFormInput) => {
    onSubmit(data as StockFormData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Symbol *</label>
            <input 
              className="form-input mono" 
              placeholder="PTT" 
              {...register('symbol')} 
              style={{ textTransform: 'uppercase' }} 
              disabled={!!initialData?.id} // Disable symbol change if editing
            />
            {errors.symbol && <span className="form-error">{errors.symbol.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">ชื่อบริษัท</label>
            <input className="form-input" placeholder="ปตท. จำกัด (มหาชน)" {...register('name')} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">กลุ่มอุตสาหกรรม</label>
            <input className="form-input" placeholder="พลังงาน" {...register('sector')} />
          </div>
          <div className="form-group">
            <label className="form-label">Type Port *</label>
            <select className="form-select" {...register('port_type')}>
              {PORT_TYPE.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Status *</label>
            <select className="form-select" {...register('status')}>
              {STOCK_STATUS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Asset Type *</label>
            <select className="form-select" {...register('asset_type')}>
              {ASSET_TYPE.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">ปันผลต่อหุ้น (฿)</label>
            <input type="number" step="0.0001" className="form-input mono" placeholder="0.00" {...register('dividend_per_share')} />
          </div>
          <div className="form-group">
            <label className="form-label">ราคาเป้าหมาย (฿)</label>
            <input type="number" step="0.01" className="form-input mono" placeholder="0.00" {...register('target_price')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            className="form-input"
            placeholder="หมายเหตุเพิ่มเติม..."
            rows={3}
            style={{ resize: 'vertical' }}
            {...register('note')}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">ยกเลิก</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : `✓ ${submitLabel}`}
          </button>
        </div>
      </div>
    </form>
  );
}
