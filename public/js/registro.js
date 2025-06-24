const formularioRegistro = document.getElementById("registroForm");

formularioRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault() // Evitamos que al mandar el formulario se recargue la pagina.

    //Capturamos los valores del formulario

    const cliente = formularioRegistro.cliente.value.trim();
    const tipoVideo = formularioRegistro.tipoVideo.value.trim();
    const opcionPago = formularioRegistro.opcionPago.value.trim();
    let transporte = parseInt(formularioRegistro.transporte.value);
    const fecha = formularioRegistro.fecha.value.trim();
    let descuento = parseInt(formularioRegistro.descuento.value);

    //Verifico si me vienen vacios los valores.
    descuento = isNaN(descuento) ? 0 : descuento;
    transporte = isNaN(transporte) ? 0 : transporte;

    console.log("Cliente:", cliente);
    console.log("Tipo de video:", tipoVideo);
    console.log("Opción de pago:", opcionPago);
    console.log("Transporte:", transporte);
    console.log("Fecha:", fecha);
    console.log("Descuento:", descuento);

    // Precio base según tipo de video
    let precioBase = 0;
    if (tipoVideo == "basico") precioBase = 5000;
    if (tipoVideo == "medio") precioBase = 7500;
    if (tipoVideo == "elite") precioBase = 10000;
    if (tipoVideo == "oneshot" || tipoVideo == "visualizer") precioBase = 5000;

    // Factor según tipo de pago
    let factorPago = (opcionPago === "pagoTotal") ? 1 : 0.5; // Si es pago total  = factorPago es igual a 1 sino 0.5

    // Precio final calculado
    let precioVideo = precioBase * factorPago; // Dependiendo el valor del factorPago se aplica el 50% para la seña o no

    //Aplico descuento si corresponde.

    function precioConDescuento(precioVideo, cantidadDescuento) {
        return precioVideo * (1 - cantidadDescuento / 100);
    }

    precioVideo = precioConDescuento(precioVideo, descuento);
    precioVideo += transporte;

    // Mostrar info en pantalla.
    let pagoLautaro = 0;
    let pagoMatias = 0;
    let info = "";

    if (tipoVideo == "basico") pagoLautaro = 3900, pagoMatias = 1100;
    if (tipoVideo == "medio") pagoLautaro = 6400, pagoMatias = 1100;
    if (tipoVideo == "elite") pagoLautaro = 7500, pagoMatias = 2500;
    if (tipoVideo == "oneshot" || tipoVideo == "visualizer") pagoLautaro = 2100, pagoMatias = 900;

    //Aplico el descuento del video a Lautaro.
    pagoLautaro = precioConDescuento(pagoLautaro, descuento);

})

