"use client";

import {
  Play,
  Pause,
  Trash2,
  AlertCircle,
  ChevronRight,
  Zap,
  MousePointer,
  Bot,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type {
  Automation,
  TelegramProvider,
  Broker,
  ExecutionMode,
} from "@/types";
import clsx from "clsx";

// Custom Telegram Icon (Official Logo)
const TelegramIcon = ({
  size = 14,
  className,
  id = "tg",
}: {
  size?: number;
  className?: string;
  id?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 240 240" className={className}>
    <defs>
      <linearGradient
        id={`${id}-bg`}
        x1="-683.305"
        x2="-693.305"
        y1="534.845"
        y2="511.512"
        gradientTransform="matrix(6 0 0 -6 4255 3247)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#37aee2" />
        <stop offset="1" stopColor="#1e96c8" />
      </linearGradient>
      <linearGradient
        id={`${id}-arrow`}
        x1="128.991"
        x2="153.991"
        y1="118.245"
        y2="78.245"
        gradientTransform="matrix(1 0 0 -1 0 242)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#eff7fc" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
    </defs>
    <path
      d="M240 120c0 66.3-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0s120 53.7 120 120z"
      fill={`url(#${id}-bg)`}
    />
    <path
      d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z"
      fill="#c8daea"
    />
    <path
      d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z"
      fill="#a9c9dd"
    />
    <path
      d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z"
      fill={`url(#${id}-arrow)`}
    />
  </svg>
);

// Kite Icon Component (using Zerodha Kite logo)
const KiteIcon = ({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <img
    src="/icons/kite-zerodha.webp"
    alt="Kite"
    width={size}
    height={size}
    className={className}
  />
);

interface AutomationCardProps {
  automation: Automation;
  provider?: TelegramProvider;
  broker?: Broker;
  onEdit?: (automation: Automation) => void;
}

const executionModeConfig: Record<
  ExecutionMode,
  { label: string; icon: typeof Bot }
> = {
  auto: { label: "Auto", icon: Bot },
  "one-click": { label: "One-Click", icon: MousePointer },
  manual: { label: "Manual", icon: Zap },
};

export function AutomationCard({
  automation,
  provider,
  broker,
  onEdit,
}: AutomationCardProps) {
  const { updateAutomationStatus, deleteAutomation, theme } = useStore();

  const mode = executionModeConfig[automation.execution_mode];
  const ModeIcon = mode.icon;

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = automation.status === "running" ? "paused" : "running";
    updateAutomationStatus(automation.id, newStatus);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this automation? This action cannot be undone.")) {
      deleteAutomation(automation.id);
    }
  };

  const isRunning = automation.status === "running";
  const isError = automation.status === "error";

  return (
    <div
      onClick={() => onEdit?.(automation)}
      className={clsx(
        "p-3 card-interactive cursor-pointer",
        theme === "dark" ? "premium-card" : "bg-white border border-gray-100 shadow-sm",
        isRunning && "card-open-position"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              "text-sm font-semibold truncate tracking-tight",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {automation.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            {automation.signal_source === 'market_strategy' ? (
              <>
                <TrendingUp size={14} className="flex-shrink-0" />
                <p
                  className={clsx(
                    "text-[11px] truncate",
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  )}
                >
                  Market Strategy
                </p>
              </>
            ) : (
              <>
                <TelegramIcon
                  size={14}
                  className="flex-shrink-0"
                  id={`tg-${automation.id}`}
                />
                <p
                  className={clsx(
                    "text-[11px] truncate",
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  )}
                >
                  {provider?.name || "Unknown Provider"}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={clsx(
          "flex items-center gap-1.5 px-2 py-1",
          isRunning && "status-badge-running",
          isError && "status-badge-error",
          !isRunning && !isError && "status-badge-paused"
        )}>
          {isRunning && (
            <span className="status-dot status-dot-live" />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wide">
            {automation.status}
          </span>
        </div>
      </div>

      {/* Error message */}
      {automation.error_message && (
        <div className="flex items-start gap-2 mb-2.5 p-2 bg-loss/10 border border-loss/20">
          <AlertCircle size={12} className="text-loss flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-loss leading-tight">{automation.error_message}</p>
        </div>
      )}

      {/* Info Row */}
      <div
        className={clsx(
          "flex items-center gap-3 text-[11px] mb-2.5",
          theme === "dark" ? "text-dark-muted" : "text-gray-500"
        )}
      >
        <div className="flex items-center gap-1.5">
          <ModeIcon size={12} />
          <span>{mode.label}</span>
        </div>
        <div
          className={clsx(
            "h-3 w-px",
            theme === "dark" ? "bg-white/10" : "bg-gray-200"
          )}
        />
        <div className="flex items-center gap-1.5">
          <KiteIcon size={12} className="flex-shrink-0" />
          <span>{broker?.name || "No Broker"}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className={clsx(
          "grid grid-cols-3 gap-3 py-2.5 border-t",
          theme === "dark" ? "border-white/5" : "border-gray-100"
        )}
      >
        <div>
          <p
            className={clsx(
              "text-[9px] uppercase tracking-wide mb-0.5",
              theme === "dark" ? "text-dark-muted" : "text-gray-400"
            )}
          >
            Today
          </p>
          <p
            className={clsx(
              "text-sm font-semibold font-mono tabular-nums",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {automation.trades_today}
          </p>
        </div>
        <div>
          <p
            className={clsx(
              "text-[9px] uppercase tracking-wide mb-0.5",
              theme === "dark" ? "text-dark-muted" : "text-gray-400"
            )}
          >
            Win Rate
          </p>
          <p
            className={clsx(
              "text-sm font-semibold font-mono tabular-nums",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {automation.stats.win_rate.toFixed(0)}%
          </p>
        </div>
        <div>
          <p
            className={clsx(
              "text-[9px] uppercase tracking-wide mb-0.5",
              theme === "dark" ? "text-dark-muted" : "text-gray-400"
            )}
          >
            P&L
          </p>
          <p
            className={clsx(
              "text-sm font-bold font-mono tabular-nums",
              automation.stats.total_pnl >= 0 ? "number-profit" : "number-loss"
            )}
          >
            {automation.stats.total_pnl >= 0 ? "+" : ""}₹
            {Math.abs(automation.stats.total_pnl).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className={clsx(
          "flex items-center gap-2 pt-2.5 border-t",
          theme === "dark" ? "border-white/5" : "border-gray-100"
        )}
      >
        <button
          onClick={handleToggleStatus}
          disabled={isError}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold transition-all",
            isRunning
              ? theme === "dark"
                ? "bg-white/5 text-white hover:bg-white/10"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : isError
              ? theme === "dark"
                ? "bg-white/5 text-dark-muted cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-profit/10 text-profit hover:bg-profit/20"
          )}
        >
          {isRunning ? (
            <>
              <Pause size={13} />
              Pause
            </>
          ) : (
            <>
              <Play size={13} />
              Start
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          className={clsx(
            "flex h-8 w-8 items-center justify-center transition-all hover:bg-loss/10 hover:text-loss",
            theme === "dark"
              ? "bg-white/5 text-dark-muted"
              : "bg-gray-100 text-gray-400"
          )}
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(automation);
          }}
          className={clsx(
            "flex h-8 w-8 items-center justify-center transition-all",
            theme === "dark"
              ? "bg-white/5 text-dark-muted hover:bg-white/10 hover:text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
