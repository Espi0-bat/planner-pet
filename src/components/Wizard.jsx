import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const STEPS = [
  { id: 1, question: 'Qual é o nome do seu filhote?', type: 'text' },
  { id: 2, question: (name) => `Qual a idade de ${name || 'ele'}?`, type: 'age' },
  { id: 3, question: 'Que horas você acorda e dorme?', type: 'time' },
  { id: 4, question: (name) => `Qual é o maior pesadelo com ${name || 'ele'} hoje?`, type: 'pain' },
]

const AGE_OPTIONS = [
  { value: '8-10', label: '8–10 semanas' },
  { value: '11-14', label: '11–14 semanas' },
  { value: '15-20', label: '15–20 semanas' },
]

const PAIN_OPTIONS = [
  { value: 'choro', label: 'Choro noturno' },
  { value: 'xixi', label: 'Xixi no lugar errado' },
  { value: 'morde', label: 'Morde tudo' },
  { value: 'agitado', label: 'Não para quieto' },
]

export default function Wizard({ onComplete }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState({
    name: '',
    age: '',
    wakeTime: '07:00',
    sleepTime: '22:00',
    pain: '',
  })

  function next(update = {}) {
    const newData = { ...data, ...update }
    setData(newData)
    if (step < STEPS.length - 1) {
      setDirection(1)
      setStep(s => s + 1)
    } else {
      onComplete(newData)
    }
  }

  function back() {
    setDirection(-1)
    setStep(s => s - 1)
  }

  const progress = ((step + 1) / STEPS.length) * 100
  const current = STEPS[step]
  const question = typeof current.question === 'function' ? current.question(data.name) : current.question

  const variants = {
    enter: { x: direction * 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: direction * -40, opacity: 0 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 max-w-md mx-auto px-5 pt-10 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {step > 0 && (
          <button onClick={back} className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Voltar">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex flex-col flex-1"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">{question}</h2>

          {/* Step 1: Name */}
          {current.type === 'text' && (
            <div className="flex flex-col gap-4">
              <input
                autoFocus
                type="text"
                placeholder="Ex: Thor, Luna, Bolinha..."
                value={data.name}
                onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && data.name.trim() && next()}
                className="w-full text-xl border-0 border-b-2 border-slate-200 focus:border-orange-500 bg-transparent py-3 outline-none text-slate-900 placeholder:text-slate-300 transition-colors"
              />
              <div className="flex-1" />
              <button
                onClick={() => data.name.trim() && next()}
                disabled={!data.name.trim()}
                className="w-full bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 hover:bg-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 cursor-pointer mt-8"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 2: Age */}
          {current.type === 'age' && (
            <div className="flex flex-col gap-3">
              {AGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => next({ age: opt.value })}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer font-medium text-slate-800"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Time */}
          {current.type === 'time' && (
            <div className="flex flex-col gap-6">
              {[
                { label: 'Você acorda às', key: 'wakeTime', value: data.wakeTime },
                { label: 'Você vai dormir às', key: 'sleepTime', value: data.sleepTime },
              ].map(({ label, key, value }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-500">{label}</label>
                  <input
                    type="time"
                    value={value}
                    onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
                    className="w-full text-3xl font-bold text-slate-900 border-0 border-b-2 border-slate-200 focus:border-orange-500 bg-transparent py-2 outline-none transition-colors"
                  />
                </div>
              ))}
              <div className="flex-1" />
              <button
                onClick={() => next()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 cursor-pointer mt-4"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 4: Pain */}
          {current.type === 'pain' && (
            <div className="flex flex-col gap-3">
              {PAIN_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => next({ pain: opt.value })}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer font-medium text-slate-800"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
