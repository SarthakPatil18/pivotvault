import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { Calendar, Tag, Sparkles } from 'lucide-react';

export default function StartupDetailPage() {
  const { slug } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/startups/${slug}`)
      .then(({ data }) => setStartup(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8">Loading intelligence report...</div>;
  if (!startup) return <div className="p-8 text-red-500">Startup not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{startup.name}</h1>
        {startup.isAiGenerated && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/30">
            <Sparkles size={12} />
            AI GENERATED ANALYSIS
          </span>
        )}
      </div>
      <p className="text-slate-600 dark:text-slate-400">{startup.summary}</p>

      <div className="flex gap-4 text-sm">
        <span className="font-semibold">Status:</span>
        <span className="capitalize">{startup.status}</span>
      </div>

      {startup.tags && startup.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {startup.tags.map((t) => (
            <span key={t} className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">
              <Tag size={14} className="inline mr-1" />
              {t}
            </span>
          ))}
        </div>
      )}

      {startup.timelineEvents?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Calendar size={20} /> Timeline
          </h2>
          <ul className="space-y-2">
            {startup.timelineEvents.map((ev) => (
              <li key={ev.id} className="flex justify-between">
                <span>{ev.title}</span>
                <span className="font-mono text-slate-500">{ev.year}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {startup.failureReasons?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Failure Reasons</h2>
          <ul className="space-y-2">
            {startup.failureReasons.map((fr) => (
              <li key={fr.id} className="border-l-4 border-red-400 pl-2">
                <strong>{fr.category}</strong> – {fr.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
