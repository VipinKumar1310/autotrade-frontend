'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    User,
    TelegramProvider,
    TelegramMessage,
    Broker,
    Automation,
    ParsedSignal,
    Trade,
    Notification,
    AutomationStatus
} from '@/types';

// Import mock data
import userData from '@/data/user.json';
import telegramProvidersData from '@/data/telegramProviders.json';
import telegramMessagesData from '@/data/telegramMessages.json';
import brokersData from '@/data/brokers.json';
import automationsData from '@/data/automations.json';
import parsedSignalsData from '@/data/parsedSignals.json';
import tradesData from '@/data/trades.json';
import notificationsData from '@/data/notifications.json';

interface AppState {
    // Auth
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string) => void;
    logout: () => void;

    // Theme
    theme: 'dark' | 'light';
    toggleTheme: () => void;

    // Data
    telegramProviders: TelegramProvider[];
    telegramMessages: TelegramMessage[];
    brokers: Broker[];
    automations: Automation[];
    parsedSignals: ParsedSignal[];
    trades: Trade[];
    notifications: Notification[];

    // Automation actions
    updateAutomationStatus: (id: string, status: AutomationStatus) => void;
    deleteAutomation: (id: string) => void;
    createAutomation: (automation: Omit<Automation, 'id' | 'created_at' | 'stats'>) => void;
    updateAutomation: (id: string, updates: Partial<Omit<Automation, 'id' | 'created_at' | 'stats'>>) => void;

    // Notification actions
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;

    // Helpers
    getProviderById: (id: string) => TelegramProvider | undefined;
    getBrokerById: (id: string) => Broker | undefined;
    getMessagesByProvider: (providerId: string) => TelegramMessage[];
    getSignalByMessageId: (messageId: string) => ParsedSignal | undefined;
    getTradeBySignalId: (signalId: string) => Trade | undefined;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Auth state
            isAuthenticated: false,
            user: null,

            login: (email: string) => {
                const user = { ...userData, email } as User;
                set({ isAuthenticated: true, user });
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
            },

            // Theme state
            theme: 'dark',

            toggleTheme: () => {
                set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
            },

            // Data - initialized with mock data
            telegramProviders: telegramProvidersData as TelegramProvider[],
            telegramMessages: telegramMessagesData as TelegramMessage[],
            brokers: brokersData as Broker[],
            automations: automationsData as Automation[],
            parsedSignals: parsedSignalsData as ParsedSignal[],
            trades: tradesData as Trade[],
            notifications: notificationsData as Notification[],

            // Automation actions
            updateAutomationStatus: (id: string, status: AutomationStatus) => {
                set((state) => ({
                    automations: state.automations.map((auto) =>
                        auto.id === id ? { ...auto, status, error_message: undefined } : auto
                    ),
                }));
            },

            deleteAutomation: (id: string) => {
                set((state) => ({
                    automations: state.automations.filter((auto) => auto.id !== id),
                }));
            },

            createAutomation: (automation) => {
                const newAutomation: Automation = {
                    ...automation,
                    id: `auto_${Date.now()}`,
                    created_at: new Date().toISOString(),
                    stats: {
                        win_rate: 0,
                        total_pnl: 0,
                        avg_profit: 0,
                        avg_loss: 0,
                    },
                };
                set((state) => ({
                    automations: [...state.automations, newAutomation],
                }));
            },

            updateAutomation: (id, updates) => {
                set((state) => ({
                    automations: state.automations.map((auto) =>
                        auto.id === id
                            ? {
                                  ...auto,
                                  ...updates,
                                  rules: updates.rules ? { ...auto.rules, ...updates.rules } : auto.rules,
                                  options: updates.options ? { ...auto.options, ...updates.options } : auto.options,
                              }
                            : auto
                    ),
                }));
            },

            // Notification actions
            markNotificationRead: (id: string) => {
                set((state) => ({
                    notifications: state.notifications.map((notif) =>
                        notif.id === id ? { ...notif, read: true } : notif
                    ),
                }));
            },

            markAllNotificationsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
                }));
            },

            // Helpers
            getProviderById: (id: string) => {
                return get().telegramProviders.find((p) => p.id === id);
            },

            getBrokerById: (id: string) => {
                return get().brokers.find((b) => b.id === id);
            },

            getMessagesByProvider: (providerId: string) => {
                return get().telegramMessages
                    .filter((m) => m.provider_id === providerId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            },

            getSignalByMessageId: (messageId: string) => {
                return get().parsedSignals.find((s) => s.message_id === messageId);
            },

            getTradeBySignalId: (signalId: string) => {
                return get().trades.find((t) => t.signal_id === signalId);
            },
        }),
        {
            name: 'autotrade-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                theme: state.theme,
                automations: state.automations,
                notifications: state.notifications,
            }),
        }
    )
);

