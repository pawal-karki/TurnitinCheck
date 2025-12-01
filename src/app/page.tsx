'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import CheckCard from '@/components/CheckCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import type { ApiKeyDetails, CheckListItem } from '@/types';

export default function Dashboard() {
  const [apiKeyDetails, setApiKeyDetails] = useState<ApiKeyDetails | null>(null);
  const [recentChecks, setRecentChecks] = useState<CheckListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [keyResponse, checksResponse] = await Promise.all([
          fetch('/api/key/details'),
          fetch('/api/checks'),
        ]);

        if (keyResponse.ok) {
          const keyData = await keyResponse.json();
          setApiKeyDetails(keyData);
        }

        if (checksResponse.ok) {
          const checksData = await checksResponse.json();
          // Sort by creation date and take the 5 most recent
          const sorted = checksData
            .sort((a: CheckListItem, b: CheckListItem) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5);
          setRecentChecks(sorted);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const completedChecks = recentChecks.filter(c => c.status === 'completed').length;
  const pendingChecks = recentChecks.filter(c => c.status === 'pending' || c.status === 'processing').length;

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="animated-gradient-text">Document Analysis</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Detect AI-generated content and plagiarism with industry-leading accuracy. 
          Upload your documents and get comprehensive reports in minutes.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/upload"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-semibold text-lg hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
          >
            New Check
          </Link>
          <Link
            href="/history"
            className="px-8 py-4 rounded-xl bg-slate-800 text-white font-semibold text-lg hover:bg-slate-700 border border-slate-700 transition-all"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      {apiKeyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Checks Remaining"
            value={apiKeyDetails.checksRemaining}
            subtitle={`of ${apiKeyDetails.totalChecks} total`}
            gradient="from-emerald-400 to-emerald-600"
            icon={
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="Checks Used"
            value={apiKeyDetails.checksUsed}
            subtitle="documents analyzed"
            gradient="from-cyan-400 to-cyan-600"
            icon={
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatsCard
            title="Completed"
            value={completedChecks}
            subtitle="recent checks"
            gradient="from-violet-400 to-violet-600"
            icon={
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="In Progress"
            value={pendingChecks}
            subtitle="being processed"
            gradient="from-amber-400 to-amber-600"
            icon={
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* API Key Status */}
      {apiKeyDetails && (
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                apiKeyDetails.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
              <div>
                <p className="text-sm text-slate-400">API Key Status</p>
                <p className="font-semibold text-white capitalize">{apiKeyDetails.status}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Key Name</p>
              <p className="font-semibold text-white">{apiKeyDetails.name || 'Default Key'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Expires</p>
              <p className="font-semibold text-white">
                {new Date(apiKeyDetails.expiresAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Checks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Checks</h2>
          {recentChecks.length > 0 && (
            <Link
              href="/history"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-6">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        {recentChecks.length > 0 ? (
          <div className="space-y-4">
            {recentChecks.map((check) => (
              <CheckCard key={check.checkId} check={check} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No checks yet"
            description="Upload your first document to get started with AI and plagiarism detection."
            actionLabel="Upload Document"
            actionHref="/upload"
          />
        )}
      </div>
    </div>
  );
}
