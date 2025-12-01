'use client';

import { useEffect, useState } from 'react';
import CheckCard from '@/components/CheckCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import type { CheckListItem } from '@/types';

export default function HistoryPage() {
  const [checks, setChecks] = useState<CheckListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/checks');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch checks');
      }
      
      const data = await response.json();
      const sorted = data.sort(
        (a: CheckListItem, b: CheckListItem) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setChecks(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all checks? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/checks', { method: 'DELETE' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete checks');
      }
      
      setChecks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete checks');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredChecks = checks.filter((check) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return check.status === 'pending' || check.status === 'processing';
    return check.status === filter;
  });

  const statusCounts = {
    all: checks.length,
    pending: checks.filter(c => c.status === 'pending' || c.status === 'processing').length,
    completed: checks.filter(c => c.status === 'completed').length,
    failed: checks.filter(c => c.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading check history..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Check History</h1>
          <p className="text-slate-400 mt-2">
            View and manage all your document checks
          </p>
        </div>
        {checks.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete All'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      {checks.length > 0 && (
        <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
          {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      )}

      {/* Checks List */}
      {filteredChecks.length > 0 ? (
        <div className="space-y-4">
          {filteredChecks.map((check) => (
            <CheckCard key={check.checkId} check={check} />
          ))}
        </div>
      ) : checks.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No {filter} checks found</p>
        </div>
      ) : (
        <EmptyState
          title="No checks yet"
          description="You haven't submitted any documents for checking. Upload your first document to get started."
          actionLabel="Upload Document"
          actionHref="/upload"
        />
      )}
    </div>
  );
}

