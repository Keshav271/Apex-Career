import React from 'react';
import { X, Sparkles, Target, Zap } from 'lucide-react';

const AIAnalysis = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Side Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> AI Strategy
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="prose prose-indigo">
            <div className="bg-indigo-50 p-4 rounded-xl mb-6">
              <p className="text-indigo-900 leading-relaxed whitespace-pre-wrap">
                {data || "No analysis available. Try again!"}
              </p>
            </div>
            {/* We will add more structured sections here later! */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;