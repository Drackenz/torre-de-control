import './estilo.css'
import {
  aterrizar,
  circular,
  crearEstadoInicial,
  desviar,
  type EstadoPartida,
} from './logica.ts'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('No se encontró el contenedor principal de la aplicación.')
}

const contenedor: HTMLDivElement = app
let estado: EstadoPartida | null = null
let avionetaSeleccionada = 1
let mensaje = ''

function mostrarInicio(): void {
  contenedor.innerHTML = `
    <main class="pantalla pantalla-inicio">
      <section class="panel bienvenida" aria-labelledby="titulo-juego">
        <p class="sobretitulo">Aeropuerto de la feria</p>
        <h1 id="titulo-juego">Torre de Control</h1>
        <p class="introduccion">Ordená los aterrizajes para que ninguna avioneta se quede sin combustible.</p>
        <p class="instrucciones">Atendé las 8 avionetas. Podés aterrizarlas o desviar como máximo una.</p>
        <button class="boton boton-principal" type="button" data-accion="iniciar">Iniciar partida</button>
      </section>
    </main>
  `
}

function mostrarPartida(): void {
  if (!estado) {
    mostrarInicio()
    return
  }

  if (estado.resultado !== 'enCurso') {
    mostrarFinal()
    return
  }

  const avionetaActiva = estado.esperando.find(
    (avioneta) => avioneta.id === avionetaSeleccionada,
  )
  if (!avionetaActiva && estado.esperando.length > 0) {
    avionetaSeleccionada = estado.esperando[0].id
  }

  const avionetaActual = estado.esperando.find(
    (avioneta) => avioneta.id === avionetaSeleccionada,
  )

  contenedor.innerHTML = `
    <main class="pantalla pantalla-partida">
      <header class="encabezado">
        <div>
          <p class="sobretitulo">Aeropuerto de la feria</p>
          <h1>Torre de Control</h1>
        </div>
        <p class="turno">Turno <strong>${estado.turnoActual}</strong></p>
      </header>

      <section class="panel panel-pistas" aria-labelledby="titulo-pistas">
        <h2 id="titulo-pistas">Pistas</h2>
        <div class="pistas">
          ${estado.pistas.map((pista) => `
            <article class="pista ${pista.avionetaId === null ? 'pista-libre' : 'pista-ocupada'}">
              <h3>Pista ${pista.numero}</h3>
              <p>${pista.avionetaId === null
                ? 'Libre'
                : `Ocupada · ${pista.turnosRestantes} turnos restantes`}</p>
              ${avionetaActual ? `
                <button
                  class="boton boton-pista"
                  type="button"
                  data-accion="aterrizar"
                  data-pista="${pista.numero}"
                  ${pista.avionetaId !== null ? 'disabled' : ''}
                >Aterrizar aquí (${pista.numero})</button>
              ` : ''}
            </article>
          `).join('')}
        </div>
      </section>

      <section class="panel panel-espera" aria-labelledby="titulo-espera">
        <div class="titulo-espera">
          <h2 id="titulo-espera">Avionetas esperando</h2>
          <p>${estado.esperando.length} en espera</p>
        </div>
        ${estado.esperando.length > 0 ? `
          <ul class="lista-avionetas">
            ${estado.esperando.map((avioneta) => `
              <li>
                <button
                  class="avioneta ${avioneta.id === avionetaSeleccionada ? 'avioneta-seleccionada' : ''}"
                  type="button"
                  data-accion="seleccionar"
                  data-avioneta="${avioneta.id}"
                  aria-pressed="${avioneta.id === avionetaSeleccionada}"
                >
                  <span class="avioneta-nombre">Avioneta ${avioneta.id}</span>
                  <span class="combustible ${avioneta.combustible <= 2 ? 'combustible-bajo' : 'combustible-bien'}">
                    Combustible: ${avioneta.combustible}
                  </span>
                </button>
              </li>
            `).join('')}
          </ul>
        ` : '<p class="sin-espera">No hay avionetas en espera.</p>'}
      </section>

      <section class="panel panel-controles" aria-labelledby="titulo-acciones">
        <div class="contadores" aria-label="Avionetas atendidas">
          <p>Aterrizadas <strong>${estado.aterrizadas}</strong></p>
          <p>Desviadas <strong>${estado.desviadas}</strong> / 1</p>
        </div>
        <h2 id="titulo-acciones">Acciones${avionetaActual ? ` · Avioneta ${avionetaActual.id}` : ''}</h2>
        <div class="acciones">
          <button class="boton boton-accion" type="button" data-accion="circular" ${avionetaActual ? '' : 'disabled'}>Circular (C)</button>
          <button class="boton boton-accion boton-desviar" type="button" data-accion="desviar" ${avionetaActual ? '' : 'disabled'}>Desviar (D)</button>
        </div>
        <p class="ayuda-controles">Elegí una avioneta con las flechas o tocándola. Usá 1 o 2 para aterrizar.</p>
        <p class="mensaje" role="status" aria-live="polite">${mensaje}</p>
      </section>
    </main>
  `
}

function mostrarFinal(): void {
  if (!estado) return

  const ganó = estado.resultado === 'ganaste'
  contenedor.innerHTML = `
    <main class="pantalla pantalla-final">
      <section class="panel cierre" aria-labelledby="titulo-final">
        <p class="sobretitulo">Partida finalizada</p>
        <h1 id="titulo-final">${ganó ? '¡Ganaste!' : 'Partida perdida'}</h1>
        <p class="introduccion">${ganó
          ? 'Las 8 avionetas fueron atendidas.'
          : estado.desviadas > 1
            ? 'Se desviaron más avionetas de las permitidas.'
            : 'Una avioneta se quedó sin combustible.'}</p>
        <div class="resumen-final">
          <p>Aterrizadas <strong>${estado.aterrizadas}</strong></p>
          <p>Desviadas <strong>${estado.desviadas}</strong></p>
        </div>
        <button class="boton boton-principal" type="button" data-accion="reiniciar">Jugar de nuevo</button>
      </section>
    </main>
  `
}

function actualizarPantalla(): void {
  if (!estado) {
    mostrarInicio()
  } else {
    mostrarPartida()
  }
}

function ejecutarAccion(accion: () => boolean): void {
  const válida = accion()
  mensaje = válida ? '' : 'Esa acción no se puede realizar.'
  actualizarPantalla()
}

contenedor.addEventListener('click', (evento: MouseEvent) => {
  const objetivo = evento.target
  if (!(objetivo instanceof Element)) return

  const boton = objetivo.closest<HTMLButtonElement>('button[data-accion]')
  if (!boton) return

  const accion = boton.dataset.accion
  if (accion === 'iniciar' || accion === 'reiniciar') {
    estado = crearEstadoInicial()
    avionetaSeleccionada = estado.esperando[0].id
    mensaje = ''
    actualizarPantalla()
    return
  }

  if (!estado) return

  if (accion === 'seleccionar' && boton.dataset.avioneta) {
    avionetaSeleccionada = Number(boton.dataset.avioneta)
    mensaje = ''
    actualizarPantalla()
  } else if (accion === 'aterrizar' && boton.dataset.pista) {
    ejecutarAccion(() => aterrizar(estado!, avionetaSeleccionada, Number(boton.dataset.pista)))
  } else if (accion === 'circular') {
    ejecutarAccion(() => circular(estado!, avionetaSeleccionada))
  } else if (accion === 'desviar') {
    ejecutarAccion(() => desviar(estado!, avionetaSeleccionada))
  }
})

document.addEventListener('keydown', (evento: KeyboardEvent) => {
  if (!estado || estado.resultado !== 'enCurso') return

  const índiceActual = estado.esperando.findIndex(
    (avioneta) => avioneta.id === avionetaSeleccionada,
  )
  if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
    evento.preventDefault()
    if (estado.esperando.length > 0) {
      avionetaSeleccionada =
        estado.esperando[(índiceActual + 1) % estado.esperando.length].id
      mensaje = ''
      actualizarPantalla()
    }
  } else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
    evento.preventDefault()
    if (estado.esperando.length > 0) {
      avionetaSeleccionada =
        estado.esperando[(índiceActual - 1 + estado.esperando.length) % estado.esperando.length].id
      mensaje = ''
      actualizarPantalla()
    }
  } else if (evento.key === '1' || evento.key === '2') {
    evento.preventDefault()
    ejecutarAccion(() => aterrizar(estado!, avionetaSeleccionada, Number(evento.key)))
  } else if (evento.key.toLowerCase() === 'c') {
    evento.preventDefault()
    ejecutarAccion(() => circular(estado!, avionetaSeleccionada))
  } else if (evento.key.toLowerCase() === 'd') {
    evento.preventDefault()
    ejecutarAccion(() => desviar(estado!, avionetaSeleccionada))
  }
})

mostrarInicio()
