// User Types
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar: string | null;
  created_at: string;
  subscription: {
    plan: string;
    status: string;
    expires_at: string;
  };
  preferences: {
    theme: 'dark' | 'light';
    notifications: {
      signals: boolean;
      trades: boolean;
      errors: boolean;
    };
    default_execution_mode: ExecutionMode;
  };
}

// Telegram Types
export interface TelegramProvider {
  id: string;
  name: string;
  username: string;
  description: string;
  subscribers: number;
  connected: boolean;
  connected_at: string | null;
  signal_count: number;
  accuracy: number | null;
  avatar_color: string;
}

export type MessageTag = 
  | 'SIGNAL_DETECTED' 
  | 'PARSED' 
  | 'TRADE_EXECUTED' 
  | 'TRADE_SKIPPED' 
  | 'MESSAGE_EDITED' 
  | 'MESSAGE_DELETED';

export interface TelegramMessage {
  id: string;
  provider_id: string;
  text: string;
  timestamp: string;
  edited_at: string | null;
  deleted_at: string | null;
  parsed_signal_id: string | null;
  tags: MessageTag[];
}

// Broker Types
export interface Broker {
  id: string;
  name: string;
  code: string;
  connected: boolean;
  connected_at: string | null;
  account_id: string | null;
  margin_available: number | null;
  margin_used: number | null;
  status: 'active' | 'disconnected' | 'error';
  supports: string[];
  logo_color: string;
}

// Automation Types
export type ExecutionMode = 'manual' | 'one-click' | 'auto';
export type AutomationStatus = 'running' | 'paused' | 'error';
export type SignalSource = 'telegram' | 'market_strategy';

export interface AutomationRules {
  quantity: number;
  max_quantity: number;
  stop_loss_percent: number;
  max_trades_per_day: number;
  allowed_instruments: string[];
  allowed_directions: ('BUY' | 'SELL')[];
}

export interface MarketStrategyRule {
  id: string;
  type: 'price' | 'volume' | 'rsi' | 'macd' | 'moving_average' | 'time';
  condition: 'above' | 'below' | 'crosses_above' | 'crosses_below' | 'equals';
  value: number;
  instrument?: string;
  timeframe?: '1m' | '5m' | '15m' | '30m' | '1h' | '1d';
  enabled: boolean;
}

export interface MarketStrategyRules {
  rules: MarketStrategyRule[];
  instruments: string[];
  direction: 'BUY' | 'SELL' | 'BOTH';
  websocket_enabled: boolean;
}

export interface AutomationOptions {
  ai_validation: boolean;
  delay_execution_seconds: number;
  require_confirmation: boolean;
}

export interface AutomationStats {
  win_rate: number;
  total_pnl: number;
  avg_profit: number;
  avg_loss: number;
}

export interface Automation {
  id: string;
  name: string;
  signal_source: SignalSource;
  telegram_provider_id?: string;
  broker_id: string;
  execution_mode: ExecutionMode;
  status: AutomationStatus;
  created_at: string;
  last_signal_at: string;
  trades_today: number;
  total_trades: number;
  error_message?: string;
  rules: AutomationRules;
  market_strategy_rules?: MarketStrategyRules;
  options: AutomationOptions;
  stats: AutomationStats;
}

// Signal Types
export type ExecutionStatus = 'executed' | 'skipped' | 'pending_manual' | 'pending';

export interface ParsedSignal {
  id: string;
  message_id: string;
  provider_id: string;
  automation_id: string;
  instrument: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  entry_range: { min: number; max: number };
  stop_loss: number;
  targets: number[];
  parsed_at: string;
  confidence: number;
  execution_status: ExecutionStatus;
  skip_reason?: string;
  trade_id: string | null;
}

// Trade Types
export type TradeStatus = 'open' | 'closed';
export type ExitReason = 'target_1' | 'target_2' | 'target_3' | 'stop_loss' | 'manual';

export interface Trade {
  id: string;
  signal_id: string | null;
  automation_id: string;
  instrument: string;
  direction: 'BUY' | 'SELL';
  quantity: number;
  entry_price: number;
  entry_time: string;
  current_price?: number;
  exit_price: number | null;
  exit_time: string | null;
  exit_reason: ExitReason | null;
  stop_loss: number;
  targets?: number[];
  target_hit: number;
  pnl: number;
  pnl_percent: number;
  status: TradeStatus;
  broker_order_id: string;
  broker_id: string;
  note?: string;
}

// Notification Types
export type NotificationType = 
  | 'signal_detected' 
  | 'trade_executed' 
  | 'trade_closed' 
  | 'signal_skipped'
  | 'manual_required'
  | 'error'
  | 'message_edited'
  | 'message_deleted'
  | 'automation_paused';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  automation_id?: string;
  signal_id?: string;
  trade_id?: string;
  action_required: boolean;
}

