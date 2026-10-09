export const CONFIG = {
  cantidadPistas: 2, // pistas
  turnosDeOcupacion: 3, // turnos
  intervaloLlegadas: 2, // turnos
  combustibleInicial: 6, // unidades de combustible
  cantidadAvionetas: 8, // avionetas
  maximoDesvios: 1, // avionetas desviadas
  combustibleBajo: 2, // unidades de combustible
} as const

export type ResultadoPartida = 'enCurso' | 'ganaste' | 'perdiste'

export interface Avioneta {
  id: number
  combustible: number
}

export interface Pista {
  numero: number
  avionetaId: number | null
  turnosRestantes: number
}

export interface EstadoPartida {
  turnoActual: number
  pistas: Pista[]
  esperando: Avioneta[]
  avionetasCreadas: number
  aterrizadas: number
  desviadas: number
  resultado: ResultadoPartida
}

export function crearEstadoInicial(): EstadoPartida {
  return {
    turnoActual: 1,
    pistas: Array.from({ length: CONFIG.cantidadPistas }, (_, indice) => ({
      numero: indice + 1,
      avionetaId: null,
      turnosRestantes: 0,
    })),
    esperando: [{ id: 1, combustible: CONFIG.combustibleInicial }],
    avionetasCreadas: 1,
    aterrizadas: 0,
    desviadas: 0,
    resultado: 'enCurso',
  }
}

export function aterrizar(
  estado: EstadoPartida,
  avionetaId: number,
  numeroPista: number,
): boolean {
  if (estado.resultado !== 'enCurso') return false

  const avioneta = estado.esperando.find((elemento) => elemento.id === avionetaId)
  const pista = estado.pistas.find((elemento) => elemento.numero === numeroPista)
  if (!avioneta || !pista || pista.avionetaId !== null) return false

  estado.esperando = estado.esperando.filter((elemento) => elemento.id !== avionetaId)
  estado.aterrizadas += 1
  pista.avionetaId = avionetaId
  pista.turnosRestantes = CONFIG.turnosDeOcupacion

  avanzarTrasAccion(estado, pista)
  return true
}

export function circular(estado: EstadoPartida, avionetaId: number): boolean {
  if (estado.resultado !== 'enCurso') return false
  if (!estado.esperando.some((elemento) => elemento.id === avionetaId)) return false

  avanzarTrasAccion(estado)
  return true
}

export function desviar(estado: EstadoPartida, avionetaId: number): boolean {
  if (estado.resultado !== 'enCurso') return false
  if (!estado.esperando.some((elemento) => elemento.id === avionetaId)) return false

  estado.esperando = estado.esperando.filter((elemento) => elemento.id !== avionetaId)
  estado.desviadas += 1

  avanzarTrasAccion(estado)
  return true
}

function avanzarTrasAccion(estado: EstadoPartida, pistaReciénOcupada?: Pista): boolean {
  avanzarTurno(estado, pistaReciénOcupada)

  while (estado.resultado === 'enCurso' && estado.esperando.length === 0 &&
    estado.avionetasCreadas < CONFIG.cantidadAvionetas) {
    avanzarTurno(estado)
  }

  return true
}

function avanzarTurno(estado: EstadoPartida, pistaReciénOcupada?: Pista): boolean {
  estado.turnoActual += 1

  for (const avioneta of estado.esperando) {
    avioneta.combustible -= 1
  }

  for (const pista of estado.pistas) {
    if (pista === pistaReciénOcupada || pista.avionetaId === null) continue

    pista.turnosRestantes -= 1
    if (pista.turnosRestantes === 0) {
      pista.avionetaId = null
    }
  }

  if (estado.esperando.some((avioneta) => avioneta.combustible === 0) ||
    estado.desviadas > CONFIG.maximoDesvios) {
    estado.resultado = 'perdiste'
    return true
  }

  if (estado.turnoActual % CONFIG.intervaloLlegadas === 0 &&
    estado.avionetasCreadas < CONFIG.cantidadAvionetas) {
    const id = estado.avionetasCreadas + 1
    estado.esperando.push({ id, combustible: CONFIG.combustibleInicial })
    estado.avionetasCreadas += 1
  }

  if (estado.aterrizadas + estado.desviadas === CONFIG.cantidadAvionetas) {
    estado.resultado = 'ganaste'
  }

  return true
}
