import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import { getSchool } from '../../../data/schools'
import { getTopics } from '../../../data/topics'

export default function TemarioPage() {
  const { query } = useRouter()
  const school = query.id ? getSchool(query.id) : null
  const topics = school ? getTopics(school.exam) : []

  if (!school) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  const groups = topics.reduce((acc, t) => {
    if (!acc[t.subject]) acc[t.subject] = []
    acc[t.subject].push(t)
    return acc
  }, {})

  return (
    <>
      <Head><title>Temario – {school.name}</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header backHref={'/escuela/' + query.id} />
        <main className="max-w-lg mx-auto px-4 pb-10">
          <div className="pt-6 mb-4">
            <h1 className="text-xl font-black text-slate-900 mb-1">Temario oficial</h1>
            <p className="text-sm text-slate-400">Basado en la guía oficial del {school.exam}</p>
            <div className={`mt-4 bg-gradient-to-br ${school.gradient} rounded-2xl p-4 text-white`}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-2xl font-black">{topics.length}</p><p className="text-xs" style={{ color: 'rgba(255,255,255,.8)' }}>Temas</p></div>
                <div><p className="text-2xl font-black">{Object.keys(groups).length}</p><p className="text-xs" style={{ color: 'rgba(255,255,255,.8)' }}>Materias</p></div>
                <div><p className="text-2xl font-black">150</p><p className="text-xs" style={{ color: 'rgba(255,255,255,.8)' }}>Min</p></div>
              </div>
            </div>
          </div>

          {Object.entries(groups).map(([subject, list]) => (
            <section key={subject} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(#22c55e,#3b82f6)' }} />
                <h2 className="font-black text-slate-900 text-sm">{subject}</h2>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {list.map((t, i) => (
                  <Link key={t.id} href={'/escuela/' + query.id + '/tema/' + t.id}>
                    <div className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${i < list.length - 1 ? 'border-b border-slate-50' : ''}`}>
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{t.emoji}</div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                        <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-lg ${
                          t.difficulty === 'Básica' ? 'bg-green-100 text-green-700' :
                          t.difficulty === 'Media' ? 'bg-blue-100 text-blue-700' :
                          t.difficulty === 'Media-Alta' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>{t.difficulty}</span>
                      </div>
                      <svg className="text-slate-300 mt-1 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </Link>
                ))}
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
