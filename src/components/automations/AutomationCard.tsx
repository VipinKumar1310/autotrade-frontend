"use client";

import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Trash2,
  AlertCircle,
  ChevronRight,
  Zap,
  MousePointer,
  Bot,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type {
  Automation,
  TelegramProvider,
  Broker,
  ExecutionMode,
  AutomationStatus,
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
}

const executionModeConfig: Record<
  ExecutionMode,
  { label: string; icon: typeof Bot }
> = {
  auto: { label: "Auto", icon: Bot },
  "one-click": { label: "One-Click", icon: MousePointer },
  manual: { label: "Manual", icon: Zap },
};

const statusConfig: Record<
  AutomationStatus,
  { label: string; className: string }
> = {
  running: {
    label: "Running",
    className: "bg-profit/20 text-profit status-running",
  },
  paused: { label: "Paused", className: "bg-dark-muted/20 text-dark-muted" },
  error: { label: "Error", className: "bg-loss/20 text-loss status-error" },
};

export function AutomationCard({
  automation,
  provider,
  broker,
}: AutomationCardProps) {
  const router = useRouter();
  const { updateAutomationStatus, deleteAutomation } = useStore();

  const mode = executionModeConfig[automation.execution_mode];
  const status = statusConfig[automation.status];
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

  return (
    <div
      onClick={() => router.push(`/automations/${automation.id}`)}
      className="bg-dark-bg border border-dark-border p-3 card-interactive cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {automation.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TelegramIcon
              size={14}
              className="flex-shrink-0"
              id={`tg-${automation.id}`}
            />
            <p className="text-sm text-dark-muted truncate">
              {provider?.name || "Unknown Provider"}
            </p>
          </div>
        </div>
        <span
          className={clsx("px-2 py-0.5 text-xs font-medium", status.className)}
        >
          {status.label}
        </span>
      </div>

      {/* Error message */}
      {automation.error_message && (
        <div className="flex items-start gap-2 mb-2 p-2 bg-loss/10 border border-loss/20">
          <AlertCircle size={14} className="text-loss flex-shrink-0 mt-0.5" />
          <p className="text-xs text-loss">{automation.error_message}</p>
        </div>
      )}

      {/* Info Row */}
      <div className="flex items-center gap-3 text-sm text-dark-muted mb-2">
        <div className="flex items-center gap-1.5">
          <ModeIcon size={13} />
          <span>{mode.label}</span>
        </div>
        <div className="h-3 w-px bg-dark-border" />
        <div className="flex items-center gap-1.5">
          <KiteIcon size={13} className="flex-shrink-0" />
          <span>{broker?.name || "No Broker"}</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-t border-dark-border">
        <div>
          <p className="text-xs text-dark-muted">Today</p>
          <p className="text-sm font-medium text-white tabular-nums">
            {automation.trades_today} trades
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-muted">Win Rate</p>
          <p className="text-sm font-medium text-white tabular-nums">
            {automation.stats.win_rate.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-muted">Total P&L</p>
          <p
            className={clsx(
              "text-sm font-medium tabular-nums",
              automation.stats.total_pnl >= 0 ? "text-profit" : "text-loss"
            )}
          >
            {automation.stats.total_pnl >= 0 ? "+" : ""}₹
            {automation.stats.total_pnl.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-dark-border">
        <button
          onClick={handleToggleStatus}
          disabled={automation.status === "error"}
          className={clsx(
            "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium transition-colors",
            automation.status === "running"
              ? "bg-dark-border text-white hover:bg-dark-muted/30"
              : automation.status === "error"
              ? "bg-dark-border text-dark-muted cursor-not-allowed"
              : "bg-profit/20 text-profit hover:bg-profit/30"
          )}
        >
          {automation.status === "running" ? (
            <>
              <Pause size={14} />
              Pause
            </>
          ) : (
            <>
              <Play size={14} />
              Start
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          className="flex h-8 w-8 items-center justify-center bg-dark-border text-dark-muted hover:bg-loss/20 hover:text-loss transition-colors"
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/automations/${automation.id}`);
          }}
          className="flex h-8 w-8 items-center justify-center bg-dark-border text-dark-muted hover:bg-dark-muted/30 hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
