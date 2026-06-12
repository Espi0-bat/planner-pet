import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { generateSchedule } from '../utils/generateSchedule'
import DashboardPreview from './DashboardPreview'

const PAIN_LABELS = {
  choro: 'choro noturno',
  xixi: 'acidentes no lugar errado',
  morde: 'comportamento destrutivo',
  agitado: 'agitação excessiva',
}

const PIX_CODE = '00020126580014BR.GOV.BCB.PIX0136exemplo-chave-pix-aqui5204000053039865802BR5925Planner Pet6009SAO PAULO62070503***6304ABCD'

export default function Paywall({ userData, onPay }) {
  const [showPix, setShowPix] = useState(false)
  const [copied, setCopied] = useState(false)

  const { stats } = generateSchedule(
    userData?.wakeTime || '07:00',
    userData?.sleepTime || '22:00',
    userData?.age || '8-10'
  )

  const painLabel = PAIN_LABELS[userData?.pain] || 'comportamento difícil'

  function copyPix() {
    navigator.clipboard.writeText(PIX_CODE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    // Simula aprovamento após 2s para demo
    setTimeout(onPay, 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Dashboard borrado ao fundo */}
      <div className="blur-md pointer-events-none select-none opacity-60">
        <DashboardPreview userData={userData} stats={stats} />
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-end justify-center pb-6 px-4">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
        >
          {/* Badge diagnóstico */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              Diagnóstico Concluído
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
            {userData?.name || 'Seu filhote'} precisa de exatas{' '}
            <span className="text-orange-600">{stats.totalSleepHours}h de sono</span> fragmentado para
            parar com o {painLabel}.
          </h2>

          <p className="text-slate-500 text-sm mb-5">
            Seu cronograma biológico completo está pronto e personalizado para a rotina de{' '}
            {userData?.name || 'seu filhote'}.
          </p>

          {/* Preço */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-slate-300 line-through text-base">R$ 19,90</span>
            <span className="text-3xl font-bold text-slate-900">R$ 14,90</span>
            <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
              Oferta relâmpago
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!showPix ? (
              <motion.button
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPix(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all duration-200 cursor-pointer text-lg shadow-lg shadow-orange-100"
              >
                Liberar Cronograma (PIX)
              </motion.button>
            ) : (
              <motion.div
                key="pix"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs text-slate-500 font-medium">PIX Copia e Cola:</p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 font-mono break-all">
                  {PIX_CODE.slice(0, 60)}...
                </div>
                <button
                  onClick={copyPix}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 cursor-pointer"
                >
                  {copied ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Código copiado! Liberando acesso...
                    </span>
                  ) : 'Copiar código PIX'}
                </button>
                {/* Webhook placeholder */}
                {/* TODO: substituir onPay() pelo callback do webhook do gateway */}
                <button
                  onClick={onPay}
                  className="w-full border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold py-3 rounded-2xl transition-all duration-200 cursor-pointer text-sm"
                >
                  Já paguei → Liberar acesso
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-400 mt-4">
            Pagamento seguro · Acesso imediato após confirmação
          </p>
        </motion.div>
      </div>
    </div>
  )
}
