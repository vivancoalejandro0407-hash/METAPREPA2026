import Link from 'next/link'

export default function Header({ backHref, progress }) {
  return (
    <header style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #e2e8f0' }}>
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link href={backHref}>
              <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors press">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              </button>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#22c55e,#3b82f6)' }}>M</div>
            <div>
              <p className="font-black text-sm leading-none text-slate-900">MetaPrepa</p>
              <p className="text-xs text-slate-400 font-semibold leading-none">by Red Talento</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-amber-700">7 días</span>
        </div>
      </div>
      {progress !== undefined && (
        <div className="max-w-lg mx-auto px-4 pb-2">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full progress-fill" style={{ width: progress + '%' }} />
          </div>
        </div>
      )}
    </header>
  )
}
