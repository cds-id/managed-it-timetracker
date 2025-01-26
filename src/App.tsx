import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useConfigStore } from './store/config';
import Setup from './pages/Setup';
import Tasks from './pages/Tasks';
import TimeTracking from './pages/TimeTracking';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import { initializeWindow } from './utils/window';
import { TrayManager } from './components/TrayManager';

function App() {
  const { config } = useConfigStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize window
        await initializeWindow();

        // Show splash screen if we have config
        if (config) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setIsLoading(false);
      }
    };

    init();
  }, [config]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!config) {
    return <Setup />;
  }

  return (
    <>
      <TrayManager />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="time-tracking" element={<TimeTracking />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Setup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
