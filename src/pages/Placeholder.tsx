import React from 'react';
import { Layout } from 'lucide-react';

export default function WorkspacePlaceholder({ title }: { title: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-10 atmosphere text-center">
      <div className="w-24 h-24 rounded-3xl bg-blue-500/5 border border-dashed border-blue-500/20 flex items-center justify-center mb-8">
        <Layout className="w-12 h-12 text-blue-500/20" />
      </div>
      <h2 className="text-4xl font-display font-bold text-white mb-4">{title}</h2>
      <p className="text-white/20 max-w-md font-medium"> This module is currently undergoing system calibration in the evolution cycle v1.2. </p>
    </div>
  );
}
