import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import { getSchool } from '../../../data/schools'
import { getQuestions } from '../../../data/questions'

function fmt(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

export default function SimuladorPage() {
  const { query } = useRouter()
  const school = query.id ? getSchool(query.id) : null
  const questions = school ? getQuestions(school.exam) : []

  const [phase, setPhase]     = useState('intro') // intro | exam | result
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600)
  const timer = useRef(null)

  // Clean up timer on unmount
  useEffect(() => { return () => clearInterval(timer.current) }, [])

  if (!school) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>

  const q = questions[current]
  const prog = Math.round((current / questions.length) * 100)
  const score = questions.filter((_, i) => answers[i] === questions[i].correct).length
  const pct   = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const passed = pct >= 70

  function startExam() {
    setCurrent(0); setAnswers({}); setSelected(null); setFeedback(false); setTimeLeft(600)
    setPhase('exam')
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer.current); setPhase('result'); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function pickOption(i) {
    if (feedback) return
    setSelected(i)
    setFeedback(true)
    setAnswers((p) => ({ ...p, [current]: i }))
  }

  function next() {
    setFeedback(false); setSelected(null)
    if (current + 1 >= questions.length) { clearInterval(timer.current); setPhase('result') }
    else setCurrent((n) => n + 1)
  }

  // INTRO
  if (phase === 'intro') return (
    <>
      <Head><title>Simulacro – MetaPrepa</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header backHref={'/escuela/' + query.id} />
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <p className="text-6xl mb-4">🧪</p>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Simulacro {school.exam}</h1>
            <p className="text-slate-400 text-sm">Pon a prueba todo lo que has aprendido</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[['❓', questions.length, 'Preguntas'], ['⏱️', '10 min', 'Tiempo'], ['📊', '3-4', 'Opciones'], ['🎯', '70%', 'Para pasar']].map(([ic, v, l]) => (
              <div key={l} className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
                <p className="text-2xl mb-1">{ic}</p>
                <p className="font-black text-slate-900 text-xl">{v}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="font-bold text-amber-900 text-sm mb-2">📋 Instrucciones</p>
            <p className="text-xs text-amber-800 leading-relaxed">Lee cada pregunta con atención. Recibirás retroalimentación inmediata después de cada respuesta. El tiempo corre al iniciar.</p>
          </div>
          <button onClick={startExam} className="w-full py-4 rounded-2xl text-white font-bold text-base press" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 4px 14px rgba(59,130,246,.3)' }}>
            🚀 Comenzar simulacro
          </button>
        </main>
      </div>
    </>
  )

  // RESULT
  if (phase === 'result') return (
    <>
      <Head><title>Resultado – MetaPrepa</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header backHref={'/escuela/' + query.id} />
        <main className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center mb-5 anim-bounce">
            <p className="text-6xl mb-3">{passed ? '🏆' : '💪'}</p>
            <h1 className="text-2xl font-black text-slate-900 mb-1">{passed ? '¡Excelente!' : '¡Sigue practicando!'}</h1>
            <p className="text-sm text-slate-400">{passed ? 'Tu preparación está dando frutos.' : 'Cada intento te acerca más a tu meta.'}</p>
          </div>

          <div className="rounded-3xl p-6 text-white shadow-xl mb-5" style={{ background: passed ? 'linear-gradient(135deg,#22c55e,#15803d)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
            <p className="text-6xl font-black text-center">{pct}%</p>
            <p className="text-center font-semibold mt-1 mb-4" style={{ color: 'rgba(255,255,255,.85)' }}>{score} de {questions.length} correctas</p>
            <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,.2)' }}>
              <div className="h-full bg-white rounded-full" style={{ width: pct + '%', transition: 'width 1s' }} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
            <p className="font-bold text-slate-900 text-sm mb-3">Detalle por pregunta</p>
            <div className="space-y-2">
              {questions.map((q, i) => {
                const ok = answers[i] === q.correct
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${ok ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white ${ok ? 'bg-green-500' : 'bg-red-500'}`}>{ok ? '✓' : '✗'}</div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{q.question.substring(0, 65)}...</p>
                      {!ok && <p className="text-xs text-slate-500 mt-0.5">Correcta: {q.options[q.correct]}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startExam} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl text-sm press">🔄 Repetir</button>
            <Link href={'/escuela/' + query.id + '/temas'} className="flex-1">
              <button className="w-full py-3.5 rounded-2xl text-white font-bold text-sm press" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>📚 Estudiar temas</button>
            </Link>
          </div>
        </main>
      </div>
    </>
  )

  // EXAM
  return (
    <>
      <Head><title>Simulacro en curso – MetaPrepa</title></Head>
      <div className="min-h-screen bg-slate-50">
        <Header progress={prog} />
        <main className="max-w-lg mx-auto px-4 pb-6">
          <div className="flex items-center justify-between pt-4 mb-3">
            <span className="text-xs font-bold text-slate-400">Pregunta {current + 1} de {questions.length}</span>
            <span className={`px-3 py-1.5 rounded-xl font-mono font-black text-sm ${timeLeft <= 60 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-900'}`}
              style={timeLeft <= 60 ? { animation: 'pulse 1s infinite' } : {}}>
              ⏱️ {fmt(timeLeft)}
            </span>
          </div>

          <span className="inline-block mb-3 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-xl">{q.subject}</span>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
            <p className="font-bold text-slate-900 text-base leading-relaxed">{q.question}</p>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let cls = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              let letterCls = 'bg-slate-100 text-slate-500'
              if (feedback) {
                if (i === q.correct)            { cls = 'bg-green-50 border-2 border-green-400 text-green-800'; letterCls = 'bg-green-500 text-white' }
                else if (i === selected)        { cls = 'bg-red-50 border-2 border-red-400 text-red-800';   letterCls = 'bg-red-500 text-white' }
                else                            { cls = 'bg-white border-2 border-slate-100 text-slate-300 opacity-50' }
              }
              return (
                <button key={i} onClick={() => pickOption(i)} className={`w-full text-left p-4 rounded-2xl font-semibold text-sm transition-all press flex items-center gap-3 ${cls}`}>
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${letterCls}`}>
                    {['A','B','C','D'][i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {feedback && (
            <div className={`mt-4 p-4 rounded-2xl border anim-scale ${selected === q.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-bold text-sm mb-1 flex items-center gap-2 ${selected === q.correct ? 'text-green-800' : 'text-red-800'}`}>
                {selected === q.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{q.explanation}</p>
              <button onClick={next} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm press">
                {current + 1 < questions.length ? 'Siguiente pregunta →' : 'Ver resultados 🏆'}
              </button>
            </div>
          )}
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
