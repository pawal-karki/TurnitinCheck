'use client';

import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Submit New Check
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Upload your document to analyze for AI-generated content and plagiarism. 
          You&apos;ll receive detailed reports once the analysis is complete.
        </p>
      </div>

      {/* Upload Component */}
      <FileUpload />

      {/* Process Info */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">
          How it works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-emerald-400">1</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Upload</h4>
            <p className="text-sm text-slate-400">
              Drop your PDF, DOC, DOCX, or TXT file
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-cyan-400">2</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Analyze</h4>
            <p className="text-sm text-slate-400">
              Our system scans for AI patterns and plagiarism
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-violet-400">3</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Download</h4>
            <p className="text-sm text-slate-400">
              Get detailed AI and plagiarism reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

