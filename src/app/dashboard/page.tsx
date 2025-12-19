"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Check,
  XCircle,
  Clock,
  ChevronDown,
  BarChart3,
  Target,
  Zap,
  Calendar,
  Filter,
  ChevronRight,
  MessageCircle,
  AlertCircle,
  Ban,
  Hourglass,
  ExternalLink,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { AppLayout } from "@/components/layout/AppLayout";
import clsx from "clsx";
import type { ExecutionStatus, Trade, ParsedSignal } from "@/types";

// Time period filter type
type TimePeriod = "today" | "week" | "month" | "all" | "custom";

// Custom Telegram Icon
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

// Kite Icon Component
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

// Format date and time
const formatDateTime = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${day} ${month}, ${hour12}:${mins} ${ampm}`;
};

// Get date range based on time period
const getDateRange = (
  period: TimePeriod,
  customRange?: { start: string; end: string }
): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      break;
    case "custom":
      if (customRange) {
        start = new Date(customRange.start);
        start.setHours(0, 0, 0, 0);
        const customEnd = new Date(customRange.end);
        customEnd.setHours(23, 59, 59, 999);
        return { start, end: customEnd };
      }
      break;
    case "all":
    default:
      start = new Date(0); // Beginning of time
  }

  return { start, end };
};

export default function DashboardPage() {
  const router = useRouter();
  const { parsedSignals, trades, automations, telegramProviders, theme } =
    useStore();

  // Filter states
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [selectedAutomations, setSelectedAutomations] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showAutomationFilter, setShowAutomationFilter] = useState(false);
  const [showChannelFilter, setShowChannelFilter] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<"trades" | "signals">("trades");
  const [tradesTab, setTradesTab] = useState<"all" | "open" | "closed">("all");
  const [signalsTab, setSignalsTab] = useState<
    "all" | "executed" | "skipped" | "pending"
  >("all");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const toggleExpand = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Computed filtered data
  const filteredData = useMemo(() => {
    const dateRange = getDateRange(timePeriod, customDateRange);

    // Filter trades by date and automations/channels
    let filteredTrades = trades.filter((trade) => {
      const tradeDate = new Date(trade.entry_time);
      const inDateRange =
        tradeDate >= dateRange.start && tradeDate <= dateRange.end;

      const matchesAutomation =
        selectedAutomations.length === 0 ||
        selectedAutomations.includes(trade.automation_id);

      // Get automation to find channel
      const automation = automations.find((a) => a.id === trade.automation_id);
      const matchesChannel =
        selectedChannels.length === 0 ||
        (automation &&
          automation.telegram_provider_id &&
          selectedChannels.includes(automation.telegram_provider_id));

      return inDateRange && matchesAutomation && matchesChannel;
    });

    // Filter signals similarly
    let filteredSignals = parsedSignals.filter((signal) => {
      const signalDate = new Date(signal.parsed_at);
      const inDateRange =
        signalDate >= dateRange.start && signalDate <= dateRange.end;

      const matchesAutomation =
        selectedAutomations.length === 0 ||
        selectedAutomations.includes(signal.automation_id);

      const automation = automations.find((a) => a.id === signal.automation_id);
      const matchesChannel =
        selectedChannels.length === 0 ||
        (automation &&
          automation.telegram_provider_id &&
          selectedChannels.includes(automation.telegram_provider_id));

      return inDateRange && matchesAutomation && matchesChannel;
    });

    return { trades: filteredTrades, signals: filteredSignals };
  }, [
    trades,
    parsedSignals,
    automations,
    timePeriod,
    customDateRange,
    selectedAutomations,
    selectedChannels,
  ]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const closedTrades = filteredData.trades.filter(
      (t) => t.status === "closed"
    );
    const openTrades = filteredData.trades.filter((t) => t.status === "open");

    const totalPnL = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningTrades = closedTrades.filter((t) => t.pnl > 0);
    const losingTrades = closedTrades.filter((t) => t.pnl < 0);
    const winRate =
      closedTrades.length > 0
        ? (winningTrades.length / closedTrades.length) * 100
        : 0;

    const totalSignals = filteredData.signals.length;
    const executedSignals = filteredData.signals.filter(
      (s) => s.execution_status === "executed"
    ).length;
    const skippedSignals = filteredData.signals.filter(
      (s) => s.execution_status === "skipped"
    ).length;

    return {
      totalPnL,
      winRate,
      totalTrades: closedTrades.length,
      openTrades: openTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      totalSignals,
      executedSignals,
      skippedSignals,
    };
  }, [filteredData]);

  // Get trades for list
  const displayTrades = useMemo(() => {
    let tradesForDisplay = [...filteredData.trades];

    if (tradesTab === "open") {
      tradesForDisplay = tradesForDisplay.filter((t) => t.status === "open");
    } else if (tradesTab === "closed") {
      tradesForDisplay = tradesForDisplay.filter((t) => t.status === "closed");
    }

    return tradesForDisplay.sort(
      (a, b) =>
        new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    );
  }, [filteredData.trades, tradesTab]);

  const getAutomationById = (id: string) =>
    automations.find((a) => a.id === id);
  const getSignalById = (id: string | null) =>
    id ? parsedSignals.find((s) => s.id === id) : null;
  const getProviderById = (id: string) =>
    telegramProviders.find((p) => p.id === id);

  // Filter signals based on selected tab
  const displaySignals = useMemo(() => {
    const dateRange = getDateRange(timePeriod, customDateRange);

    let filtered = parsedSignals.filter((signal) => {
      const signalDate = new Date(signal.parsed_at);
      if (signalDate < dateRange.start || signalDate > dateRange.end)
        return false;

      if (
        selectedAutomations.length > 0 &&
        !selectedAutomations.includes(signal.automation_id)
      ) {
        return false;
      }

      if (
        selectedChannels.length > 0 &&
        !selectedChannels.includes(signal.provider_id)
      ) {
        return false;
      }

      return true;
    });

    if (signalsTab === "executed") {
      filtered = filtered.filter((s) => s.execution_status === "executed");
    } else if (signalsTab === "skipped") {
      filtered = filtered.filter((s) => s.execution_status === "skipped");
    } else if (signalsTab === "pending") {
      filtered = filtered.filter(
        (s) =>
          s.execution_status === "pending" ||
          s.execution_status === "pending_manual"
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.parsed_at).getTime() - new Date(a.parsed_at).getTime()
    );
  }, [
    parsedSignals,
    timePeriod,
    customDateRange,
    selectedAutomations,
    selectedChannels,
    signalsTab,
  ]);

  // Get signal status display config
  const getSignalStatusConfig = (status: string) => {
    switch (status) {
      case "executed":
        return {
          label: "Executed",
          icon: Check,
          className: "text-profit bg-profit/10",
        };
      case "skipped":
        return {
          label: "Skipped",
          icon: Ban,
          className: "text-loss bg-loss/10",
        };
      case "pending_manual":
        return {
          label: "Manual",
          icon: Hourglass,
          className: "text-warning bg-warning/10",
        };
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          className:
            theme === "dark"
              ? "text-dark-muted bg-dark-border"
              : "text-gray-500 bg-gray-100",
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          className:
            theme === "dark"
              ? "text-dark-muted bg-dark-border"
              : "text-gray-500 bg-gray-100",
        };
    }
  };

  return (
    <AppLayout>
      {/* Summary Cards */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Total P&L Card */}
          <div
            className={clsx(
              "p-3.5 relative overflow-hidden",
              theme === "dark"
                ? "premium-card"
                : "bg-white border border-gray-100 shadow-sm",
              analytics.totalPnL >= 0 ? "card-open-position" : "card-loss"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={clsx(
                  "w-7 h-7 flex items-center justify-center",
                  analytics.totalPnL >= 0 ? "bg-profit/10" : "bg-loss/10"
                )}
              >
                {analytics.totalPnL >= 0 ? (
                  <TrendingUp size={16} className="text-profit" />
                ) : (
                  <TrendingDown size={16} className="text-loss" />
                )}
              </div>
              <span
                className={clsx(
                  "text-[10px] uppercase tracking-wide font-medium",
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                )}
              >
                Total P&L
              </span>
            </div>
            <p
              className={clsx(
                "text-2xl font-bold font-mono tabular-nums tracking-tighter animate-number-pop",
                analytics.totalPnL >= 0 ? "number-profit" : "number-loss"
              )}
            >
              {analytics.totalPnL >= 0 ? "+" : "-"}₹
              {Math.abs(analytics.totalPnL).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Win Rate Card */}
          <div
            className={clsx(
              "p-3.5",
              theme === "dark"
                ? "premium-card"
                : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={clsx(
                  "w-7 h-7 flex items-center justify-center",
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                )}
              >
                <Target
                  size={16}
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                />
              </div>
              <span
                className={clsx(
                  "text-[10px] uppercase tracking-wide font-medium",
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                )}
              >
                Win Rate
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <p
                className={clsx(
                  "text-2xl font-bold font-mono tabular-nums tracking-tighter",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                {analytics.winRate.toFixed(0)}%
              </p>
              <p
                className={clsx(
                  "text-[10px] font-mono",
                  theme === "dark" ? "text-dark-muted" : "text-gray-500"
                )}
              >
                <span className="text-profit">{analytics.winningTrades}W</span>{" "}
                / <span className="text-loss">{analytics.losingTrades}L</span>
              </p>
            </div>
          </div>

          {/* Total Trades Card */}
          <div
            className={clsx(
              "p-3.5",
              theme === "dark"
                ? "premium-card"
                : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={clsx(
                  "w-7 h-7 flex items-center justify-center",
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                )}
              >
                <Zap
                  size={16}
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                />
              </div>
              <span
                className={clsx(
                  "text-[10px] uppercase tracking-wide font-medium",
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                )}
              >
                Trades
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <p
                className={clsx(
                  "text-2xl font-bold font-mono tabular-nums tracking-tighter",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                {analytics.totalTrades}
              </p>
              {analytics.openTrades > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="status-dot status-dot-live" />
                  <p className="text-[10px] text-profit font-medium font-mono">
                    {analytics.openTrades} open
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Signals Card */}
          <div
            className={clsx(
              "p-3.5",
              theme === "dark"
                ? "premium-card"
                : "bg-white border border-gray-100 shadow-sm"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={clsx(
                  "w-7 h-7 flex items-center justify-center",
                  theme === "dark" ? "bg-white/5" : "bg-gray-100"
                )}
              >
                <BarChart3
                  size={16}
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                />
              </div>
              <span
                className={clsx(
                  "text-[10px] uppercase tracking-wide font-medium",
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                )}
              >
                Signals
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <p
                className={clsx(
                  "text-2xl font-bold font-mono tabular-nums tracking-tighter",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}
              >
                {analytics.totalSignals}
              </p>
              <p
                className={clsx(
                  "text-[10px] font-mono",
                  theme === "dark" ? "text-dark-muted" : "text-gray-500"
                )}
              >
                <span className="text-profit">{analytics.executedSignals}</span>{" "}
                exec /{" "}
                <span className="text-loss">{analytics.skippedSignals}</span>{" "}
                skip
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pb-3">
        {/* Time Period Filter */}
        <div className="flex items-center gap-1.5 mb-3">
          {(["today", "week", "month", "all"] as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => {
                setTimePeriod(period);
                setShowDatePicker(false);
              }}
              className={clsx(
                "px-3 py-1 text-[11px] font-medium transition-colors rounded-full border",
                timePeriod === period
                  ? theme === "dark"
                    ? "bg-white text-gray-900 border-white"
                    : "bg-gray-900 text-white border-gray-900"
                  : theme === "dark"
                  ? "bg-dark-card text-dark-muted border-dark-border hover:text-white hover:border-dark-muted"
                  : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:border-gray-400"
              )}
            >
              {period === "today"
                ? "Today"
                : period === "week"
                ? "Week"
                : period === "month"
                ? "Month"
                : "All"}
            </button>
          ))}
          {/* Custom Date Range Button - Icon only */}
          <button
            onClick={() => {
              setTimePeriod("custom");
              setShowDatePicker(!showDatePicker);
            }}
            className={clsx(
              "w-7 h-7 flex items-center justify-center transition-colors rounded-full border",
              timePeriod === "custom"
                ? theme === "dark"
                  ? "bg-white text-gray-900 border-white"
                  : "bg-gray-900 text-white border-gray-900"
                : theme === "dark"
                ? "bg-dark-card text-dark-muted border-dark-border hover:text-white hover:border-dark-muted"
                : "bg-white text-gray-500 border-gray-200 hover:text-gray-900 hover:border-gray-400"
            )}
          >
            <Calendar size={12} />
          </button>
        </div>

        {/* Custom Date Range Picker */}
        {showDatePicker && (
          <div
            className={clsx(
              "mb-3 p-3 rounded-lg border",
              theme === "dark"
                ? "bg-dark-card border-dark-border"
                : "bg-white border-gray-200 shadow-sm"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <label
                  className={clsx(
                    "text-[10px] uppercase tracking-wide block mb-1",
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  )}
                >
                  From
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className={clsx(
                    "w-full px-2 py-1.5 text-xs rounded-lg focus:outline-none",
                    theme === "dark"
                      ? "bg-dark-border border border-dark-border text-white focus:border-white"
                      : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-400"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  className={clsx(
                    "text-[10px] uppercase tracking-wide block mb-1",
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  )}
                >
                  To
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) =>
                    setCustomDateRange((prev) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                  className={clsx(
                    "w-full px-2 py-1.5 text-xs rounded-lg focus:outline-none",
                    theme === "dark"
                      ? "bg-dark-border border border-dark-border text-white focus:border-white"
                      : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-400"
                  )}
                />
              </div>
              <button
                onClick={() => setShowDatePicker(false)}
                className={clsx(
                  "mt-4 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                  theme === "dark"
                    ? "bg-white text-gray-900 hover:bg-white/90"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Automation & Channel Filters */}
        <div className="flex gap-1.5">
          {/* Automation Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowAutomationFilter(!showAutomationFilter);
                setShowChannelFilter(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between px-2.5 py-1.5 border rounded-full text-[11px]",
                theme === "dark"
                  ? "bg-dark-card border-dark-border text-white"
                  : "bg-white border-gray-200 text-gray-900"
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Zap
                  size={10}
                  className={
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  }
                />
                <span className="truncate">
                  {selectedAutomations.length === 0
                    ? "All Autos"
                    : `${selectedAutomations.length} Auto`}
                </span>
              </span>
              <ChevronDown
                size={10}
                className={clsx(
                  "transition-transform flex-shrink-0 ml-1",
                  theme === "dark" ? "text-dark-muted" : "text-gray-500",
                  showAutomationFilter && "rotate-180"
                )}
              />
            </button>
            {showAutomationFilter && (
              <div
                className={clsx(
                  "absolute top-full left-0 right-0 mt-1 rounded-lg z-50 max-h-48 overflow-y-auto border shadow-lg",
                  theme === "dark"
                    ? "bg-dark-card border-dark-border"
                    : "bg-white border-gray-200"
                )}
              >
                <button
                  onClick={() => setSelectedAutomations([])}
                  className={clsx(
                    "w-full px-3 py-2 text-left text-xs",
                    theme === "dark"
                      ? "hover:bg-dark-border"
                      : "hover:bg-gray-50",
                    selectedAutomations.length === 0
                      ? theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                      : theme === "dark"
                      ? "text-dark-muted"
                      : "text-gray-500"
                  )}
                >
                  All Automations
                </button>
                {automations.map((auto) => (
                  <button
                    key={auto.id}
                    onClick={() => {
                      setSelectedAutomations((prev) =>
                        prev.includes(auto.id)
                          ? prev.filter((id) => id !== auto.id)
                          : [...prev, auto.id]
                      );
                    }}
                    className={clsx(
                      "w-full px-3 py-2 text-left text-xs flex items-center justify-between",
                      theme === "dark"
                        ? "hover:bg-dark-border"
                        : "hover:bg-gray-50",
                      selectedAutomations.includes(auto.id)
                        ? theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                        : theme === "dark"
                        ? "text-dark-muted"
                        : "text-gray-500"
                    )}
                  >
                    <span className="truncate">{auto.name}</span>
                    {selectedAutomations.includes(auto.id) && (
                      <Check size={12} className="text-profit flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Channel Filter */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowChannelFilter(!showChannelFilter);
                setShowAutomationFilter(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between px-2.5 py-1.5 border rounded-full text-[11px]",
                theme === "dark"
                  ? "bg-dark-card border-dark-border text-white"
                  : "bg-white border-gray-200 text-gray-900"
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <TelegramIcon
                  size={10}
                  id="filter-tg"
                  className="flex-shrink-0"
                />
                <span className="truncate">
                  {selectedChannels.length === 0
                    ? "Channels"
                    : `${selectedChannels.length} Ch`}
                </span>
              </span>
              <ChevronDown
                size={10}
                className={clsx(
                  "transition-transform flex-shrink-0 ml-1",
                  theme === "dark" ? "text-dark-muted" : "text-gray-500",
                  showChannelFilter && "rotate-180"
                )}
              />
            </button>
            {showChannelFilter && (
              <div
                className={clsx(
                  "absolute top-full left-0 right-0 mt-1 rounded-lg z-50 max-h-48 overflow-y-auto border shadow-lg",
                  theme === "dark"
                    ? "bg-dark-card border-dark-border"
                    : "bg-white border-gray-200"
                )}
              >
                <button
                  onClick={() => setSelectedChannels([])}
                  className={clsx(
                    "w-full px-3 py-2 text-left text-xs",
                    theme === "dark"
                      ? "hover:bg-dark-border"
                      : "hover:bg-gray-50",
                    selectedChannels.length === 0
                      ? theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                      : theme === "dark"
                      ? "text-dark-muted"
                      : "text-gray-500"
                  )}
                >
                  All Channels
                </button>
                {telegramProviders.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannels((prev) =>
                        prev.includes(channel.id)
                          ? prev.filter((id) => id !== channel.id)
                          : [...prev, channel.id]
                      );
                    }}
                    className={clsx(
                      "w-full px-3 py-2 text-left text-xs flex items-center justify-between",
                      theme === "dark"
                        ? "hover:bg-dark-border"
                        : "hover:bg-gray-50",
                      selectedChannels.includes(channel.id)
                        ? theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                        : theme === "dark"
                        ? "text-dark-muted"
                        : "text-gray-500"
                    )}
                  >
                    <span className="truncate">{channel.name}</span>
                    {selectedChannels.includes(channel.id) && (
                      <Check size={12} className="text-profit flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trades/Signals Section */}
      <div
        className={clsx(
          "border-t",
          theme === "dark" ? "border-dark-border" : "border-gray-200"
        )}
      >
        {/* Main Tab Header - Trades vs Signals */}
        <div
          className={clsx(
            "sticky top-0 z-30 border-b",
            theme === "dark"
              ? "bg-dark-bg border-dark-border"
              : "bg-gray-50 border-gray-200"
          )}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex gap-1">
              <button
                onClick={() => setMainTab("trades")}
                className={clsx(
                  "px-3 py-1 text-xs font-medium transition-colors rounded-full",
                  mainTab === "trades"
                    ? theme === "dark"
                      ? "bg-white text-gray-900"
                      : "bg-gray-900 text-white"
                    : theme === "dark"
                    ? "text-dark-muted hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Trades
              </button>
              <button
                onClick={() => setMainTab("signals")}
                className={clsx(
                  "px-3 py-1 text-xs font-medium transition-colors rounded-full",
                  mainTab === "signals"
                    ? theme === "dark"
                      ? "bg-white text-gray-900"
                      : "bg-gray-900 text-white"
                    : theme === "dark"
                    ? "text-dark-muted hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Signals
              </button>
            </div>
            <span
              className={clsx(
                "text-xs",
                theme === "dark" ? "text-dark-muted" : "text-gray-500"
              )}
            >
              {mainTab === "trades"
                ? `${displayTrades.length} trades`
                : `${displaySignals.length} signals`}
            </span>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 px-4 pb-2">
            {mainTab === "trades" ? (
              <>
                {(["all", "open", "closed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTradesTab(tab)}
                    className={clsx(
                      "px-2 py-0.5 text-[10px] font-medium transition-colors border",
                      tradesTab === tab
                        ? theme === "dark"
                          ? "border-white text-white"
                          : "border-gray-900 text-gray-900"
                        : theme === "dark"
                        ? "border-dark-border text-dark-muted hover:text-white"
                        : "border-gray-200 text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {tab === "all" ? "All" : tab === "open" ? "Open" : "Closed"}
                  </button>
                ))}
              </>
            ) : (
              <>
                {(["all", "executed", "skipped", "pending"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setSignalsTab(tab)}
                      className={clsx(
                        "px-2 py-0.5 text-[10px] font-medium transition-colors border",
                        signalsTab === tab
                          ? theme === "dark"
                            ? "border-white text-white"
                            : "border-gray-900 text-gray-900"
                          : theme === "dark"
                          ? "border-dark-border text-dark-muted hover:text-white"
                          : "border-gray-200 text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {tab === "all"
                        ? "All"
                        : tab === "executed"
                        ? "Executed"
                        : tab === "skipped"
                        ? "Skipped"
                        : "Pending"}
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {/* Trades/Signals List */}
        <div className="px-4 py-3 space-y-2">
          {mainTab === "trades" ? (
            // Trades List
            displayTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3
                  size={28}
                  className={
                    theme === "dark" ? "text-dark-muted" : "text-gray-400"
                  }
                />
                <p
                  className={clsx(
                    "text-sm",
                    theme === "dark" ? "text-dark-muted" : "text-gray-500"
                  )}
                >
                  No trades found
                </p>
                <p
                  className={clsx(
                    "text-xs mt-1",
                    theme === "dark" ? "text-dark-muted" : "text-gray-400"
                  )}
                >
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              displayTrades.map((trade) => {
                const automation = getAutomationById(trade.automation_id);
                const isBuy = trade.direction === "BUY";
                const isOpen = trade.status === "open";
                const isExpanded = expandedCard === `trade-${trade.id}`;

                const currentPnl =
                  isOpen && trade.current_price
                    ? (trade.current_price - trade.entry_price) *
                      trade.quantity *
                      (isBuy ? 1 : -1)
                    : trade.pnl;
                const currentPnlPercent =
                  isOpen && trade.current_price
                    ? ((trade.current_price - trade.entry_price) /
                        trade.entry_price) *
                      100 *
                      (isBuy ? 1 : -1)
                    : trade.pnl_percent;

                return (
                  <div
                    key={trade.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpand(`trade-${trade.id}`)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && toggleExpand(`trade-${trade.id}`)
                    }
                    className={clsx(
                      "card-interactive transition-all duration-300 ease-out",
                      theme === "dark"
                        ? "premium-card"
                        : "bg-white border border-gray-100 shadow-sm",
                      isOpen && "card-open-position animate-glow-pulse"
                    )}
                  >
                    {/* Main content */}
                    <div className="px-3 py-2.5 relative">
                      {isOpen && (
                        <div className="absolute inset-0 bg-gradient-to-r from-profit/5 via-transparent to-profit/5 animate-shimmer pointer-events-none" />
                      )}
                      {/* Row 1: Instrument + Automation */}
                      <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-2">
                          <div
                            className={clsx(
                              "flex items-center justify-center w-5 h-5",
                              isBuy ? "text-profit" : "text-loss"
                            )}
                          >
                            {isBuy ? (
                              <TrendingUp size={14} className="flex-shrink-0" />
                            ) : (
                              <TrendingDown
                                size={14}
                                className="flex-shrink-0"
                              />
                            )}
                          </div>
                          <span
                            className={clsx(
                              "text-sm font-semibold tracking-tight",
                              theme === "dark" ? "text-white" : "text-gray-900"
                            )}
                          >
                            {trade.instrument}
                          </span>
                          <span
                            className={clsx(
                              "text-[10px]",
                              theme === "dark"
                                ? "text-dark-muted"
                                : "text-gray-300"
                            )}
                          >
                            •
                          </span>
                          <div className="flex items-center gap-1">
                            <TelegramIcon
                              size={12}
                              id={`trade-${trade.id}`}
                              className="flex-shrink-0"
                            />
                            <KiteIcon size={12} className="flex-shrink-0" />
                          </div>
                          <span
                            className={clsx(
                              "text-[11px]",
                              theme === "dark"
                                ? "text-dark-muted"
                                : "text-gray-500"
                            )}
                          >
                            {automation?.name}
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={clsx(
                            "transition-transform duration-300 flex-shrink-0",
                            theme === "dark"
                              ? "text-dark-muted"
                              : "text-gray-400",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                      {/* Row 2: Prices & P&L */}
                      <div className="flex items-center justify-between mt-1.5 relative">
                        <span
                          className={clsx(
                            "text-[11px] font-mono tabular-nums",
                            theme === "dark"
                              ? "text-dark-muted"
                              : "text-gray-500"
                          )}
                        >
                          {isOpen
                            ? `₹${trade.entry_price} → ₹${trade.current_price} | SL:₹${trade.stop_loss}`
                            : `₹${trade.entry_price} → ₹${trade.exit_price} | SL:₹${trade.stop_loss}`}
                        </span>
                        <div className="flex items-center gap-3">
                          <span
                            className={clsx(
                              "text-[10px]",
                              theme === "dark"
                                ? "text-dark-muted"
                                : "text-gray-500"
                            )}
                          >
                            {formatDateTime(new Date(trade.entry_time))}
                          </span>
                          <span
                            className={clsx(
                              "text-sm font-bold font-mono tabular-nums",
                              currentPnl >= 0 ? "number-profit" : "number-loss"
                            )}
                          >
                            {currentPnl >= 0 ? "+" : ""}₹
                            {Math.abs(currentPnl).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <div
                      className={clsx(
                        "grid transition-all duration-300 ease-out",
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={clsx(
                            "px-3 pb-3 pt-3 border-t",
                            isOpen
                              ? "border-profit/20"
                              : theme === "dark"
                              ? "border-white/5"
                              : "border-gray-100"
                          )}
                        >
                          <div className="grid grid-cols-3 gap-3 text-[11px]">
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                Direction
                              </span>
                              <span
                                className={clsx(
                                  "font-semibold",
                                  isBuy ? "text-profit" : "text-loss"
                                )}
                              >
                                {trade.direction}
                              </span>
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                Quantity
                              </span>
                              <span
                                className={clsx(
                                  "font-semibold font-mono",
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                )}
                              >
                                {trade.quantity}
                              </span>
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                Entry
                              </span>
                              <span
                                className={clsx(
                                  "font-semibold font-mono",
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                )}
                              >
                                ₹{trade.entry_price}
                              </span>
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                {isOpen ? "Current" : "Exit"}
                              </span>
                              <span
                                className={clsx(
                                  "font-semibold font-mono",
                                  currentPnl >= 0 ? "text-profit" : "text-loss"
                                )}
                              >
                                ₹
                                {isOpen
                                  ? trade.current_price
                                  : trade.exit_price}
                              </span>
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                Stop Loss
                              </span>
                              <span className="text-loss font-semibold font-mono">
                                ₹{trade.stop_loss}
                              </span>
                            </div>
                            <div>
                              <span
                                className={clsx(
                                  "block text-[10px] uppercase tracking-wide mb-0.5",
                                  theme === "dark"
                                    ? "text-dark-muted"
                                    : "text-gray-400"
                                )}
                              >
                                P&L
                              </span>
                              <span
                                className={clsx(
                                  "font-bold font-mono",
                                  currentPnl >= 0
                                    ? "number-profit"
                                    : "number-loss"
                                )}
                              >
                                {currentPnl >= 0 ? "+" : ""}₹
                                {Math.abs(currentPnl).toLocaleString("en-IN", {
                                  maximumFractionDigits: 0,
                                })}{" "}
                                <span className="text-[10px] font-medium opacity-80">
                                  ({currentPnlPercent >= 0 ? "+" : ""}
                                  {currentPnlPercent.toFixed(1)}%)
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* View in Chat Button */}
                          {trade.signal_id &&
                            (() => {
                              const signal = getSignalById(trade.signal_id);
                              if (!signal) return null;
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/chats/${signal.provider_id}?messageId=${signal.message_id}`
                                    );
                                  }}
                                  className={clsx(
                                    "mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs transition-colors",
                                    theme === "dark"
                                      ? "bg-dark-border text-white hover:bg-dark-muted/30"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  )}
                                >
                                  <MessageCircle size={12} />
                                  View Signal in Chat
                                  <ExternalLink
                                    size={10}
                                    className={
                                      theme === "dark"
                                        ? "text-dark-muted"
                                        : "text-gray-400"
                                    }
                                  />
                                </button>
                              );
                            })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : // Signals List
          displaySignals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle
                size={28}
                className={
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                }
              />
              <p
                className={clsx(
                  "text-sm",
                  theme === "dark" ? "text-dark-muted" : "text-gray-500"
                )}
              >
                No signals found
              </p>
              <p
                className={clsx(
                  "text-xs mt-1",
                  theme === "dark" ? "text-dark-muted" : "text-gray-400"
                )}
              >
                Try adjusting your filters
              </p>
            </div>
          ) : (
            displaySignals.map((signal) => {
              const automation = getAutomationById(signal.automation_id);
              const provider = getProviderById(signal.provider_id);
              const isBuy = signal.direction === "BUY";
              const isExpanded = expandedCard === `signal-${signal.id}`;
              const statusConfig = getSignalStatusConfig(
                signal.execution_status
              );
              const StatusIcon = statusConfig.icon;
              const linkedTrade = filteredData.trades.find(
                (t) => t.signal_id === signal.id
              );

              return (
                <div
                  key={signal.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(`signal-${signal.id}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && toggleExpand(`signal-${signal.id}`)
                  }
                  className={clsx(
                    "cursor-pointer transition-all duration-300 ease-out border",
                    theme === "dark" ? "bg-dark-card" : "bg-white shadow-sm",
                    signal.execution_status === "skipped"
                      ? "border-loss/30"
                      : signal.execution_status === "executed"
                      ? "border-profit/30"
                      : signal.execution_status === "pending_manual"
                      ? "border-warning/30"
                      : theme === "dark"
                      ? "border-dark-border"
                      : "border-gray-200"
                  )}
                >
                  {/* Main content */}
                  <div className="px-3 py-2">
                    {/* Row 1: Instrument + Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isBuy ? (
                          <TrendingUp
                            size={11}
                            className="text-profit flex-shrink-0"
                          />
                        ) : (
                          <TrendingDown
                            size={11}
                            className="text-loss flex-shrink-0"
                          />
                        )}
                        <span
                          className={clsx(
                            "text-[11px] font-medium",
                            theme === "dark" ? "text-white" : "text-gray-900"
                          )}
                        >
                          {signal.instrument}
                        </span>
                        <span
                          className={clsx(
                            "text-[10px]",
                            theme === "dark"
                              ? "text-dark-muted"
                              : "text-gray-400"
                          )}
                        >
                          •
                        </span>
                        <TelegramIcon
                          size={10}
                          id={`signal-${signal.id}`}
                          className="flex-shrink-0"
                        />
                        <span
                          className={clsx(
                            "text-[10px]",
                            theme === "dark"
                              ? "text-dark-muted"
                              : "text-gray-500"
                          )}
                        >
                          {automation?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium",
                            statusConfig.className
                          )}
                        >
                          <StatusIcon size={9} />
                          {statusConfig.label}
                        </span>
                        <ChevronDown
                          size={14}
                          className={clsx(
                            "transition-transform duration-300 flex-shrink-0",
                            theme === "dark"
                              ? "text-dark-muted"
                              : "text-gray-400",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </div>
                    {/* Row 2: Prices & Time */}
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={clsx(
                          "text-[10px] tabular-nums",
                          theme === "dark" ? "text-dark-muted" : "text-gray-500"
                        )}
                      >
                        ₹{signal.entry_price} | SL:₹{signal.stop_loss} | T:₹
                        {signal.targets[0]}
                      </span>
                      <span
                        className={clsx(
                          "text-[10px]",
                          theme === "dark" ? "text-dark-muted" : "text-gray-500"
                        )}
                      >
                        {formatDateTime(new Date(signal.parsed_at))}
                      </span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div
                    className={clsx(
                      "grid transition-all duration-300 ease-out",
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={clsx(
                          "px-3 pb-3 pt-2 border-t",
                          theme === "dark"
                            ? "border-dark-border"
                            : "border-gray-200"
                        )}
                      >
                        <div className="grid grid-cols-3 gap-3 text-[10px]">
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Direction
                            </span>
                            <span
                              className={clsx(
                                "font-medium",
                                isBuy ? "text-profit" : "text-loss"
                              )}
                            >
                              {signal.direction}
                            </span>
                          </div>
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Entry
                            </span>
                            <span
                              className={clsx(
                                "font-medium",
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              )}
                            >
                              ₹{signal.entry_price}
                            </span>
                          </div>
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Confidence
                            </span>
                            <span
                              className={clsx(
                                "font-medium",
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              )}
                            >
                              {signal.confidence}%
                            </span>
                          </div>
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Stop Loss
                            </span>
                            <span className="text-loss font-medium">
                              ₹{signal.stop_loss}
                            </span>
                          </div>
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Target 1
                            </span>
                            <span className="text-profit font-medium">
                              ₹{signal.targets[0]}
                            </span>
                          </div>
                          <div>
                            <span
                              className={clsx(
                                "block",
                                theme === "dark"
                                  ? "text-dark-muted"
                                  : "text-gray-500"
                              )}
                            >
                              Channel
                            </span>
                            <span
                              className={clsx(
                                "font-medium",
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              )}
                            >
                              {provider?.name}
                            </span>
                          </div>
                        </div>

                        {/* Skip Reason */}
                        {signal.execution_status === "skipped" &&
                          signal.skip_reason && (
                            <div className="mt-2 p-2 bg-loss/10 border border-loss/20 text-[10px]">
                              <span className="text-loss font-medium">
                                Skip Reason:{" "}
                              </span>
                              <span className="text-loss/80">
                                {signal.skip_reason}
                              </span>
                            </div>
                          )}

                        {/* Pending Manual Info */}
                        {signal.execution_status === "pending_manual" && (
                          <div className="mt-2 p-2 bg-warning/10 border border-warning/20 text-[10px]">
                            <span className="text-warning font-medium">
                              Awaiting manual confirmation
                            </span>
                          </div>
                        )}

                        {/* Trade Info if Executed */}
                        {linkedTrade && (
                          <div className="mt-2 p-2 bg-profit/10 border border-profit/20 text-[10px]">
                            <span className="text-profit font-medium">
                              Trade P&L:{" "}
                            </span>
                            <span
                              className={clsx(
                                "font-semibold",
                                linkedTrade.pnl >= 0
                                  ? "text-profit"
                                  : "text-loss"
                              )}
                            >
                              {linkedTrade.pnl >= 0 ? "+" : ""}₹
                              {linkedTrade.pnl.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* View in Chat Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/chats/${signal.provider_id}?messageId=${signal.message_id}`
                            );
                          }}
                          className={clsx(
                            "mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs transition-colors",
                            theme === "dark"
                              ? "bg-dark-border text-white hover:bg-dark-muted/30"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          <MessageCircle size={12} />
                          View in Chat
                          <ExternalLink
                            size={10}
                            className={
                              theme === "dark"
                                ? "text-dark-muted"
                                : "text-gray-400"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
