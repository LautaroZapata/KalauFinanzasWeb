// Importa la función para guardar el registro en la base de datos
import { guardarRegistroCustom } from "./db.js";

// Solo importa la función calcularMontosCustom desde modificar.js (no todo el archivo)
import { calcularMontosCustom } from "./modificar.js";


//Importi ka funcion para hacer los calculos custom 

import { calcularDatosFormularioCustom } from "./calculos.js"

const btnServicioCustom = document.querySelector("#cambiarForm");
const formMain = document.querySelector("#registroForm");
const formCustom = document.querySelector("#registroCustomForm");



btnServicioCustom.addEventListener('click', () => {
    formMain.classList.toggle('formOculto');
    formCustom.classList.toggle('formOculto');
    btnServicioCustom.innerHTML = (btnServicioCustom.innerHTML === 'Servicio Custom') ? 'Servicios Regulares' : 'Servicio Custom';
    btnServicioCustom.classList.toggle('btnServicioCustom');
})

formCustom.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  // Captura los valores del formulario
  const cliente = formCustom.clienteCustom.value.trim();
  const montoCustom = Number(formCustom.montoCustom.value) || 0;
  const opcionPago = formCustom.opcionPagoCustom.value.trim();
  const transporte = Number(formCustom.transporteCustom.value) || 0;
  const fecha = formCustom.fechaCustom.value.trim();
  const descuento = Number(formCustom.descuentoCustom.value) || 0;
  const pagoMatias = Number(formCustom.pagoMatiasCustom.value) || 0;

  if (!cliente || montoCustom <= 0 || !opcionPago || !fecha) {
    Swal.fire('Error', 'Completa todos los campos obligatorios.', 'error');
    return;
  }

  // Calculo los valores
  const valoresCalculados = calcularDatosFormularioCustom({
    montoCustom,
    opcionPago,
    descuento,
    transporte,
    pagoMatiasCustom: pagoMatias
  });

  // Ajustamos pago restante si es pago parcial
  let pagoRestante = valoresCalculados.pagoRestante;
  if(opcionPago === 'pagoParcial') {
    pagoRestante = valoresCalculados.montoPagadoHoy;
  }

  // Construyo el objeto que va a la BD
  const datos = {
    cliente,
    montoCustom,                    // Precio base sin descuento ni transporte
    precioFinal: valoresCalculados.precioFinal,  // Precio total con descuento y transporte
    opcionPago,
    transporte,
    fecha,
    descuento,
    montoPagadoHoy: valoresCalculados.montoPagadoHoy,
    pagoLautaro: valoresCalculados.pagoLautaro,
    pagoMatias,
    pagoMatiasConfirmado: false,
    pagoRestante,
    creadoEn: new Date()
  };

  try {
    const id = await guardarRegistroCustom(datos);

    Swal.fire({
      icon: 'success',
      title: 'Registro guardado',
      html: `
        <p><b>Id:</b> ${id}</p>
        <p><b>Cliente:</b> ${datos.cliente}</p>
        <p><b>Fecha:</b> ${datos.fecha}</p>
        <p><b>Opción de pago:</b> ${datos.opcionPago.toUpperCase()}</p>
        <p><b>Descuento aplicado:</b> ${datos.descuento}%</p>
        <p><b>Monto Base:</b> $${datos.montoCustom}</p>
        <p><b>Precio Final (con descuento y transporte):</b> $${datos.precioFinal}</p>
        <p><b>Monto Pagado Hoy:</b> $${datos.montoPagadoHoy}</p>
        <p><b>Pago a Matías:</b> $${datos.pagoMatias}</p>
        <p><b>Pago a Lautaro:</b> $${datos.pagoLautaro}</p>
        <p><b>Pago Restante:</b> $${datos.pagoRestante}</p>
      `,
      confirmButtonText: 'Aceptar'
    });

    formCustom.reset();

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al guardar el registro. Intenta nuevamente.',
      confirmButtonText: 'Cerrar'
    });
    console.error("Error guardando registro:", error);
  }
});



