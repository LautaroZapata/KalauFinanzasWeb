// formHandler.js

// Importa la función para guardar el registro en la base de datos
import { guardarRegistro } from "./db.js";

// Importa la función que calcula precios y pagos
import { calcularDatosFormulario } from "./calculos.js";

// Solo importa la función calcularMontos desde modificar.js (no todo el archivo)
import { calcularMontos } from "./modificar.js";

// Obtiene el formulario desde el DOM
const formularioRegistro = document.getElementById("registroForm");

// Asocia el evento submit del formulario a una función asincrónica
formularioRegistro.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // Evita que se recargue la página

  // Captura los valores del formulario
  const cliente = formularioRegistro.cliente.value.trim();
  const tipoVideo = formularioRegistro.tipoVideo.value.trim();
  const opcionPago = formularioRegistro.opcionPago.value.trim();
  const transporte = parseInt(formularioRegistro.transporte.value) || 0;
  const fecha = formularioRegistro.fecha.value.trim();
  const descuento = parseInt(formularioRegistro.descuento.value) || 0;

  // Calcula valores relacionados al pago usando los datos ingresados
  const valoresCalculados = calcularDatosFormulario({ tipoVideo, opcionPago, descuento, transporte });

  // Construye el objeto que se guardará en Firestore
  const datos = {
    cliente,
    tipoVideo,
    opcionPago,
    transporte,
    fecha,
    descuento,
    precioBase: valoresCalculados.precioBase,
    factorPago: valoresCalculados.factorPago,
    precioVideo: valoresCalculados.precioVideo,
    pagoLautaro: valoresCalculados.pagoLautaro,
    pagoMatias: valoresCalculados.pagoMatias,
    creadoEn: new Date()
  };

  // Calcula montos totales, pagados y pendientes (solo para mostrar al usuario)
  const { montoTotal, pagoActual, pagoRestante } = calcularMontos(datos);

  try {
    // Guarda el registro en Firestore
    const id = await guardarRegistro(datos);

    // Muestra confirmación con los datos relevantes
    Swal.fire({
      icon: 'success',
      title: 'Registro guardado',
      html: `
        <p>El registro se guardó con éxito.</p>
        <p><b>Id: </b>${id}</p>
        <p><b>Cliente: </b>${datos.cliente}</p>
        <p><b>Fecha: </b>${datos.fecha}</p>
        <p><b>Opción de pago: </b>${datos.opcionPago.toUpperCase()}</p>
        <p><b>Descuento aplicado: </b>${datos.descuento}%</p>
        <p><b>Monto Pagado: </b>$${pagoActual}</p>
        <p><b>Monto Restante: </b>$${pagoRestante}</p>
        <p><b>Valor Total: </b>$${montoTotal}</p>
      `,
      confirmButtonText: 'Aceptar'
    });

    // Limpia el formulario
    formularioRegistro.reset();

  } catch (error) {
    // Si falla el guardado, muestra mensaje de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al guardar el registro. Intenta nuevamente.',
      confirmButtonText: 'Cerrar'
    });

    console.error("Error guardando registro:", error);
  }
});
