import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import { getSchool } from '../../../data/schools'
import { getTopics } from '../../../data/topics'

const COLORS = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100',   bar: 'bg-blue-500' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-100',  bar: 'bg-green-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', bar: 'bg-orange-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', bar: 'bg-purple-500' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-100',   bar: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', bar: 'bg-indigo-500' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-100',    bar: 'bg-red-500' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100',  bar: 'bg-amber-500' },
}
const MOCK_PROGRESS = { algebra: 60, porcentajes: 80, lectura: 45, razonamiento: 20, 'algebra-cecyte': 30, estadistica: 10 }

export default function TemasPage() {
  const { query } = useRouter()
  const school = query.id ? getSchool(query.id) : null
  const topics = school ? getTopics(school.exam) : []

  if (!school) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  // group by subject
  const groups = topics.reduce((acc, t) => {
    if (!acc[t.subject]) acc[t.subject] = []
    acc[t.subject].push(t)
    return acc
  }, {})

  return (
    <>
      <Head><title>Temas – {school.name}</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header backHref={'/escuela/' + query.id} />
        <main className="max-w-lg mx-auto px-4 pb-10">
          <div className="pt-6 mb-5">
            <h1 className="text-xl font-black text-slate-900 mb-1">Prepárate por temas</h1>
            <p className="text-sm text-slate-400">Elige un tema para estudiar con tu tutor</p>
          </div>

          {Object.entries(groups).map(([subject, list], gi) => (
            <section key={subject} className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{subject}</p>
              <div className="flex flex-col gap-3">
                {list.map((t, ti) => {
                  const c = COLORS[t.color] || COLORS.blue
                  const prog = MOCK_PROGRESS[t.id] || 0
                  return (
                    <Link key={t.id} href={'/escuela/' + query.id + '/tema/' + t.id}>
                      <div className={`card-hover press bg-white rounded-2xl border ${c.border} shadow-sm p-4 flex items-center gap-3 cursor-pointer anim-up`} style={{ animationDelay: (gi * 4 + ti) * 0.06 + 's', opacity: 0, animationFillMode: 'forwards' }}>
                        <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>{t.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="font-bold text-slate-900 text-sm truncate">{t.title}</p>
                            <span className={`text-xs font-bold ${c.text} ml-2 flex-shrink-0`}>{prog > 0 ? prog + '%' : 'Nuevo'}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2 truncate">{t.desc}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${c.bar} rounded-full`} style={{ width: prog + '%' }} />
                            </div>
                            <span className={`text-xs font-semibold ${c.text} ${c.bg} px-2 py-0.5 rounded-lg`}>{t.difficulty}</span>
                          </div>
                        </div>
                        <svg className="text-slate-300 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
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
