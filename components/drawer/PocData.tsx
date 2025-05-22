import { User } from 'lucide-react';
import React from 'react';

const PocData = ({ pocName, pocPhone }: { pocName: string; pocPhone: string }) => {
  return (
    <div className="px-4 pt-2 pb-6">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"> <User size={16}/> Point of Contact</h3>

      <div className="rounded-2xl border border-border/40 bg-card shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">Name</span>
          <span className="text-gray-800 font-semibold">{pocName}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">Phone</span>
          <span className="text-gray-800 font-semibold">{pocPhone}</span>
        </div>
      </div>
    </div>
  );
};

export default PocData;
