import { Window } from '@tauri-apps/api/window';

export async function initializeWindow() {
  const mainWindow = Window.getCurrent();

  // Set window always on top during initialization
  await mainWindow.setAlwaysOnTop(true);

  // Show the window
  await mainWindow.show();
  await mainWindow.setFocus();

  // Remove always on top after initialization
  await mainWindow.setAlwaysOnTop(false);

  return mainWindow;
}
