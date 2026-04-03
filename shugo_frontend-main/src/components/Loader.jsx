import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
