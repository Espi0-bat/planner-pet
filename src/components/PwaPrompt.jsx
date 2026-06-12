import { useState, useEffect } from 'react'

export default function PwaPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); setVisible(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 max-w-md mx-auto flex items-center gap-3">
      <div className="flex-1">
        <p className="font-semibold text-slate-900 text-sm">Adicionar à tela inicial</p>
        <p className="text-slate-500 text-xs">Acesse a rotina direto do celular</p>
      </div>
      <button
        onClick={() => { prompt?.prompt(); setVisible(false) }}
        className="bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer"
      >
        Instalar
      </button>
      <button onClick={() => setVisible(false)} className="text-slate-400 cursor-pointer text-lg leading-none">×</button>
    </div>
  )
}
