PI: Creá el archivo src/logica.ts con las reglas de Torre de Control,
según la ficha de abajo.

REGLAS TÉCNICAS, obligatorias
- TypeScript. Exportá los tipos y el objeto CONFIG con todos los números
  juntos arriba, cada uno con un comentario que diga su unidad.
- Este archivo NO puede tocar la pantalla: nada de document, window, alert ni
  console.log. Solo datos y funciones sobre el estado.
- Cada función que cambia el estado devuelve true si la acción fue válida y
  false si no se pudo hacer.
- Si hace falta azar, usá un generador con semilla y exportalo, para que la
  misma semilla dé siempre el mismo resultado.
- Código y comentarios en español.

REGLAS DE TRABAJO
- Hacé exactamente lo que dice la ficha. Nada más.
- Si algo es ambiguo o imposible, paralo y preguntame antes de inventar.
- Al terminar, listame qué dejaste fuera y qué decidiste vos donde la ficha
  no decía nada.

FICHA:
NOMBRE: Torre de Control
EN UNA FRASE: Ordeno los aterrizajes de avionetas en un aeropuerto chico para que ninguna se quede sin combustible.
PARA QUIÉN ES: Marcos, 16 años, que pasa por la feria y quiere un juego de dos minutos.
QUÉ LOGRA: Aterrizar las 8 avionetas que llegan.
LOS TRES VERBOS: 1. Aterrizar (una avioneta en una pista libre). 2. Hacer circular (la avioneta espera un turno y gasta combustible). 3. Desviar (mandarla a otro aeropuerto).
TERMINA BIEN SI: las 8 avionetas fueron atendidas (aterrizadas o desviadas) y hubo como máximo 1 desviada.
TERMINA MAL SI: una avioneta que espera llega a 0 de combustible, o se desvían 2.
QUÉ SE VE EN PANTALLA: 2 pistas (libre u ocupada, con los turnos que le faltan), la lista de avionetas esperando con su combustible, el turno actual, y los contadores de aterrizadas y desviadas.
CONTROLES: Teclado: flechas para elegir avioneta, 1 y 2 para aterrizar en la pista 1 o 2, C para circular, D para desviar. Dedo: botones grandes de mínimo 44 píxeles para cada acción.
COLORES: Verde = pista libre o combustible bien. Amarillo = combustible bajo (2 o menos). Rojo = peligro o pista ocupada. Azul oscuro = fondo.
CRITERIO DE ACEPTACIÓN: Abro, veo 2 pistas libres y una avioneta con 6 de combustible. La aterrizo en la pista 1, que queda ocupada 3 turnos. Llega otra, la hago circular y baja su combustible. Repito hasta atender las 8 y veo "Ganaste".
LO QUE NO VA: sin animaciones de aviones, sin sonido, sin niveles, sin viento, sin más de 2 pistas, sin azar (todo es determinista).

CÓMO FUNCIONA UN TURNO:
- En cada turno el jugador hace UNA acción sobre UNA avioneta que espera.
- Al terminar la acción, el turno avanza: toda avioneta que sigue esperando pierde 1 de combustible, y cada pista ocupada baja 1 turno su contador.
- Cada 2 turnos llega una avioneta nueva con 6 de combustible, hasta completar 8.
- Aterrizar solo es válido si la pista elegida está libre; la deja ocupada 3 turnos.
- Si una avioneta que espera llega a 0 de combustible, se pierde la partida.

NÚMEROS DEL CONFIG: 2 pistas, pista ocupada 3 turnos, llega 1 avioneta cada 2 turnos, combustible inicial 6, 8 avionetas en total, máximo 1 desvío permitido, combustible bajo = 2 o menos.

P2:Creá src/main.ts y src/estilo.css para mostrar Torre de Control
en pantalla.

REGLAS
- main.ts NO decide nada: llama a las funciones de logica.ts y dibuja el
  resultado. Si tenés que escribir una regla acá, está en el lugar equivocado:
  decímelo en lugar de hacerlo.
- Tres estados visibles: el inicio, el uso normal y el final.
- Contraste alto y texto nunca menor a 16 píxeles.
- Los colores según mi ficha: verde = pista libre o combustible bien,
  amarillo = combustible 2 o menos, rojo = peligro o pista ocupada,
  azul oscuro = fondo. Sin imágenes ni librerías externas.
- Importá el CSS desde main.ts con: import './estilo.css'

Ajustá index.html para que tenga un div con id="app" y cargue src/main.ts
como módulo. Al terminar confirmame que no hay errores en la consola.

P3: Creá src/main.ts y src/estilo.css para mostrar Torre de Control
en pantalla.

REGLAS
- main.ts NO decide nada: llama a las funciones de logica.ts y dibuja el
  resultado. Si tenés que escribir una regla acá, está en el lugar equivocado:
  decímelo en lugar de hacerlo.
- Tres estados visibles: el inicio, el uso normal y el final.
- Contraste alto y texto nunca menor a 16 píxeles.
- Los colores según mi ficha: verde = pista libre o combustible bien,
  amarillo = combustible 2 o menos, rojo = peligro o pista ocupada,
  azul oscuro = fondo. Sin imágenes ni librerías externas.
- Importá el CSS desde main.ts con: import './estilo.css'

Ajustá index.html para que tenga un div con id="app" y cargue src/main.ts
como módulo. Al terminar confirmame que no hay errores en la consola.