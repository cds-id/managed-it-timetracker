const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-indigo-600 flex items-center justify-center">
      <div className="text-center">
        <img src="/logo.png" alt="Managed IT" className="w-32 h-32 mx-auto mb-8" />
        <div className="text-white text-2xl font-bold">Managed IT Timetracker</div>
        <div className="mt-4">
          <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-white rounded-full animate-[bounce_1s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
