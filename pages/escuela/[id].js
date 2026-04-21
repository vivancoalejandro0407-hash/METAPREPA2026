import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import { getSchool } from '../../data/schools'
import { getTopics } from '../../data/topics'

export default function EscuelaPage() {
  const { query } = useRouter()
  const school = query.id ? getSchool(query.id) : null
  const topics = school ? getTopics(school.exam) : []

  if (!school) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  const actions = [
    { href: '/escuela/' + query.id + '/simulador', icon: '🧪', title: 'Hacer simulacro', desc: 'Examen con tiempo y puntaje', tag: topics.length + ' temas', grad: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
    { href: '/escuela/' + query.id + '/temas',     icon: '🧠', title: 'Prepararte por temas', desc: 'Explicaciones + tutor virtual', tag: 'Recomendado', grad: 'linear-gradient(135deg,#22c55e,#15803d)' },
    { href: '/escuela/' + query.id + '/temario',   icon: '📚', title: 'Ver el temario', desc: 'Todo lo que entra al examen', tag: school.exam, grad: 'linear-gradient(135deg,#f97316,#c2410c)' },
  ]

  return (
    <>
      <Head><title>{school.name} – MetaPrepa</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header backHref="/" />
        <main className="max-w-lg mx-auto px-4 pb-10">

          {/* School hero */}
          <section className="pt-5 mb-4 anim-up">
            <div className={`bg-gradient-to-br ${school.gradient} rounded-3xl p-5 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(255,255,255,.2)' }}>{school.icon}</div>
                <div>
                  <h1 className="text-xl font-black">{school.name}</h1>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,.8)' }}>{school.desc}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,.2)' }}>Examen: {school.exam}</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,.2)' }}>{school.places}</span>
              </div>
            </div>
          </section>

          {/* Progress */}
          <div className="rounded-2xl p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>Tu progreso</p>
            <p className="font-bold text-lg mb-1">¡Sigue así! 💪</p>
            <p className="text-xs mb-3" style={{ color: '#94a3b8' }}>32% del temario completado</p>
            <div className="h-2 rounded-full mb-3" style={{ background: 'rgba(255,255,255,.1)' }}>
              <div className="h-full progress-fill" style={{ width: '32%' }} />
            </div>
            <Link href={'/escuela/' + query.id + '/temas'}>
              <button className="w-full py-2.5 rounded-xl text-sm font-bold press" style={{ background: 'rgba(255,255,255,.1)' }}>
                Continuar donde me quedé →
              </button>
            </Link>
          </div>

          {/* Actions */}
          <h2 className="font-black text-base text-slate-900 mb-3">¿Qué quieres hacer?</h2>
          <div className="flex flex-col gap-3">
            {actions.map((a) => (
              <Link key={a.href} href={a.href}>
                <div className="card-hover press bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md flex-shrink-0" style={{ background: a.grad }}>{a.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{a.title}</p>
                    <p className="text-xs text-slate-400 mb-1">{a.desc}</p>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{a.tag}</span>
                  </div>
                  <svg className="text-slate-300" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>

        </main>
      </div>
    </>
  )
}

export function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'udg' } },
      { params: { id: 'cecytej' } },
      { params: { id: 'cobaej' } },
      { params: { id: 'cecyte-emsad' } },
      { params: { id: 'ceti' } },
      { params: { id: 'tecmilenio' } },
    ],
    fallback: false
  }
}
export function getStaticProps({ params }) {
  return { props: { id: params.id } }
}
