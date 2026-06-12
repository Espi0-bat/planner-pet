import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const MESSAGES = [
  'Cruzando idade com ciclo circadiano canino...',
  'Calculando janelas de sono do filhote...',
  'Ajustando blocos de atividade e banheiro...',
  'Gerando rotina personalizada...',
  'Diagnóstico pronto.',
]

export default function LoadingScreen({ userData, onDone }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 3200
    const interval = totalDuration / MESSAGES.length

    const msgTimer = setInterval(() => {
      setMsgIndex(i => {
        if (i >= MESSAGES.length - 1) {
          clearInterval(msgTimer)
          return i
        }
        return i + 1
      })
    }, interval)

    // Smooth progress bar
    const startTime = Date.now()
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(progressTimer)
    }, 30)

    const done = setTimeout(onDone, totalDuration + 400)

    return () => {
      clearInterval(msgTimer)
      clearInterval(progressTimer)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-6">
      {/* Spinner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-orange-500 animate-spin" />
      </motion.div>

      {/* Name */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 text-sm font-medium mb-3 tracking-wide"
      >
        Analisando {userData?.name || 'o filhote'}
      </motion.p>

      {/* Animated message */}
      <div className="h-10 flex items-center mb-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-white text-base font-medium text-center max-w-xs"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange-500 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.03 }}
        />
      </div>
    </div>
  )
}
