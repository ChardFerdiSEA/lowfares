import React from 'react';
import { AirlineCode } from '@/types/flight';

interface AirlineLogoProps {
  airlineCode: AirlineCode;
  airlineName: string;
}

export default function AirlineLogo({ airlineCode, airlineName }: AirlineLogoProps) {
  // Clean, high contrast badges with airline identity colors
  if (airlineCode === 'PAL') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-amber-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm shrink-0">
          PAL
        </div>
        <div>
          <span className="font-bold text-sm text-slate-900 dark:text-white block">{airlineName}</span>
          <span className="text-[11px] text-slate-400 font-medium">Philippine Flag Carrier</span>
        </div>
      </div>
    );
  }

  if (airlineCode === 'CEB') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-blue-900 font-black text-sm shadow-sm shrink-0">
          5J
        </div>
        <div>
          <span className="font-bold text-sm text-slate-900 dark:text-white block">{airlineName}</span>
          <span className="text-[11px] text-slate-400 font-medium">Cebu Pacific Air</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
        AA
      </div>
      <div>
        <span className="font-bold text-sm text-slate-900 dark:text-white block">{airlineName}</span>
        <span className="text-[11px] text-slate-400 font-medium">AirAsia Philippines</span>
      </div>
    </div>
  );
}
