import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

const StartupCard = ({ name, slug, status, industry, fundingInr, peakUsers, lifetimeMonths, summary, topFailureReason }) => {
  const formatINR = (val) => {
    if (!val) return 'Undisclosed';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const statusColors = {
    failed: 'bg-red/10 text-red border-red/20',
    acquired: 'bg-green/10 text-green border-green/20',
    pivoted: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    zombie: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  };

  return (
    <Link to={`/startup/${slug}`} className="group block h-full">
      <div className="glass-card p-6 h-full flex flex-col hover:border-accent transition-all group-hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center font-bold text-accent border border-border group-hover:border-accent/50 transition-colors">
            {name.charAt(0)}
          </div>
          <span className={clsx(
            'px-2 py-0.5 rounded-badge text-[10px] font-bold uppercase tracking-wider border',
            statusColors[status] || statusColors.failed
          )}>
            {status}
          </span>
        </div>

        <h3 className="text-xl font-display font-bold mb-1 group-hover:text-accent transition-colors">{name}</h3>
        <p className="text-xs text-text-secondary mb-3">{industry}</p>
        
        <p className="text-sm text-text-secondary line-clamp-3 mb-6 flex-1">
          {summary}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <DollarSign className="w-3 h-3 text-accent" />
            <span className="font-data text-text-secondary">{formatINR(fundingInr)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <Calendar className="w-3 h-3 text-accent" />
            <span className="font-data text-text-secondary">{lifetimeMonths} Mo.</span>
          </div>
        </div>

        {topFailureReason && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Top Killer</div>
            <div className="text-xs font-medium text-red/80">{topFailureReason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default StartupCard;