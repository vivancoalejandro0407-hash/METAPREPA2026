import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '../../../../components/Header'
import { getSchool } from '../../../../data/schools'
import { getTopic } from '../../../../data/topics'

function Block({ b, i }) {
  if (b.type === 'h2') return <h2 key={i} className="text-lg font-black text-slate-900 mt-5 mb-2 first:mt-0">{b.text}</h2>
  if (b.type === 'h3') return <h3 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-1.5 uppercase tracking-wide">{b.text}</h3>
  if (b.type === 'p')  return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-1">{b.text}</p>
  if (b.type === 'example') return <pre key={i} className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-100 rounded-xl p-3 my-2 whitespace-pre-wrap leading-relaxed overflow-x-auto">{b.text}</pre>
  if (b.type === 'tip') return (
    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-3 my-3 flex gap-2">
      <span className="text-base flex-shrink-0">💡</span>
      <p className="text-xs text-amber-800 leading-relaxed">{b.text}</p>
    </div>
  )
  return null
}

function PracticeSection({ practice }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [shown, setShown] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (!practice || practice.length === 0) return null
  if (done) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
      <p className="text-4xl mb-3">{score >= practice.length * 0.7 ? '🏆' : '💪'}</p>
      <p className="font-black text-slate-900 text-lg">{score}/{practice.length} correctas</p>
      <p className="text-sm text-slate-400 mb-4">{score >= practice.length * 0.7 ? '¡Excelente dominio del tema!' : 'Repasa la explicación y vuelve a intentarlo'}</p>
      <button onClick={() => { setIdx(0); setSelected(null); setShown(false); setScore(0); setDone(false) }}
        className="w-full py-3 rounded-xl text-white font-bold text-sm press" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
        🔄 Intentar de nuevo
      </button>
    </div>
  )

  const q = practice[idx]
  const letters = ['A', 'B', 'C', 'D']

  function pick(i) {
    if (shown) return
    setSelected(i)
    setShown(true)
    if (i === q.ans) setScore((s) => s + 1)
  }

  function next() {
    if (idx + 1 >= practice.length) { setDone(true); return }
    setIdx((n) => n + 1); setSelected(null); setShown(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between" style={{ background: '#f8fafc' }}>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Práctica</p>
        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">{idx + 1}/{practice.length}</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-slate-900 text-sm leading-relaxed mb-4">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            let cls = 'bg-white border-2 border-slate-200 text-slate-700'
            let lCls = 'bg-slate-100 text-slate-500'
            if (shown) {
              if (i === q.ans)          { cls = 'bg-green-50 border-2 border-green-400 text-green-800'; lCls = 'bg-green-500 text-white' }
              else if (i === selected)  { cls = 'bg-red-50 border-2 border-red-400 text-red-700'; lCls = 'bg-red-500 text-white' }
              else                      { cls = 'border-2 border-slate-100 text-slate-300 opacity-50' }
            }
            return (
              <button key={i} onClick={() => pick(i)} className={`w-full text-left p-3 rounded-xl font-semibold text-sm transition-all press flex items-center gap-3 ${cls}`}>
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${lCls}`}>{letters[i]}</span>
                {opt}
              </button>
            )
          })}
        </div>
        {shown && (
          <div className="mt-3">
            <div className={`rounded-xl p-3 mb-3 ${selected === q.ans ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-xs font-bold mb-1 ${selected === q.ans ? 'text-green-800' : 'text-red-800'}`}>
                {selected === q.ans ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">{q.sol}</p>
            </div>
            <button onClick={next} className="w-full py-2.5 rounded-xl text-white font-bold text-sm press" style={{ background: '#0f172a' }}>
              {idx + 1 < practice.length ? 'Siguiente →' : 'Ver resultado 🏆'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const TABS = ['📖 Explicación', '✏️ Práctica', '👨‍🏫 Tutor', '🎥 Videos']

export default function TemaPage({ id, topicId }) {
  const router = useRouter()
  const resolvedId = id || router.query.id
  const resolvedTopicId = topicId || router.query.topicId
  const school = resolvedId ? getSchool(resolvedId) : null
  const topic  = (school && resolvedTopicId) ? getTopic(school.exam, resolvedTopicId) : null

  const [tab, setTab]       = useState(0)
  const [msgs, setMsgs]     = useState([])
  const [input, setInput]   = useState('')
  const [typing, setTyping] = useState(false)
  const [chatIdx, setChatIdx] = useState(1)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (topic && msgs.length === 0) setMsgs([{ role: 'bot', text: topic.chat[0] }])
  }, [topic])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  if (!school || !topic) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  function sendMsg() {
    const txt = input.trim(); if (!txt) return
    setMsgs((p) => [...p, { role: 'user', text: txt }])
    setInput(''); setTyping(true)
    setTimeout(() => {
      const reply = topic.chat[chatIdx % topic.chat.length] || '¡Muy bien! La constancia es la clave. 💪'
      setMsgs((p) => [...p, { role: 'bot', text: reply }])
      setChatIdx((n) => n + 1); setTyping(false)
    }, 1100)
  }

  return (
    <>
      <Head><title>{topic.title} – MetaPrepa</title></Head>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header backHref={'/escuela/' + resolvedId + '/temas'} />
        <div className="max-w-lg mx-auto w-full px-4 pt-4 pb-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">{topic.emoji}</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{topic.subject}</p>
              <h1 className="text-base font-black text-slate-900">{topic.title}</h1>
              <p className="text-xs text-slate-400">{topic.difficulty} · {(topic.practice || []).length} ejercicios</p>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl p-1 flex gap-1 mb-4">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all press ${tab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">

          {tab === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              {(topic.content || []).map((b, i) => <Block key={i} b={b} i={i} />)}
              <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
                <button onClick={() => setTab(1)} className="flex-1 py-3 rounded-2xl text-white text-sm font-bold press" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>✏️ Practicar</button>
                <button onClick={() => setTab(2)} className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold press">👨‍🏫 Tutor</button>
              </div>
            </div>
          )}

          {tab === 1 && <PracticeSection practice={topic.practice} />}

          {tab === 2 && (
            <div className="flex flex-col" style={{ height: '62vh' }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full">
                <div className="px-4 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#4ade80,#60a5fa)' }}>🤖</div>
                  <div>
                    <p className="font-bold text-white text-sm">Tutor MetaPrepa</p>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>● En línea</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                  {msgs.map((m, i) => (
                    <div key={i} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'bot' && <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg,#4ade80,#60a5fa)' }}>🤖</div>}
                      <div className={`max-w-xs px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>{m.text}</div>
                    </div>
                  ))}
                  {typing && (
                    <div className="flex items-end gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg,#4ade80,#60a5fa)' }}>🤖</div>
                      <div className="bubble-bot px-4 py-3 flex gap-1">
                        {[0,1,2].map((d) => <span key={d} className="w-2 h-2 bg-slate-400 rounded-full block" style={{ animation: 'typing 0.6s ' + (d * 0.2) + 's infinite' }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
                <div className="bg-white border-t border-slate-100 p-3 flex-shrink-0">
                  <div className="flex gap-2">
                    <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Escribe tu pregunta..." value={input}
                      onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMsg()} />
                    <button onClick={sendMsg} className="w-11 h-11 rounded-xl text-white flex items-center justify-center press flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['Explícame más fácil', 'Dame un ejemplo', '¿Qué entra al examen?'].map((q) => (
                      <button key={q} onClick={() => setInput(q)} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-xl font-medium press hover:bg-blue-50 hover:text-blue-700 transition-colors">{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 3 && (
            <div>
              {(!topic.videos || topic.videos.length === 0) ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                  <p className="text-3xl mb-3">🎥</p>
                  <p className="font-bold text-slate-700">No hay videos para este tema</p>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-3">
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe src={'https://www.youtube.com/embed/' + topic.videos[0].id} title={topic.videos[0].title}
                        frameBorder="0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-slate-900 text-sm">{topic.videos[0].title}</p>
                      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs text-amber-700">💡 Después del video, ve a Práctica para reforzar lo aprendido.</p>
                      </div>
                    </div>
                  </div>
                  {topic.videos.length > 1 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Más videos</p>
                      <div className="flex flex-col gap-2">
                        {topic.videos.slice(1).map((v) => (
                          <a key={v.id} href={'https://www.youtube.com/watch?v=' + v.id} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-red-50 transition-colors group">
                            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#dc2626"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-tight">{v.title}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <button onClick={() => setTab(0)} className="w-full bg-white border border-slate-100 text-slate-700 font-bold py-3 rounded-2xl text-sm shadow-sm press">
                📖 Volver a la explicación
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function getStaticPaths() {
  return {
    paths: [
    { params: { id: 'udg', topicId: 'algebra' } },    { params: { id: 'udg', topicId: 'geometria' } },    { params: { id: 'udg', topicId: 'estadistica' } },    { params: { id: 'udg', topicId: 'porcentajes' } },    { params: { id: 'udg', topicId: 'lectura' } },    { params: { id: 'udg', topicId: 'redaccion' } },    { params: { id: 'udg', topicId: 'razonamiento' } },    { params: { id: 'udg', topicId: 'comprension-exani' } },    { params: { id: 'udg', topicId: 'redaccion-exani' } },    { params: { id: 'udg', topicId: 'matematico-exani' } },    { params: { id: 'udg', topicId: 'cientifico-exani' } },    { params: { id: 'udg', topicId: 'materia' } },    { params: { id: 'udg', topicId: 'tabla-periodica' } },    { params: { id: 'udg', topicId: 'energia-fuerzas' } },    { params: { id: 'udg', topicId: 'medio-ambiente' } },    { params: { id: 'udg', topicId: 'autocuidado' } },    { params: { id: 'udg', topicId: 'algebra-cecyte' } },    { params: { id: 'udg', topicId: 'estadistica-cecyte' } },    { params: { id: 'udg', topicId: 'geometria-cecyte' } },    { params: { id: 'udg', topicId: 'derechos-sociedad' } },    { params: { id: 'udg', topicId: 'historia-mexico' } },    { params: { id: 'udg', topicId: 'lenguaje-fuentes' } },    { params: { id: 'udg', topicId: 'redaccion-cecyte' } },    { params: { id: 'cecytej', topicId: 'algebra' } },    { params: { id: 'cecytej', topicId: 'geometria' } },    { params: { id: 'cecytej', topicId: 'estadistica' } },    { params: { id: 'cecytej', topicId: 'porcentajes' } },    { params: { id: 'cecytej', topicId: 'lectura' } },    { params: { id: 'cecytej', topicId: 'redaccion' } },    { params: { id: 'cecytej', topicId: 'razonamiento' } },    { params: { id: 'cecytej', topicId: 'comprension-exani' } },    { params: { id: 'cecytej', topicId: 'redaccion-exani' } },    { params: { id: 'cecytej', topicId: 'matematico-exani' } },    { params: { id: 'cecytej', topicId: 'cientifico-exani' } },    { params: { id: 'cecytej', topicId: 'materia' } },    { params: { id: 'cecytej', topicId: 'tabla-periodica' } },    { params: { id: 'cecytej', topicId: 'energia-fuerzas' } },    { params: { id: 'cecytej', topicId: 'medio-ambiente' } },    { params: { id: 'cecytej', topicId: 'autocuidado' } },    { params: { id: 'cecytej', topicId: 'algebra-cecyte' } },    { params: { id: 'cecytej', topicId: 'estadistica-cecyte' } },    { params: { id: 'cecytej', topicId: 'geometria-cecyte' } },    { params: { id: 'cecytej', topicId: 'derechos-sociedad' } },    { params: { id: 'cecytej', topicId: 'historia-mexico' } },    { params: { id: 'cecytej', topicId: 'lenguaje-fuentes' } },    { params: { id: 'cecytej', topicId: 'redaccion-cecyte' } },    { params: { id: 'cobaej', topicId: 'algebra' } },    { params: { id: 'cobaej', topicId: 'geometria' } },    { params: { id: 'cobaej', topicId: 'estadistica' } },    { params: { id: 'cobaej', topicId: 'porcentajes' } },    { params: { id: 'cobaej', topicId: 'lectura' } },    { params: { id: 'cobaej', topicId: 'redaccion' } },    { params: { id: 'cobaej', topicId: 'razonamiento' } },    { params: { id: 'cobaej', topicId: 'comprension-exani' } },    { params: { id: 'cobaej', topicId: 'redaccion-exani' } },    { params: { id: 'cobaej', topicId: 'matematico-exani' } },    { params: { id: 'cobaej', topicId: 'cientifico-exani' } },    { params: { id: 'cobaej', topicId: 'materia' } },    { params: { id: 'cobaej', topicId: 'tabla-periodica' } },    { params: { id: 'cobaej', topicId: 'energia-fuerzas' } },    { params: { id: 'cobaej', topicId: 'medio-ambiente' } },    { params: { id: 'cobaej', topicId: 'autocuidado' } },    { params: { id: 'cobaej', topicId: 'algebra-cecyte' } },    { params: { id: 'cobaej', topicId: 'estadistica-cecyte' } },    { params: { id: 'cobaej', topicId: 'geometria-cecyte' } },    { params: { id: 'cobaej', topicId: 'derechos-sociedad' } },    { params: { id: 'cobaej', topicId: 'historia-mexico' } },    { params: { id: 'cobaej', topicId: 'lenguaje-fuentes' } },    { params: { id: 'cobaej', topicId: 'redaccion-cecyte' } },    { params: { id: 'cecyte-emsad', topicId: 'algebra' } },    { params: { id: 'cecyte-emsad', topicId: 'geometria' } },    { params: { id: 'cecyte-emsad', topicId: 'estadistica' } },    { params: { id: 'cecyte-emsad', topicId: 'porcentajes' } },    { params: { id: 'cecyte-emsad', topicId: 'lectura' } },    { params: { id: 'cecyte-emsad', topicId: 'redaccion' } },    { params: { id: 'cecyte-emsad', topicId: 'razonamiento' } },    { params: { id: 'cecyte-emsad', topicId: 'comprension-exani' } },    { params: { id: 'cecyte-emsad', topicId: 'redaccion-exani' } },    { params: { id: 'cecyte-emsad', topicId: 'matematico-exani' } },    { params: { id: 'cecyte-emsad', topicId: 'cientifico-exani' } },    { params: { id: 'cecyte-emsad', topicId: 'materia' } },    { params: { id: 'cecyte-emsad', topicId: 'tabla-periodica' } },    { params: { id: 'cecyte-emsad', topicId: 'energia-fuerzas' } },    { params: { id: 'cecyte-emsad', topicId: 'medio-ambiente' } },    { params: { id: 'cecyte-emsad', topicId: 'autocuidado' } },    { params: { id: 'cecyte-emsad', topicId: 'algebra-cecyte' } },    { params: { id: 'cecyte-emsad', topicId: 'estadistica-cecyte' } },    { params: { id: 'cecyte-emsad', topicId: 'geometria-cecyte' } },    { params: { id: 'cecyte-emsad', topicId: 'derechos-sociedad' } },    { params: { id: 'cecyte-emsad', topicId: 'historia-mexico' } },    { params: { id: 'cecyte-emsad', topicId: 'lenguaje-fuentes' } },    { params: { id: 'cecyte-emsad', topicId: 'redaccion-cecyte' } },    { params: { id: 'ceti', topicId: 'algebra' } },    { params: { id: 'ceti', topicId: 'geometria' } },    { params: { id: 'ceti', topicId: 'estadistica' } },    { params: { id: 'ceti', topicId: 'porcentajes' } },    { params: { id: 'ceti', topicId: 'lectura' } },    { params: { id: 'ceti', topicId: 'redaccion' } },    { params: { id: 'ceti', topicId: 'razonamiento' } },    { params: { id: 'ceti', topicId: 'comprension-exani' } },    { params: { id: 'ceti', topicId: 'redaccion-exani' } },    { params: { id: 'ceti', topicId: 'matematico-exani' } },    { params: { id: 'ceti', topicId: 'cientifico-exani' } },    { params: { id: 'ceti', topicId: 'materia' } },    { params: { id: 'ceti', topicId: 'tabla-periodica' } },    { params: { id: 'ceti', topicId: 'energia-fuerzas' } },    { params: { id: 'ceti', topicId: 'medio-ambiente' } },    { params: { id: 'ceti', topicId: 'autocuidado' } },    { params: { id: 'ceti', topicId: 'algebra-cecyte' } },    { params: { id: 'ceti', topicId: 'estadistica-cecyte' } },    { params: { id: 'ceti', topicId: 'geometria-cecyte' } },    { params: { id: 'ceti', topicId: 'derechos-sociedad' } },    { params: { id: 'ceti', topicId: 'historia-mexico' } },    { params: { id: 'ceti', topicId: 'lenguaje-fuentes' } },    { params: { id: 'ceti', topicId: 'redaccion-cecyte' } },    { params: { id: 'tecmilenio', topicId: 'algebra' } },    { params: { id: 'tecmilenio', topicId: 'geometria' } },    { params: { id: 'tecmilenio', topicId: 'estadistica' } },    { params: { id: 'tecmilenio', topicId: 'porcentajes' } },    { params: { id: 'tecmilenio', topicId: 'lectura' } },    { params: { id: 'tecmilenio', topicId: 'redaccion' } },    { params: { id: 'tecmilenio', topicId: 'razonamiento' } },    { params: { id: 'tecmilenio', topicId: 'comprension-exani' } },    { params: { id: 'tecmilenio', topicId: 'redaccion-exani' } },    { params: { id: 'tecmilenio', topicId: 'matematico-exani' } },    { params: { id: 'tecmilenio', topicId: 'cientifico-exani' } },    { params: { id: 'tecmilenio', topicId: 'materia' } },    { params: { id: 'tecmilenio', topicId: 'tabla-periodica' } },    { params: { id: 'tecmilenio', topicId: 'energia-fuerzas' } },    { params: { id: 'tecmilenio', topicId: 'medio-ambiente' } },    { params: { id: 'tecmilenio', topicId: 'autocuidado' } },    { params: { id: 'tecmilenio', topicId: 'algebra-cecyte' } },    { params: { id: 'tecmilenio', topicId: 'estadistica-cecyte' } },    { params: { id: 'tecmilenio', topicId: 'geometria-cecyte' } },    { params: { id: 'tecmilenio', topicId: 'derechos-sociedad' } },    { params: { id: 'tecmilenio', topicId: 'historia-mexico' } },    { params: { id: 'tecmilenio', topicId: 'lenguaje-fuentes' } },    { params: { id: 'tecmilenio', topicId: 'redaccion-cecyte' } },
    ],
    fallback: false
  }
}
export function getStaticProps({ params }) {
  return { props: { id: params.id, topicId: params.topicId } }
}
