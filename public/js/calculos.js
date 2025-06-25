// calculos.js

// Exporto la funcion CUSTOM de los calculos en el formulario

// Función para calcular montos según tus reglas



export function calcularDatosFormularioCustom({
  montoCustom,
  opcionPago,
  descuento = 0,
  transporte = 0,
  pagoMatiasCustom = 0
}) {
  // Función para aplicar descuento porcentual
  const aplicarDescuento = (precio, desc) => precio * (1 - desc / 100);

  // Aplicamos descuento al monto base
  const montoConDescuento = aplicarDescuento(montoCustom, descuento);

  // Sumamos transporte para obtener el precio final
  const precioFinal = montoConDescuento + transporte;

  // Definimos factor de pago: total o parcial
  const factorPago = opcionPago === "pagoTotal" ? 1 : 0.5;

  // Lo que se paga hoy (total o 50%)
  const montoPagadoHoy = precioFinal * factorPago;

  // Pago a Lautaro según opción
  let pagoLautaro;
  if (opcionPago === "pagoTotal") {
    pagoLautaro = montoPagadoHoy - pagoMatiasCustom;
  } else {
    pagoLautaro = montoPagadoHoy;
  }

  // Pago restante = precioFinal - pagado hoy
  const pagoRestante = precioFinal - montoPagadoHoy;

  return {
    precioFinal,       // Total con descuento y transporte
    montoPagadoHoy,    // Lo que se paga hoy
    pagoLautaro,       // Lo que recibe Lautaro hoy
    factorPago,
    descuento,
    transporte,
    pagoRestante
  };
}







// Exportamos la función para que pueda usarse desde otros archivos
export function calcularDatosFormulario({ tipoVideo, opcionPago, descuento = 0, transporte = 0 }) {

  // Inicializamos la variable para guardar el precio base según el tipo de video
  let precioBase = 0;

  // Asignamos el precio base según el tipo de video recibido
  if (tipoVideo === "basico") {
    precioBase = 5000;
  } else if (tipoVideo === "medio") {
    precioBase = 7500;
  } else if (tipoVideo === "elite") {
    precioBase = 10000;
  } else if (tipoVideo === "oneshot" || tipoVideo === "visualizer") {
    precioBase = 3000;
  }

  // Definimos el factor según el tipo de pago:
  // si es "pagoTotal", factor 1 (precio completo),
  // sino (por ejemplo "seña") factor 0.5 (50% del precio)
  let factorPago = opcionPago === "pagoTotal" ? 1 : 0.5;

  // Función interna para aplicar descuento porcentual a un precio
  // recibe el precio original y el descuento en porcentaje
  // devuelve el precio con descuento aplicado
  const aplicarDescuento = (precio, desc) => precio * (1 - desc / 100);

  // Calculamos el precio del video:
  // multiplicamos precio base por factor pago y aplicamos descuento
  let precioVideo = aplicarDescuento(precioBase * factorPago, descuento); //EJ ENTRA 10000 * 1 (montototal) y a eso se le hace descuento. Entonces queda 10000, descuento en los parametros. Dos valores que son los que acepta aplicarDescuento.

  // Sumamos el costo de transporte (ya es un número)
  precioVideo += transporte;

  // Variables para almacenar cuánto le corresponde pagar a Lautaro y Matias
  let pagoLautaro = 0;
  let pagoMatias = 0;

  // Asignamos valores según tipo de video y tipo de pago
  if (opcionPago === "pagoTotal") {
    // Pago completo: se reparte según tipo de video
    if (tipoVideo === "basico") {
      pagoLautaro = 3900;
      pagoMatias = 1100;
    } else if (tipoVideo === "medio") {
      pagoLautaro = 6400;
      pagoMatias = 1100;
    } else if (tipoVideo === "elite") {
      pagoLautaro = 7500;
      pagoMatias = 2500;
    } else if (tipoVideo === "oneshot" || tipoVideo === "visualizer") {
      pagoLautaro = 2100;
      pagoMatias = 900;
    }
  } else if (opcionPago === "pagoParcial") {
    // Pago parcial: todo lo cobrado va a Lautaro, Matías aún no cobra
    pagoLautaro = precioVideo; // lo que se pagó va entero a Lautaro
    pagoMatias = 0;
  }


  // Aplicamos descuento solo a la parte que le corresponde a Lautaro
  pagoLautaro = aplicarDescuento(pagoLautaro, descuento);

  // Finalmente, devolvemos un objeto con todos los valores calculados para usar donde se necesite
  return {
    precioBase,    // Precio base sin descuentos ni factores
    factorPago,    // Factor multiplicador según tipo de pago
    precioVideo,   // Precio final calculado (con descuento y transporte)
    pagoLautaro,   // Monto a pagar para Lautaro con descuento aplicado
    pagoMatias,    // Monto a pagar para Matias (sin descuento)
    descuento,     // El descuento aplicado en porcentaje
    transporte     // Costo adicional de transporte
  };
}
