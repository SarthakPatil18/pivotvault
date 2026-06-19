import React from 'react';
import { ClipboardCheck, Loader2, Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

const FounderPlaybook = () => {
  const [form, setForm] = React.useState({ idea: '', industry: 'SaaS', stage: 'idea' });
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/ai/playbook', form);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not generate playbook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pv-content-container py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase text-text-muted tracking-[0.2em] mb-2">
            Founder Tools
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-3">Founder Playbook</h1>
          <p className="text-text-secondary text-lg max-w-2xl">Generate a validation checklist and strategic plan based on historical failure patterns.</p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-4">
            <div className="pv-card p-6 sticky top-24">
              <h2 className="text-lg font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-accent" />
                Input Parameters
              </h2>
              <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest">Startup Idea</label>
                  <textarea
                    required
                    rows={6}
                    value={form.idea}
                    onChange={(e) => setForm({ ...form, idea: e.target.value })}
                    className="pv-field"
                    placeholder="Describe your product, customer, and painful problem..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest">Industry</label>
                  <input 
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="pv-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest">Stage</label>
                  <select 
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="pv-field"
                  >
                    <option value="idea">Idea</option>
                    <option value="prototype">Prototype</option>
                    <option value="launch">Launch</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>

                {error && (
                  <div className="text-sm text-danger bg-danger/10 border border-danger/30 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="pv-btn-primary w-full justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  Generate Playbook
                </button>
              </form>
            </div>
          </div>

          {/* Right: Report */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="pv-card p-8">
                  <div className="text-xs font-bold uppercase text-accent tracking-widest mb-3">
                    Executive Summary
                  </div>
                  <h2 className="text-2xl font-display font-bold text-text-primary mb-4">Strategic Playbook</h2>
                  <p className="text-text-secondary leading-relaxed text-lg">{result.summary}</p>
                </div>

                {/* Checklist and Risks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Validation Checklist */}
                  <div className="pv-card p-6 border-accent/20 bg-surface/20">
                    <h3 className="font-display font-bold text-accent mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-accent rounded-full"></div>
                      Validation Checklist
                    </h3>
                    <ul className="space-y-3">
                      {(result.checklist || []).map((item, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0"></span>
                          <span className="text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lethal Risks */}
                  <div className="pv-card p-6 border-danger/20 bg-surface/20">
                    <h3 className="font-display font-bold text-danger mb-5 flex items-center gap-2">
                      <div className="w-1 h-6 bg-danger rounded-full"></div>
                      Lethal Risks
                    </h3>
                    <ul className="space-y-3">
                      {(result.risks || []).map((item, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5"></AlertTriangle>
                          <span className="text-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="pv-card p-8 border-accent/20 bg-surface/20">
                  <h3 className="text-xl font-display font-bold text-text-primary mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Recommended Next Steps
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(result.nextSteps || []).map((step, i) => (
                      <div key={i} className="border border-border rounded-lg p-5 bg-surface flex items-center gap-4">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-data font-bold text-sm">
                          {i + 1}
                        </span>
                        <span className="text-text-primary font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pv-card p-16 text-center min-h-[500px] flex flex-col items-center justify-center">
                <ClipboardCheck className="w-16 h-16 text-text-muted mb-6" />
                <h2 className="text-xl font-display font-bold text-text-primary mb-3">Generate Your Playbook</h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  Fill in the form on the left to generate an evidence-based validation checklist and strategic plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderPlaybook;
