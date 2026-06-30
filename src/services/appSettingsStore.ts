/**
 * Application experience preferences — theme, motion, favorites, recents.
 */

import { setShellTheme } from 'plantasonic-design-system/shell';

const STORAGE_KEY = 'plantasonic.app.settings';
const MAX_RECENT = 5;

export interface AppSettings {
  theme: 'dark' | 'light';
  motionEnabled: boolean;
  reducedMotion: boolean;
  favoritePresets: string[];
  recentPresets: string[];
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'dark',
  motionEnabled: true,
  reducedMotion: false,
  favoritePresets: [],
  recentPresets: [],
};

function readStoredSettings(): Partial<AppSettings> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppSettings>;
  } catch {
    return null;
  }
}

/** Applies persisted theme before first paint to avoid flash. */
export function bootstrapDocumentTheme(): void {
  const parsed = readStoredSettings();
  if (parsed?.theme === 'light' || parsed?.theme === 'dark') {
    document.documentElement.dataset.theme = parsed.theme;
  }
}

export function getStoredTheme(): 'dark' | 'light' | null {
  const parsed = readStoredSettings();
  if (parsed?.theme === 'light' || parsed?.theme === 'dark') return parsed.theme;
  return null;
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  const current = readStoredSettings() ?? {};
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_APP_SETTINGS, ...current, theme }),
    );
  } catch {
    /* storage unavailable */
  }
  document.documentElement.dataset.theme = theme;
  setShellTheme(theme);
}

type AppSettingsListener = (settings: Readonly<AppSettings>) => void;

/** Persists app-level UX preferences. */
export class AppSettingsStore {
  private settings: AppSettings;
  private readonly listeners = new Set<AppSettingsListener>();

  constructor() {
    this.settings = this.load();
    this.applyDocumentAttributes();
  }

  getSettings(): Readonly<AppSettings> {
    return this.settings;
  }

  update(patch: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...patch };
    this.save();
    this.applyDocumentAttributes();
    this.notify();
  }

  toggleFavorite(presetId: string): void {
    const favorites = new Set(this.settings.favoritePresets);
    if (favorites.has(presetId)) {
      favorites.delete(presetId);
    } else {
      favorites.add(presetId);
    }
    this.update({ favoritePresets: [...favorites] });
  }

  isFavorite(presetId: string): boolean {
    return this.settings.favoritePresets.includes(presetId);
  }

  recordRecentPreset(presetId: string): void {
    const filtered = this.settings.recentPresets.filter((id) => id !== presetId);
    const recent = [presetId, ...filtered].slice(0, MAX_RECENT);
    this.update({ recentPresets: recent });
  }

  subscribe(listener: AppSettingsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  shouldAnimate(): boolean {
    if (this.settings.reducedMotion) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return this.settings.motionEnabled;
  }

  private applyDocumentAttributes(): void {
    document.documentElement.dataset.theme = this.settings.theme;
    document.documentElement.toggleAttribute('data-ps-reduced-motion', this.settings.reducedMotion);
    document.documentElement.toggleAttribute('data-ps-motion-off', !this.settings.motionEnabled);
    setShellTheme(this.settings.theme);
  }

  private notify(): void {
    const snapshot = this.getSettings();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_APP_SETTINGS };
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      return {
        ...DEFAULT_APP_SETTINGS,
        ...parsed,
        theme: parsed.theme === 'light' ? 'light' : 'dark',
        favoritePresets: parsed.favoritePresets ?? [],
        recentPresets: parsed.recentPresets ?? [],
      };
    } catch {
      return { ...DEFAULT_APP_SETTINGS };
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      /* storage unavailable */
    }
  }
}
