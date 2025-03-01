import { useState } from 'react';
import { useConfigStore } from '../store/config';
import { apiService } from '../services/api';

const Setup = () => {
  const { config, setConfig } = useConfigStore();
  const [hostUrl, setHostUrl] = useState(config?.host_url || '');
  const [tokenApi, setTokenApi] = useState(config?.token_api || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const newConfig = { host_url: hostUrl, token_api: tokenApi };
      const isValid = await apiService.validateConfig(newConfig);

      if (isValid) {
        setConfig(newConfig);
        apiService.setConfig(newConfig);
      } else {
        setError('Invalid configuration. Please check your host URL and API token.');
      }
    } catch (err) {
      setError('An error occurred while validating the configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="/logo.png" alt="Managed IT" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configure Time Tracker
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="host_url" className="block text-sm font-medium text-gray-700">
                Host URL
              </label>
              <div className="mt-1">
                <input
                  id="host_url"
                  name="host_url"
                  type="url"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={hostUrl}
                  onChange={(e) => setHostUrl(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="token_api" className="block text-sm font-medium text-gray-700">
                API Token
              </label>
              <div className="mt-1">
                <input
                  id="token_api"
                  name="token_api"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={tokenApi}
                  onChange={(e) => setTokenApi(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Validating...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;
