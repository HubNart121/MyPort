-- 1. Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT,
  sector TEXT,
  status TEXT NOT NULL CHECK (status IN ('Hold', 'Plan-buy', 'Plan-sell', 'Choice')),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('StockThai', 'DR', 'ETF', 'ReitThai', 'Fund', 'FundAllocation')),
  port_type TEXT NOT NULL CHECK (port_type IN ('Private', 'Business')) DEFAULT 'Private',
  dividend_per_share NUMERIC DEFAULT 0,
  target_price NUMERIC DEFAULT 0,
  note TEXT
);

-- 2. Create buy_rounds table
CREATE TABLE IF NOT EXISTS buy_rounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  buy_date DATE NOT NULL,
  price NUMERIC NOT NULL,
  shares NUMERIC NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_rounds ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Allowing public access for simplification - adjust per your needed security level)
-- Policy for stocks
CREATE POLICY "Enable all access for stocks" ON stocks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policy for buy_rounds
CREATE POLICY "Enable all access for buy_rounds" ON buy_rounds
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Create realized_trades table
CREATE TABLE IF NOT EXISTS realized_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  sell_date DATE NOT NULL,
  shares NUMERIC NOT NULL,
  sell_price NUMERIC NOT NULL,
  avg_cost_at_sell NUMERIC NOT NULL,
  profit NUMERIC NOT NULL,
  port_type TEXT NOT NULL CHECK (port_type IN ('Private', 'Business'))
);

ALTER TABLE realized_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for realized_trades" ON realized_trades
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_realized_trades_stock_id ON realized_trades(stock_id);

-- 7. Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  detail TEXT,
  link TEXT
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for files" ON files
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. Create informations table
CREATE TABLE IF NOT EXISTS informations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  link TEXT,
  detail TEXT
);

ALTER TABLE informations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for informations" ON informations
  FOR ALL
  USING (true)
  WITH CHECK (true);
