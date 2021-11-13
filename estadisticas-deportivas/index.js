const fs = require('fs')

const archivo = (nombre, delimitador) => {
  const contenido = fs.readFileSync(nombre).toString()
  return contenido.split(delimitador)
}

const equipoA = archivo('basket/equipo-A.txt', '\n')
const equipoB = archivo('basket/equipo-B.txt', '\n')
const partido = archivo('basket/partido.log', '\n')

const puntosPorEquipo = (partido, equipo) => {
  const puntosEquipo = filtrarPorEquipo(partido, equipo)
  const total = calcularTotal(puntosEquipo).total
  const puntos = calcularTotal(puntosEquipo).puntos
  return {
    total,
    puntos
  }
}

const filtrarPorEquipo = (partido, equipo) => {
  const nombres = partido.filter(anotacion => {
    let apellido = anotacion.split(",")[0]
    let apellidos = equipo.map(nombreCompleto => nombreCompleto.split(" ")[1])
    return apellidos.includes(apellido)
  })

  return nombres
}

const calcularTotal = (puntosEquipo) => {

  let puntos = {};
  let total = 0;

  puntosEquipo.map(canasta => {

    let punto = canasta.split(",")[1]
    let apellido = canasta.split(",")[0]

    punto = (punto === 'DOBLE') ? 2 : 3
    puntos[apellido] = puntos[apellido] || 0

    puntos[apellido] += punto
    total += punto

  })
  return {
    total, puntos
  }
}

const getMaxScore = (A, B) => {

  const jugadorA = obtenerJugadorConMasPuntos(A);
  const jugadorB = obtenerJugadorConMasPuntos(B);
  let jugador = (jugadorA.puntos > jugadorB.puntos) ? jugadorA : jugadorB;   
  return jugador
  }
  
const obtenerJugadorConMasPuntos = (puntosEquipo) => {
  let puntos = 0;
  let nombre;
  for (const jugador in puntosEquipo.puntos) {
    if (puntos < puntosEquipo.puntos[jugador]) {
      puntos = puntosEquipo.puntos[jugador]
      nombre = jugador;
    }
  }
  return {
    nombre,
    puntos
  }
}

const calcularCanastas = (partido) => {
  let contDobles = 0; let contTriples = 0; let acumDobles = 0; let acumTriples = 0;
  partido.map(puntaje => {
        let punto = puntaje.split(",")[1]    
    if (punto == "DOBLE") {
      contDobles++;
      acumDobles += 2;
    } else if (punto == "TRIPLE") {
      contTriples++;
      acumTriples += 3;
    }
  })
  
  return {
    dobles: contDobles,
    totalPuntosPorDobles: acumDobles,
    triples: contTriples,
    totalPuntosPorTriples: acumTriples,
  }
}


console.log("Puntaje:" )

const puntajeTotal = (puntosA, puntosB) => { 
  return {
    EquipoA: puntosA,
    EquipoB: puntosB
  }
};

const totalA = puntosPorEquipo(partido, equipoA)
const totalB = puntosPorEquipo(partido, equipoB)

console.log(puntajeTotal(totalA, totalB))
let jugador = getMaxScore(totalA, totalB)
console.log("Jugador con mas puntos: " + jugador.nombre + ", puntos: " + jugador.puntos)
console.log(calcularCanastas(partido))