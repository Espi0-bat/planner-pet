// Versão simplificada do Dashboard — usada apenas como preview borrado no Paywall
export default function DashboardPreview({ userData, stats }) {
  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-4 pb-24 max-w-md mx-auto">
      {/* Header Premium com Imagem Borrada */}
      <div className="relative pt-8 pb-6 px-4 rounded-[2rem] overflow-hidden shadow-sm mb-6 mt-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="/puppy-success.png" 
            alt="Filhote" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/80"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center mt-2">
          <p className="text-white/90 text-[10px] font-bold tracking-widest uppercase mb-1 bg-black/30 px-3 py-1 rounded-full border border-white/20">
            Modo de Sobrevivência
          </p>
          <h1 className="text-white text-lg font-bold leading-tight mb-4">
            Rotina de {userData?.name || 'seu filhote'}
          </h1>

          <div className="flex gap-2 w-full">
            {[
              { v: `${stats?.totalSleepHours}h`, l: 'sono' },
              { v: `${stats?.totalAwakeHours}h`, l: 'ativo' },
              { v: `${stats?.ownerFreeHours}h`, l: 'paz' },
            ].map(({ v, l }) => (
              <div key={l} className="flex-1 bg-white/20 border border-white/30 rounded-xl p-2 text-center">
                <div className="text-white text-sm font-bold">{v}</div>
                <div className="text-white/80 text-[10px] uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`rounded-2xl p-4 mb-3 ${i % 3 === 0 ? 'bg-slate-800 text-white' : 'bg-white border border-slate-100'}`}>
          <div className="h-3 w-24 rounded bg-current opacity-20 mb-2" />
          <div className="h-2 w-40 rounded bg-current opacity-10" />
        </div>
      ))}
    </div>
  )
}
