import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Building2, Globe, Users, DollarSign, Calendar, Clock, 
  ChevronRight, TrendingDown, Info, ShieldAlert 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { clsx } from 'clsx';
import StartupCard from '../components/StartupCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const PostmortemPage = () => {
  const { slug } = useParams();
  const [startup, setStartup] = React.useState(null);
  const [similar, setSimilar] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [res, resSim] = await Promise.all([
          axios.get(`${API_URL}/api/startups/${slug}`),
          axios.get(`${API_URL}/api/startups/${slug}/similar`)
        ]);
        setStartup(res.data);
        setSimilar(resSim.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="py-40 text-center animate-pulse text-accent font-data">LOADING POSTMORTEM...</div>;
  if (!startup) return <div className="py-40 text-center">Startup not found.</div>;

  const formatINR = (val) => {
    if (!val) return 'N/A';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    return `₹${(num / 100000).toFixed(1)} L`;
  };

  const aiAnalysis = startup.aiAnalyses?.[0];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-surface-2 rounded-2xl flex items-center justify-center text-4xl font-bold text-accent border border-border shadow-xl">
                {startup.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-display font-bold">{startup.name}</h1>
                  <span className="bg-red/10 text-red border border-red/20 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {startup.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                  <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {startup.industry}</span>
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {startup.country}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {startup.lifetimeMonths} Months Lifetime</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-surface border border-border px-6 py-4 rounded-card text-center">
                <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Total Burn</div>
                <div className="text-xl font-data font-bold text-accent">{formatINR(startup.fundingInr)}</div>
              </div>
              <div className="bg-surface border border-border px-6 py-4 rounded-card text-center">
                <div className="text-[10px] text-text-muted uppercase font-bold mb-1">Peak Users</div>
                <div className="text-xl font-data font-bold text-accent">{startup.peakUsers?.toLocaleString() || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Narrative & Timeline */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Info className="text-accent w-6 h-6" />
              The Founder's Story
            </h2>
            <div className="glass-card p-8 prose prose-invert max-w-none prose-orange">
              {startup.founderStory?.split('\n').map((line, i) => (
                <p key={i} className="text-text-secondary leading-relaxed mb-4">{line}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
              <Calendar className="text-accent w-6 h-6" />
              Postmortem Timeline
            </h2>
            <div className="relative pl-8 space-y-10 border-l border-border ml-4">
              {startup.timelineEvents.map((event, i) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center text-accent group">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-data text-text-muted uppercase mb-1">
                        {new Date(event.eventDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed max-w-xl">{event.description}</p>
                    </div>
                    {event.metricKey && (
                      <div className="bg-surface-2/50 px-4 py-2 rounded-lg border border-border">
                        <div className="text-[10px] text-text-muted uppercase">{event.metricKey}</div>
                        <div className="text-sm font-bold text-accent-2">{event.metricValue}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
              <TrendingDown className="text-accent w-6 h-6" />
              Key Metrics Trend
            </h2>
            <div className="glass-card p-8 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={startup.metricsSnapshots}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="recordedMonth" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { month: 'short' })}
                    tick={{ fill: '#475569', fontSize: 11 }}
                    axisLine={false}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  />
                  <Line type="monotone" dataKey="users" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} />
                  <Line type="monotone" dataKey="churnRate" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right: AI Analysis & Similar */}
        <div className="space-y-12">
          {aiAnalysis && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <ShieldAlert className="text-accent-2 w-6 h-6" />
                AI Failure Analysis
              </h2>
              <div className="bg-accent-2/5 border border-accent-2/20 rounded-card p-8">
                <div className="text-center mb-8">
                  <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2">Primary Failure Mode</div>
                  <div className="text-2xl font-display font-bold text-accent-2 mb-1">{aiAnalysis.primaryCause}</div>
                  <div className="text-xs text-text-muted">AI Confidence: {aiAnalysis.confidence}%</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { label: 'Retention', value: aiAnalysis.retentionScore },
                    { label: 'Revenue', value: aiAnalysis.monetizationScore },
                    { label: 'PMF', value: aiAnalysis.pmfScore },
                    { label: 'Marketing', value: aiAnalysis.marketingScore },
                  ].map(score => (
                    <div key={score.label} className="text-center">
                      <div className="text-xl font-data font-bold mb-1">{score.value}%</div>
                      <div className="text-[10px] text-text-muted uppercase">{score.label}</div>
                      <div className="w-full bg-surface-2 h-1 rounded-full mt-2">
                        <div className="bg-accent-2 h-full rounded-full" style={{ width: `${score.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-bold border-b border-accent-2/10 pb-2">Top AI Recommendations</div>
                  {Array.isArray(aiAnalysis.recommendations) && aiAnalysis.recommendations.map((rec, i) => (
                    <div key={i} className="text-xs leading-relaxed">
                      <span className="text-accent-2 font-bold uppercase">[{rec.priority}]</span> {rec.action}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-display font-bold mb-6">Similar Failures</h2>
            <div className="space-y-6">
              {similar.map(s => (
                <StartupCard key={s.id} {...s} topFailureReason={null} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostmortemPage;