import { motion } from 'motion/react'

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 max-w-md mx-auto relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-20%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-20%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '2000ms' }}></div>
      <div className="absolute bottom-[-10%] left-[10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: '4000ms' }}></div>

      {/* Hero Image Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative h-[45vh] w-full pt-8 px-6 flex flex-col justify-start"
      >
        {/* We use an image tag here */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden shadow-sm">
           <img
              src="/puppy-hero.png"
              alt="Cachorrinho fofo que fez bagunça"
              fetchpriority="high"
              loading="eager"
              className="w-full h-full object-cover object-center"
           />
           {/* Dark gradient overlay so the text looks readable */}
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/40"></div>
        </div>
        
        {/* Badge over image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 self-center mt-4"
        >
          <span className="text-xs font-bold tracking-widest text-white uppercase bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full shadow-lg">
            Método Científico Canino
          </span>
        </motion.div>
      </motion.div>

      {/* Content Section - Overlapping the image slightly */}
      <div className="flex-1 px-6 pb-8 flex flex-col relative z-10 -mt-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white flex flex-col flex-1"
        >
          {/* Headline */}
          <h1 className="text-[2.1rem] font-extrabold leading-[1.15] tracking-tight text-slate-900 mb-4">
            O relógio do seu filhote está <span className="text-orange-600">desregulado.</span>
          </h1>

          <p className="text-slate-600 text-[1.05rem] leading-relaxed mb-6 font-medium">
            Descubra a rotina perfeita para parar o choro
            noturno e os acidentes pela casa — <span className="font-bold text-slate-800">em apenas 3 dias.</span>
          </p>

          {/* Stats row */}
          <div className="flex justify-between gap-2 mb-auto bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
            {[
              { value: '3 dias', label: 'Resultado' },
              { value: '2 min', label: 'Setup' },
              { value: '100%', label: 'Pessoal' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <span className="text-xl font-black text-slate-800">{value}</span>
                <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</span>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="h-6"></div>

          {/* Social Proof */}
          <div className="flex flex-col items-center mb-4 mt-2">
            <div className="flex gap-1 mb-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400 fill-orange-400" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
            <p className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-wide">
              Aprovado por +10.000 pais de pet
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-200 cursor-pointer shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            Analisar Rotina do Filhote
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
