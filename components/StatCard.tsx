
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendType }) => {
  return (
    <div className="bg-white border-2 border-slate-100 p-7 rounded-[2rem] flex items-start justify-between shadow-soft hover-lift transition-all">
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-2">{label}</p>
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${trendType === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-2xl ${
        trendType === 'down' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 }) : icon}
      </div>
    </div>
  );
};

export default StatCard;
