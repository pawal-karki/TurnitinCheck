'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { CheckDetails } from '@/types';

interface PageProps {
  params: Promise<{ checkId: string }>;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    description: 'Your document is queued for analysis.',
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description: 'Your document is being analyzed.',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    description: 'Analysis complete. Download your reports below.',
  },
  failed: {
    label: 'Failed',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    description: 'An error occurred during analysis.',
  },
};

export default function CheckDetailPage({ params }: PageProps) {
  const { checkId } = use(params);
  const [check, setCheck] = useState<CheckDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingAi, setDownloadingAi] = useState(false);
  const [downloadingPlag, setDownloadingPlag] = useState(false);

  useEffect(() => {
    const fetchCheck = async () => {
      try {
        const response = await fetch(`/api/check/${checkId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch check details');
        }
        
        const data = await response.json();
        setCheck(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCheck();
    
    // Poll for updates if pending or processing
    const interval = setInterval(fetchCheck, 10000);
    return () => clearInterval(interval);
  }, [checkId]);

  const handleDownloadAiReport = async () => {
    if (!check || check.status !== 'completed') return;
    
    setDownloadingAi(true);
    try {
      const response = await fetch(`/api/report/ai/${checkId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_report_${checkId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download AI report');
    } finally {
      setDownloadingAi(false);
    }
  };

  const handleDownloadPlagReport = async () => {
    if (!check || check.status !== 'completed') return;
    
    setDownloadingPlag(true);
    try {
      const response = await fetch(`/api/report/plagiarism/${checkId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plagiarism_report_${checkId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download plagiarism report');
    } finally {
      setDownloadingPlag(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading check details..." />
      </div>
    );
  }

  if (error || !check) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check Not Found</h2>
        <p className="text-slate-400 mb-6">{error || 'The requested check could not be found.'}</p>
        <Link
          href="/history"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to History
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[check.status] || STATUS_CONFIG.pending;
  const hasAiReport = check.reportId?.reports?.ai?.reportUrl;
  const hasPlagReport = check.reportId?.reports?.plagiarism?.reportUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link
        href="/history"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to History
      </Link>

      {/* Status Banner */}
      <div className={`p-6 rounded-2xl ${status.bg} border ${status.border}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${status.bg} border ${status.border} flex items-center justify-center`}>
            {check.status === 'processing' ? (
              <svg className="w-6 h-6 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : check.status === 'completed' ? (
              <svg className={`w-6 h-6 ${status.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : check.status === 'failed' ? (
              <svg className={`w-6 h-6 ${status.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-6 h-6 ${status.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className={`text-xl font-bold ${status.color}`}>{status.label}</h2>
            <p className="text-slate-400">{status.description}</p>
          </div>
        </div>
      </div>

      {/* File Details */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-lg font-semibold text-white mb-6">Document Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">File Name</p>
            <p className="font-medium text-white">{check.fileId?.originalFileName || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">File Type</p>
            <p className="font-medium text-white uppercase">{check.fileId?.fileType || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">File Size</p>
            <p className="font-medium text-white">{formatFileSize(check.fileId?.fileSize || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Check ID</p>
            <p className="font-mono text-sm text-white truncate">{check.checkId}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Submitted</p>
            <p className="font-medium text-white">{formatDate(check.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Expected Delivery</p>
            <p className="font-medium text-white">{formatDate(check.deliveryTime)}</p>
          </div>
          {check.priority && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Priority</p>
              <p className={`font-medium capitalize ${
                check.priority === 'high' ? 'text-amber-400' : 'text-white'
              }`}>{check.priority}</p>
            </div>
          )}
          {check.planType && (
            <div>
              <p className="text-sm text-slate-400 mb-1">Plan Type</p>
              <p className="font-medium text-white capitalize">{check.planType}</p>
            </div>
          )}
        </div>
      </div>

      {/* Download Reports */}
      {check.status === 'completed' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6">Download Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Report */}
            <button
              onClick={handleDownloadAiReport}
              disabled={!hasAiReport || downloadingAi}
              className={`p-6 rounded-xl border transition-all text-left ${
                hasAiReport
                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer'
                  : 'bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">AI Detection Report</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {hasAiReport ? 'Download AI content analysis' : 'Report not available'}
                  </p>
                  {downloadingAi && (
                    <p className="text-sm text-emerald-400 mt-2">Downloading...</p>
                  )}
                </div>
                {hasAiReport && (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </div>
            </button>

            {/* Plagiarism Report */}
            <button
              onClick={handleDownloadPlagReport}
              disabled={!hasPlagReport || downloadingPlag}
              className={`p-6 rounded-xl border transition-all text-left ${
                hasPlagReport
                  ? 'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/30 cursor-pointer'
                  : 'bg-slate-800/50 border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Plagiarism Report</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {hasPlagReport ? 'Download plagiarism analysis' : 'Report not available'}
                  </p>
                  {downloadingPlag && (
                    <p className="text-sm text-cyan-400 mt-2">Downloading...</p>
                  )}
                </div>
                {hasPlagReport && (
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Staff Info (if available) */}
      {check.reportId?.staffId && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-4">Reviewed By</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-slate-950 font-bold">
                {check.reportId.staffId.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{check.reportId.staffId.name}</p>
              <p className="text-sm text-slate-400">{check.reportId.staffId.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Message */}
      {(check.status === 'pending' || check.status === 'processing') && (
        <div className="text-center py-8">
          <LoadingSpinner size="md" />
          <p className="text-slate-400 mt-4">
            This page will automatically update when your report is ready.
          </p>
        </div>
      )}
    </div>
  );
}

