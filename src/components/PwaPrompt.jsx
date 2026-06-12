import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function PwaPrompt() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    if (!ios) {
      const handler = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setTimeout(() => setShow(true), 2500)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    } else {
      setTimeout(() => setShow(true), 2500)
    }
  }, [])

  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-slate-900/50 z-50 print:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-5 pt-4 pb-10 max-w-md mx-auto shadow-2xl print:hidden"
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Salvar na tela inicial</h3>
                <p className="text-xs text-slate-500">Acesse como app nativo, sem abrir o browser</p>
              </div>
            </div>

            {isIOS ? (
              <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">No Safari:</p>
                {[
                  { n: '1', text: <>Toque no ícone <strong>Compartilhar</strong> (□↑) na barra inferior</> },
                  { n: '2', text: <>Selecione <strong>"Adicionar à Tela de Início"</strong></> },
                  { n: '3', text: <>Toque em <strong>Adicionar</strong> — pronto!</> },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{n}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                Instale o app para acessar o cronograma <strong>a qualquer hora</strong>, sem precisar abrir o navegador.
              </p>
            )}

            {!isIOS && (
              <button
                onClick={install}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 cursor-pointer mb-3"
              >
                Adicionar à Tela Inicial
              </button>
            )}

            <button
              onClick={() => setShow(false)}
              className="w-full text-slate-400 text-sm py-2 cursor-pointer hover:text-slate-600 transition-colors"
            >
              Agora não
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
