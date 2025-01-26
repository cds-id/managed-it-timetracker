import { useEffect } from 'react';
import { TrayIcon } from '@tauri-apps/api/tray';
import { Window } from '@tauri-apps/api/window';
import { Menu, MenuItemOptions } from '@tauri-apps/api/menu';
import Logo from "../assets/logo.png"

export function TrayManager() {
  useEffect(() => {
    const setupTray = async () => {
      try {
        const mainWindow = Window.getCurrent();

        const menu = await Menu.new();
        await menu.append([
          {
            id: 'show',
            text: 'Show Window',
            enabled: true,
            click: async () => {
              await mainWindow.show();
              await mainWindow.setFocus();
            }
          } as MenuItemOptions,
          {
            id: 'separator',
            text: '',
            enabled: true
          } as MenuItemOptions,
          {
            id: 'quit',
            text: 'Quit',
            enabled: true,
            click: () => {
              mainWindow.close();
            }
          } as MenuItemOptions
        ]);

        await TrayIcon.new({
          icon: Logo,
          tooltip: 'Managed IT Timetracker',
          title: 'Managed IT',
          showMenuOnLeftClick: true,
          menu,
          action: async () => {
            const isVisible = await mainWindow.isVisible();
            if (!isVisible) {
              await mainWindow.show();
              await mainWindow.setFocus();
            }
          }
        });

        return () => {
          // Cleanup handled by Tauri
        };
      } catch (error) {
        console.error('Failed to setup tray:', error);
      }
    };

    setupTray();
  }, []);

  return null;
}
