// Importamos la instancia de Firebase y Firestore
import { db } from "./firebase.js";

// Importamos las funciones necesarias de Firestore
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Esperamos a que el DOM esté completamente cargado para comenzar
document.addEventListener("DOMContentLoaded", async () => {
  // Obtenemos el contenedor donde se mostrará el calendario
  const calendarEl = document.getElementById("contenedorCalendario");

  // Creamos un array donde vamos a guardar los eventos que vienen desde la base de datos
  const eventos = [];

  try {
    // Obtenemos todos los documentos de la colección "registros" en Firestore
    const querySnapshot = await getDocs(collection(db, "registros"));

    // Recorremos cada documento (registro)
    querySnapshot.forEach((doc) => {
      const data = doc.data(); // Obtenemos los datos del registro

      // Solo agregamos el evento si tiene una fecha válida
      if (data.fecha) {
        eventos.push({
          // El título que se va a mostrar en el calendario (cliente + tipo de video)
          title: `${data.cliente} - ${data.tipoVideo.toUpperCase()}`,

          // La fecha de inicio del evento (debe estar en formato ISO: YYYY-MM-DD)
          start: data.fecha,

          // Indicamos que el evento ocupa todo el día
          allDay: true
        });
      }
    });

    // Creamos una nueva instancia del calendario y le pasamos la configuración
    const calendar = new FullCalendar.Calendar(calendarEl, {
      // Vista inicial del calendario (mes completo)
      initialView: "dayGridMonth",

      // Cambiamos el idioma a español
      locale: "es",

      // Le pasamos los eventos que armamos antes
      events: eventos,

      // Configuramos los botones y el título del calendario
      headerToolbar: {
        left: "prev,next today",     // Botones de navegación
        center: "title",             // Título (ej: "junio 2025")
        right: "dayGridMonth,timeGridWeek" // Opciones de vista
      }
    });

    // Finalmente, renderizamos el calendario en pantalla
    calendar.render();

  } catch (error) {
    console.error("Error cargando eventos desde Firestore:", error);
  }
});
