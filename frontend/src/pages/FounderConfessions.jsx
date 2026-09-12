import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SOCIAL_CONFESSIONS } from '../lib/data/socialConfessionsData';
import { Heart, CheckCircle2, MessageSquare, ExternalLink, Share2, Sparkles, Filter } from 'lucide-react';

/**
 * Custom SVG Icons for X (Twitter) and Reddit
 */
function XLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditLogo({ className = "w-4 h-4 text-[#FF4500]" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`fill-current ${className}`}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.095.327.327 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

export function FounderConfessions() {
  const [activeTab, setActiveTab] = useState('All');
  const [likedPosts, setLikedPosts] = useState({});

  const categories = [
    'All',
    '𝕏 Convos',
    'Reddit Post-Mortems',
    'Post-Mortems',
    'Cofounder & Burnout'
  ];

  const handleLike = (id) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPosts = SOCIAL_CONFESSIONS.filter(post => {
    if (activeTab === 'All') return true;
    if (activeTab === '𝕏 Convos') return post.platform === 'x';
    if (activeTab === 'Reddit Post-Mortems') return post.platform === 'reddit';
    return post.category === activeTab;
  });

  return (
    <div className="pb-24 bg-[#FAFAFA] dark:bg-black text-black dark:text-white min-h-screen">
      {/* Top Banner Header */}
      <div className="pt-12 pb-8 border-b border-[#EBEBEB] dark:border-[#1F1F1F] bg-white dark:bg-[#0A0A0A]">
        <div className="vault-container text-center max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F2F2] dark:bg-[#1A1A1A] border border-[#E0E0E0] dark:border-[#2A2A2A] text-[11px] font-mono font-bold tracking-wider uppercase text-[#525252] dark:text-[#A3A3A3]">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Real Conversations & Raw Post-Mortems</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black dark:text-white">
            Trusted By +40K Founders
          </h1>

          <p className="text-sm sm:text-base text-[#666666] dark:text-[#A3A3A3] leading-relaxed">
            Real founder admissions, failure autopsies, and unfiltered unit economics breakdowns sourced directly from 𝕏 (Twitter) and Reddit.
          </p>

          {/* Filter Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
                      : 'bg-white dark:bg-[#141414] text-[#666666] dark:text-[#999999] border border-[#E5E5E5] dark:border-[#262626] hover:border-black dark:hover:border-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Masonry / Grid of Cards */}
      <div className="vault-container pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredPosts.map((post) => {
            const isLiked = likedPosts[post.id];
            const currentLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                className="rounded-[16px] border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#0C0C0C] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar, Name, Handle, Social Icon */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#E5E5E5] dark:border-[#333]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[14px] text-black dark:text-white truncate">
                            {post.author}
                          </span>
                          {post.verified && (
                            <svg className="w-3.5 h-3.5 text-[#1D9BF0] fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                          )}
                          {post.subreddit && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFF0E8] dark:bg-[#2A1710] text-[#FF4500] font-bold shrink-0">
                              {post.subreddit}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#737373] dark:text-[#8E8E8E] truncate block font-mono">
                          {post.handle}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 p-1 text-black dark:text-white">
                      {post.platform === 'x' ? (
                        <XLogo className="w-4 h-4" />
                      ) : (
                        <RedditLogo className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Card Body: Text */}
                  <div className="text-[13px] text-[#262626] dark:text-[#D4D4D4] leading-relaxed whitespace-pre-line mb-4 font-sans">
                    {post.text}
                  </div>

                  {/* Rich Preview Blocks if present */}
                  {post.hasPreview && post.previewType === 'cemetery-dossier' && (
                    <div className="mb-4 p-3 rounded-[10px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] overflow-hidden">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#737373] pb-2 border-b border-[#E5E5E5] dark:border-[#262626]">
                        <span className="font-bold text-black dark:text-white">PivotVault Forensic Index</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">● 413+ Autopsies</span>
                      </div>
                      <div className="pt-2 space-y-1.5 text-[11px] font-mono">
                        <div className="flex justify-between text-[#555] dark:text-[#A3A3A3]">
                          <span>Median Capital Lost:</span>
                          <span className="font-bold text-black dark:text-white">$84.2M</span>
                        </div>
                        <div className="flex justify-between text-[#555] dark:text-[#A3A3A3]">
                          <span>#1 Failure Mode:</span>
                          <span className="font-bold text-black dark:text-white">Negative Contribution Margin</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.hasPreview && post.previewType === 'pixels-graphic' && (
                    <div className="mb-4 p-4 rounded-[10px] border border-[#E5E5E5] dark:border-[#2A2A2A] bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-[#121212] text-center">
                      <div className="w-6 h-6 mx-auto mb-1 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black font-mono">
                        ❖
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[#737373] dark:text-[#A3A3A3] font-mono">
                        BREAKDOWN
                      </div>
                      <div className="text-base font-black text-purple-600 dark:text-purple-400 tracking-wider font-mono">
                        PIXELS
                      </div>
                      <div className="text-[11px] text-[#555555] dark:text-[#A3A3A3] mt-0.5">
                        Pixels Break It Down Edition · Forensic Autopsy
                      </div>
                      <div className="mt-3 flex justify-center gap-2 text-purple-500 text-xs">
                        <span>✦ TIPS</span>
                        <span>•</span>
                        <span>⚡ PLAYBOOKS</span>
                        <span>•</span>
                        <span>▲ FAILURES</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Likes, Dot, Date */}
                <div className="pt-3 border-t border-[#F0F0F0] dark:border-[#202020] flex items-center justify-between text-xs text-[#737373] dark:text-[#8E8E8E]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                      }`}
                      title="Like confession"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                      <span className="font-mono text-[11px]">{currentLikes}</span>
                    </button>
                    <span>•</span>
                    <span className="font-mono text-[11px]">{post.date}</span>
                  </div>

                  <span className="text-[10px] font-mono uppercase text-[#A3A3A3]">
                    Verified Convo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FounderConfessions;
