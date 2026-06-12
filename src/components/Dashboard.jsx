import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { generateSchedule } from '../utils/generateSchedule'
import PwaPrompt from './PwaPrompt'
import { getMagicLink } from '../utils/token'
import { asset } from '../utils/asset'

const ICON_MAP = {
  drop: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-7 8-7 13a7 7 0 0014 0c0-5-7-13-7-13z" />
    </svg>
  ),
  food: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  play: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 8l6 4-6 4V8z" />
    </svg>
  ),
  calm: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  train: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const PANIC_LABELS = [
  'Xixi Detectado!',
  'Mordida Forte!',
  'Choro na Caixa!',
]

const PANIC_TIPS = [
  {
    label: 'Xixi errado',
    title: 'Xixi no lugar errado',
    tip: 'Limpe com enzimático. Não dê bronca esfregando o focinho. Ignore o cão por 5 minutos.',
  },
  {
    label: 'Mordendo',
    title: 'Mordendo muito forte',
    tip: 'Faça um som agudo ("Ai!"), vire de costas e encerre a brincadeira imediatamente.',
  },
  {
    label: 'Chorando',
    title: 'Chorando na caixa',
    tip: 'Se ele já fez xixi, não faça contato visual. Coloque ruído branco (ventilador) e espere.',
  },
]

export default function Dashboard({ userData, token }) {
  const prefersReducedMotion = useReducedMotion()
  const [checkedTasks, setCheckedTasks] = useState({})
  const [panicOpen, setPanicOpen] = useState(false)
  const [panicTab, setPanicTab] = useState(0)
  const [isDaytime, setIsDaytime] = useState(true)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    // Considera dia entre 06:00 e 18:59
    setIsDaytime(hour >= 6 && hour < 19)
  }, [])

  const { blocks, stats } = generateSchedule(
    userData?.wakeTime || '07:00',
    userData?.sleepTime || '22:00',
    userData?.age || '8-10'
  )

  function shareMagicLink() {
    const url = getMagicLink(token)
    if (navigator.share) {
      navigator.share({
        title: `Rotina de ${userData?.name || 'seu filhote'}`,
        text: 'Acesse o cronograma biológico do seu filhote aqui:',
        url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).catch(() => {})
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    }
  }

  function sendWhatsApp() {
    const name = userData?.name || 'seu filhote'
    const tip = PANIC_TIPS[panicTab]
    const magicLink = token ? `\n\n📱 Rotina completa: ${getMagicLink(token)}` : ''
    const msg = `🐶 *Alerta: ${name} — ${tip.title}*\n\n${tip.tip}${magicLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  function handlePrint() {
    const prev = document.title
    document.title = `Rotina de ${userData?.name || 'seu filhote'} — Planner Pet`
    window.print()
    document.title = prev
  }

  function toggleTask(blockIdx, taskIdx) {
    const key = `${blockIdx}-${taskIdx}`
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Lógica de mídia dinâmica (imagem ou vídeo)
  let currentMedia = {
    type: 'image',
    src: isDaytime ? asset('/puppy-daytime.png') : asset('/puppy-success.png'),
  }
  let overlayClass = 'from-slate-900/60 via-slate-900/30 to-slate-900/80'

  if (panicOpen) {
    if (panicTab === 0) currentMedia = { type: 'image', src: asset('/puppy-panic-pee.png') }
    if (panicTab === 1) currentMedia = { type: 'video', src: asset('/puppy-panic-bite.mp4') }
    if (panicTab === 2) currentMedia = { type: 'image', src: asset('/puppy-panic-cry.png') }
    overlayClass = 'from-red-900/80 via-slate-900/50 to-slate-900/95'
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28 max-w-md mx-auto">

      {/* Cabeçalho exclusivo para impressão */}
      <div className="hidden print:block px-5 pt-8 pb-5 border-b border-slate-200 mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Rotina de {userData?.name || 'seu filhote'}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {stats.ageLabel} · {stats.totalSleepHours}h de sono · {stats.ownerFreeHours}h de paz para você
        </p>
        <p className="text-slate-400 text-xs mt-0.5">Planner de Sobrevivência do Filhote</p>
      </div>

      {/* Header Premium com Imagem Dinâmica */}
      <motion.div
        initial={{ opacity: 0, y: -10, height: '44vh' }}
        animate={{ opacity: 1, y: 0, height: panicOpen ? '62vh' : '44vh' }}
        transition={{ type: 'spring', damping: 28, stiffness: 200 }}
        className="relative rounded-b-[2.5rem] overflow-hidden shadow-lg print:hidden"
      >
        {/* Background: imagem ou vídeo com crossfade */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <AnimatePresence mode="wait">
            {currentMedia.type === 'video' ? (
              <motion.video
                key={currentMedia.src}
                src={currentMedia.src}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <motion.img
                key={currentMedia.src}
                src={currentMedia.src}
                alt="Cenário do Filhote"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: 1,
                  scale: panicOpen && !prefersReducedMotion
                    ? [1, 1.06, 1.02, 1.05, 1]
                    : 1,
                }}
                exit={{ opacity: 0 }}
                transition={
                  panicOpen && !prefersReducedMotion
                    ? {
                        opacity: { duration: 0.4 },
                        scale: {
                          repeat: Infinity,
                          duration: 3.5,
                          ease: 'easeInOut',
                          times: [0, 0.3, 0.5, 0.7, 1],
                        },
                      }
                    : { duration: 0.4 }
                }
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
          </AnimatePresence>
          <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-500 ${overlayClass}`} />
        </div>

        {/* Label de alerta do pânico */}
        <AnimatePresence>
          {panicOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ type: 'spring', damping: 18, stiffness: 320 }}
              className="absolute top-10 inset-x-0 z-20 flex justify-center"
            >
              <div className="bg-red-500 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-red-600/50 flex items-center gap-2 border border-red-400/30">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {PANIC_LABELS[panicTab]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo fixado no rodapé do header */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center px-5 pb-6">
          <AnimatePresence mode="wait">
            {panicOpen ? (
              <motion.p
                key="panic-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-red-300 text-xs font-bold tracking-widest uppercase mb-2 bg-red-900/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-red-400/20"
              >
                Modo Pânico Ativado
              </motion.p>
            ) : (
              <motion.p
                key="normal-badge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white/90 text-xs font-bold tracking-widest uppercase mb-2 bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20"
              >
                Modo de Sobrevivência
              </motion.p>
            )}
          </AnimatePresence>

          <h1 className="text-white text-[1.7rem] font-extrabold leading-tight mb-4 drop-shadow-lg">
            A nova rotina de <span className="text-orange-400">{userData?.name || 'seu filhote'}</span>.
          </h1>

          {/* Stats somem no pânico para dar espaço à imagem */}
          <motion.div
            animate={{ opacity: panicOpen ? 0 : 1, height: panicOpen ? 0 : 'auto' }}
            transition={{ duration: 0.25 }}
            className="flex gap-3 w-full overflow-hidden"
          >
            {[
              { value: `${stats.totalSleepHours}h`, label: 'de sono hoje' },
              { value: `${stats.totalAwakeHours}h`, label: 'ativo' },
              { value: `${stats.ownerFreeHours}h`, label: 'de paz' },
            ].map(({ value, label }) => (
              <div key={label} className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 text-center shadow-xl">
                <div className="text-white text-xl font-black drop-shadow-md">{value}</div>
                <div className="text-white/80 text-[0.65rem] font-bold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="px-4 pt-5 flex flex-col gap-3">
        {blocks.map((block, blockIdx) => (
          <motion.div
            key={blockIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blockIdx * 0.06, duration: 0.35 }}
          >
            {block.type === 'sleep' ? (
              <div className="bg-slate-800 print:bg-slate-100 rounded-2xl px-5 py-4 print:border print:border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white print:text-slate-800 font-semibold text-sm">{block.label}</span>
                  <span className="text-slate-400 print:text-slate-500 text-xs font-mono">
                    {block.start} — {block.end}
                  </span>
                </div>
                <p className="text-slate-400 print:text-slate-500 text-xs">{block.sublabel}</p>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-900 font-semibold text-sm">Bloco de Atividade</span>
                  <span className="text-slate-400 text-xs font-mono">
                    {block.start} — {block.end}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {block.tasks.map((task, taskIdx) => {
                    const key = `${blockIdx}-${taskIdx}`
                    const checked = !!checkedTasks[key]
                    return (
                      <button
                        key={taskIdx}
                        onClick={() => toggleTask(blockIdx, taskIdx)}
                        className="flex items-center gap-3 text-left cursor-pointer group"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${checked ? 'bg-green-500 border-green-500' : 'border-slate-200 group-hover:border-orange-400'}`}>
                          {checked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 transition-opacity duration-200 ${checked ? 'opacity-40' : ''}`}>
                          <span className="text-slate-400">{ICON_MAP[task.icon]}</span>
                          <span className="text-slate-700 text-sm font-medium">{task.label}</span>
                          <span className="text-slate-400 text-xs font-mono">
                            {String(Math.floor(task.time / 60) % 24).padStart(2, '0')}:{String(task.time % 60).padStart(2, '0')}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-100 px-4 py-4 max-w-md mx-auto print:hidden">
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF Geladeira
          </button>
          <button
            onClick={() => { setPanicOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Modo Pânico
          </button>
        </div>
      </div>

      {/* Magic Link Card */}
      {token && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mx-4 mt-2 mb-6 bg-blue-950 rounded-2xl px-5 py-4 print:hidden"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <svg className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Link Mágico</span>
          </div>
          <p className="text-white/70 text-xs mb-3 leading-relaxed">
            Acesse o cronograma de <span className="text-white font-medium">{userData?.name || 'seu filhote'}</span> de qualquer dispositivo, a qualquer hora.
          </p>
          <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 mb-3">
            <p className="text-white/50 text-[10px] font-mono truncate">{getMagicLink(token)}</p>
          </div>
          <button
            onClick={shareMagicLink}
            className="w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm active:scale-[0.98]"
          >
            {linkCopied ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Link copiado!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Copiar / Compartilhar Link
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Panic Modal */}
      <div className="print:hidden">
      <AnimatePresence>
        {panicOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanicOpen(false)}
              className="fixed inset-0 bg-slate-900/50 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pt-5 pb-10 max-w-md mx-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Modo Pânico</h3>
                <button onClick={() => setPanicOpen(false)} className="p-2 rounded-full hover:bg-slate-100 cursor-pointer">
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 mb-5">
                {PANIC_TIPS.map((tip, i) => (
                  <button
                    key={i}
                    onClick={() => setPanicTab(i)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${panicTab === i ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {tip.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={panicTab}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="font-bold text-slate-900 mb-2">{PANIC_TIPS[panicTab].title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{PANIC_TIPS[panicTab].tip}</p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={sendWhatsApp}
                className="w-full mt-5 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5a] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer text-sm shadow-lg shadow-green-500/25"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Avisar no WhatsApp
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>

      <PwaPrompt />
    </div>
  )
}
