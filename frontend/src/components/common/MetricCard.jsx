import React from 'react';

export function MetricCard({ label, value, subtext, icon: Icon, trend, alert = false, sparkline }) {
  return (
    <div 
      className="p-5 md:p-6 relative overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e3e8ee',
        borderRadius: '16px',
        boxShadow: 'rgba(0, 55, 112, 0.08) 0px 2px 12px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: alert ? 'rgba(234, 34, 97, 0.10)' : '#b9b9f9',
                color: alert ? '#ea2261' : '#533afd'
              }}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span 
            className="uppercase"
            style={{
              color: '#64748d',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            {label}
          </span>
        </div>

        {trend && (
          <span 
            className="inline-flex items-center justify-center font-semibold"
            style={{
              backgroundColor: alert ? 'rgba(234, 34, 97, 0.10)' : '#b9b9f9',
              color: alert ? '#ea2261' : '#4434d4',
              borderRadius: '9999px',
              fontSize: '10px',
              padding: '3px 8px',
              lineHeight: 1,
            }}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between mb-2">
        <div 
          style={{
            color: '#0d253d',
            fontSize: '34px',
            fontWeight: 700,
            fontFeatureSettings: '"tnum"',
            letterSpacing: '-0.42px',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        {sparkline}
      </div>

      {subtext && (
        <div 
          style={{
            color: '#64748d',
            fontSize: '11px',
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}

export default MetricCard;
