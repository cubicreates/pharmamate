'use client';

import React, { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-stone-950">
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* Logo */}
        <div className="w-14 h-14 mb-6 rounded-2xl bg-primary flex items-center justify-center text-xl text-white shadow-lg">
          ✚
        </div>

        {/* Text */}
        <h1 className="text-xl font-semibold text-foreground tracking-tight">
          PharmaMate
        </h1>
        <p className="text-xs text-stone-400 font-medium mt-1.5 tracking-wide">
          Clinical Management Suite
        </p>

        {/* Loader */}
        <div className="w-32 h-0.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-stone-400">A MediAssist Product</p>
      </div>
    </div>
  );
}