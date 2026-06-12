// Regras biológicas por faixa etária
const AGE_RULES = {
  '8-10': { awakeMinutes: 60, sleepMinutes: 120, label: '8–10 semanas' },
  '11-14': { awakeMinutes: 90, sleepMinutes: 120, label: '11–14 semanas' },
  '15-20': { awakeMinutes: 120, sleepMinutes: 120, label: '15–20 semanas' },
}

// Distribui as micro-tarefas dentro do bloco acordado
function buildActiveTasks(startMinutes, awakeMinutes, mealCount, maxMeals) {
  const tasks = []
  const base = startMinutes

  tasks.push({ time: base, label: 'Tapete higiênico', icon: 'drop', type: 'bathroom' })

  if (mealCount < maxMeals) {
    tasks.push({ time: base + 10, label: `Refeição ${mealCount + 1}`, icon: 'food', type: 'meal' })
    mealCount++
  } else {
    tasks.push({ time: base + 10, label: 'Treino rápido (5 min)', icon: 'train', type: 'train' })
  }

  tasks.push({ time: base + 25, label: 'Brincadeira ativa', icon: 'play', type: 'play' })
  tasks.push({ time: base + (awakeMinutes - 15), label: 'Desaceleração', icon: 'calm', type: 'calm' })
  tasks.push({ time: base + (awakeMinutes - 5), label: 'Tapete higiênico pré-soneca', icon: 'drop', type: 'bathroom' })

  return { tasks, mealCount }
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Gera a rotina completa do filhote.
 * @param {string} wakeTime   - "07:00"
 * @param {string} sleepTime  - "22:00"
 * @param {string} ageRange   - "8-10" | "11-14" | "15-20"
 * @returns {Array} blocos com type: 'active' | 'sleep'
 */
export function generateSchedule(wakeTime, sleepTime, ageRange) {
  const rules = AGE_RULES[ageRange] || AGE_RULES['8-10']
  const { awakeMinutes, sleepMinutes } = rules

  let current = timeToMinutes(wakeTime)
  const end = timeToMinutes(sleepTime)
  // Handle overnight: se sleepTime < wakeTime, adiciona 24h
  const endMinutes = end <= current ? end + 24 * 60 : end

  const blocks = []
  const maxMeals = 3
  let mealCount = 0

  while (current < endMinutes) {
    const activeEnd = current + awakeMinutes
    if (activeEnd > endMinutes) break

    const { tasks, mealCount: newMealCount } = buildActiveTasks(current, awakeMinutes, mealCount, maxMeals)
    mealCount = newMealCount

    blocks.push({
      type: 'active',
      start: minutesToTime(current),
      end: minutesToTime(activeEnd),
      startMin: current,
      endMin: activeEnd,
      tasks,
    })

    current = activeEnd
    const sleepEnd = current + sleepMinutes

    blocks.push({
      type: 'sleep',
      start: minutesToTime(current),
      end: minutesToTime(Math.min(sleepEnd, endMinutes)),
      startMin: current,
      endMin: Math.min(sleepEnd, endMinutes),
      label: 'Soneca Forçada',
      sublabel: 'Caixa de transporte · Não interaja',
    })

    current = sleepEnd
  }

  // Calcula estatísticas do dia
  const totalSleepMin = blocks.filter(b => b.type === 'sleep').reduce((acc, b) => acc + (b.endMin - b.startMin), 0)
  const totalAwakeMin = blocks.filter(b => b.type === 'active').reduce((acc, b) => acc + (b.endMin - b.startMin), 0)
  const ownerFreeMin = totalSleepMin

  return {
    blocks,
    stats: {
      totalSleepHours: (totalSleepMin / 60).toFixed(1),
      totalAwakeHours: (totalAwakeMin / 60).toFixed(1),
      ownerFreeHours: (ownerFreeMin / 60).toFixed(1),
      ageLabel: rules.label,
    },
  }
}
