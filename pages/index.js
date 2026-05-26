import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { SCHOOLS } from '../data/schools'

export default function Home() {
  return (
    <>
      <Head>
        <title>MetaPrepa – Alcanza tu meta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-lg mx-auto px-4 pb-10">

          {/* Hero */}
          <section className="pt-6 pb-5 anim-up">
            <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#22c55e', transform: 'translate(40%,-40%)' }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10" style={{ background: '#3b82f6', transform: 'translate(-30%,30%)' }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <span className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
                  <span className="text-xs font-semibold">Convocatoria 2025-2026</span>
                </div>
                <h1 className="text-2xl font-black leading-tight mb-2">
                  Alcanza tu meta:<br />
                  <span style={{ background: 'linear-gradient(135deg,#4ade80,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    entra a la prepa que quieres
                  </span>
                </h1>
                <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
                  Simula, estudia y aprende con tu tutor virtual. Preparación personalizada para tu examen.
                </p>
                <Link href="#escuelas">
                  <button className="w-full py-3 rounded-2xl font-bold text-sm text-white press" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 4px 14px rgba(34,197,94,.3)' }}>
                    🚀 Comenzar mi preparación
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-3 gap-3 mb-6">
            {[['🏫','5','Escuelas'],['❓','100+','Preguntas'],['🎁','100%','Gratis']].map(([icon,val,lbl]) => (
              <div key={lbl} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm">
                <div className="text-xl mb-1">{icon}</div>
                <p className="font-black text-slate-900 text-lg leading-none">{val}</p>
                <p className="text-slate-500 text-xs mt-0.5">{lbl}</p>
              </div>
            ))}
          </section>

          {/* Onboarding */}
          <section className="mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">¿Cómo funciona?</p>
              <div className="flex items-start gap-3">
                {[
                  { icon: '🏫', label: 'Elige tu prepa', desc: 'Selecciona la escuela a la que quieres entrar' },
                  { icon: '📖', label: 'Estudia el tema', desc: 'Lee la explicación y ve los videos' },
                  { icon: '✏️', label: 'Practica', desc: 'Haz ejercicios y refuerza lo aprendido' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 flex flex-col items-center text-center gap-1.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#f0fdf4,#eff6ff)', border: '1.5px solid #e2e8f0' }}>{s.icon}</div>
                    <p className="text-xs font-black text-slate-800 leading-tight">{s.label}</p>
                    <p className="text-xs text-slate-400 leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Schools */}
          <section id="escuelas">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-lg text-slate-900">¿A qué prepa quieres entrar?</h2>
            </div>
            <div className="flex flex-col gap-3">
              {SCHOOLS.map((s, i) => (
                <Link key={s.id} href={'/escuela/' + s.id}>
                  <div className="card-hover press bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm cursor-pointer anim-up" style={{ animationDelay: i * 0.07 + 's', opacity: 0, animationFillMode: 'forwards' }}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shadow-md`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                      <p className="text-xs text-slate-400 truncate mb-1.5">{s.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${s.badge}`}>{s.exam}</span>
                        <span className="text-xs text-slate-400">{s.places}</span>
                      </div>
                    </div>
                    <svg className="text-slate-300 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <footer className="mt-8 text-center">
            <p className="text-xs text-slate-400">MetaPrepa by <span className="font-bold text-slate-600">Red Talento</span> · 2025</p>
          </footer>
        </main>
      </div>
    </>
  )
}
