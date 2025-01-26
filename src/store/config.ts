import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Config } from '../types';
import { apiService } from '../services/api';

interface ConfigStore {
  config: Config | null;
  setConfig: (config: Config) => void;
  clearConfig: () => void;
  logout: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (config) => {
        set({ config });
        apiService.setConfig(config);
      },
      clearConfig: () => {
        set({ config: null });
        apiService.setConfig(null);
      },
      logout: () => {
        set({ config: null });
        apiService.setConfig(null);
        window.location.href = '/';
      },
    }),
    {
      name: 'managed-it-config',
      onRehydrateStorage: () => (state) => {
        if (state?.config) {
          apiService.setConfig(state.config);
        }
      },
    }
  )
);

// Listen for unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useConfigStore.getState().logout();
  });
}
