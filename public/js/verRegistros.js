import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { db } from "./firebase.js";

// Referencia a la colección
const registrosCollection = collection(db, "registros");

// Fecha actual para iniciar
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1; // 1 a 12

// Elementos HTML para controlar mes y mostrar texto del mes
const btnPrevMes = document.getElementById("btnPrevMes");
const btnNextMes = document.getElementById("btnNextMes");
const mesSeleccionado = document.getElementById("mesSeleccionado"); // Div donde mostraremos "Junio 2025" por ej.

// Elemento canvas para la gráfica
const ctx = document.getElementById("miGrafica").getContext("2d");
let chart = null; // Referencia a la gráfica para poder destruirla y recrearla

/**
 * Función para mostrar mes y año en formato legible, ej: "Junio 2025"
 * @param {number} year Año numérico (2025)
 * @param {number} month Mes numérico (1-12)
 */
function mostrarMesYear(year, month) {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  // Asignamos el texto al div mesSeleccionado
  mesSeleccionado.textContent = meses[month - 1] + " " + year;
}

/**
 * Función para obtener el rango de fechas (inicio y fin) del mes para filtrar en Firestore
 * @param {number} year Año numérico
 * @param {number} month Mes numérico (1-12)
 * @returns {Object} Objeto con fechas start y end (Date)
 */
function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1); // primer día mes
  const end = new Date(year, month, 0, 23, 59, 59, 999); // último día mes (día 0 del siguiente mes)
  return { start, end };
}

/**
 * Función principal para cargar datos desde Firestore y graficar el mes seleccionado
 * @param {number} year Año numérico
 * @param {number} month Mes numérico
 */
async function cargarDatosMes(year, month) {
  // Primero actualizamos el texto del mes visible
  mostrarMesYear(year, month);

  const { start, end } = getMonthRange(year, month);

  // Consultamos los registros del mes seleccionado filtrando la fecha en Firestore
  // Firestore espera formato "YYYY-MM-DD", usamos toISOString().slice(0,10)
  const q = query(
    registrosCollection,
    where("fecha", ">=", start.toISOString().slice(0, 10)),
    where("fecha", "<=", end.toISOString().slice(0, 10))
  );

  // Ejecutamos la consulta
  const snapshot = await getDocs(q);

  // Inicializamos variables para sumar montos
  let totalVideos = 0;
  let pagoLautaro = 0;
  let pagoMatias = 0;

  // Iteramos los registros para sumar
  snapshot.forEach(doc => {
    const data = doc.data();
    totalVideos += parseFloat(data.precioVideo) || 0;
    pagoLautaro += parseFloat(data.pagoLautaro) || 0;
    pagoMatias += parseFloat(data.pagoMatias) || 0;
  });

  // Si ya existe una gráfica previa la destruimos para evitar superposiciones
  if (chart) chart.destroy();

  // Creamos la gráfica de barras con Chart.js
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total Videos', 'Pago Lautaro', 'Pago Matias'],
      datasets: [{
        label: `Ganancias ${year}-${String(month).padStart(2, '0')}`,
        data: [totalVideos, pagoLautaro, pagoMatias],
        backgroundColor: ['mediumpurple', '#502978', '#2f1846'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Cargar gráfica inicial con el mes y año actuales
cargarDatosMes(currentYear, currentMonth);

// Eventos para botones "Mes Anterior" y "Mes Siguiente"
btnPrevMes.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  cargarDatosMes(currentYear, currentMonth);
});

btnNextMes.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  cargarDatosMes(currentYear, currentMonth);
});
