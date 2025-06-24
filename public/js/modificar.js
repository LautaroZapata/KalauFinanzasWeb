// modificar.js

// Importamos Firestore y la colección de registros desde db.js
import { db, registrosCollection } from "./db.js";

// Importamos funciones necesarias de Firebase
import { deleteDoc, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Importamos la función para calcular valores del formulario
import { calcularDatosFormulario } from "./calculos.js";


// Esta función calcula los montos totales y pendientes para mostrar en pantalla
export function calcularMontos(data) {
  const precioVideo = Number(data.precioVideo) || 0;
  const transporte = Number(data.transporte) || 0;
  const opcionPago = data.opcionPago;

  let montoTotal = 0;
  let pagoActual = 0;
  let pagoRestante = 0;

  if (opcionPago === "pagoParcial") {
    // Si es pago parcial, el total es el doble del precio menos transporte
    montoTotal = precioVideo * 2 - transporte;
    pagoActual = precioVideo;
    pagoRestante = montoTotal - pagoActual;
  } else {
    // Si es pago total, ya está todo pagado
    montoTotal = precioVideo;
    pagoActual = precioVideo;
    pagoRestante = 0;
  }

  // Ajuste especial si el transporte es cero y el pago es parcial
  if (transporte <= 0 && opcionPago === "pagoParcial") {
    pagoRestante = precioVideo;
  }

  return {
    montoTotal,
    pagoActual,
    pagoRestante
  };
}


/**
 * Esta función carga y muestra los registros en el DOM.
 * Solo se debe ejecutar en modificar.html (donde existe el contenedor de registros).
 */
export async function iniciarModificacion() {
  const contenedor = document.getElementById("contenedorRegistros");

  // Si no existe el contenedor (por ejemplo, estás en index.html), no hace nada
  if (!contenedor) return;

  // Esta función obtiene los datos desde Firebase y los imprime
  async function cargarRegistros() {
    contenedor.innerHTML = "<p>Cargando...</p>";

    try {
      // Obtenemos todos los documentos de la colección "registros"
      const snapshot = await getDocs(registrosCollection);
      contenedor.innerHTML = ""; // Limpiamos el contenedor

      // Recorremos cada documento (registro)
      snapshot.forEach((item) => {
        const data = item.data();
        const { montoTotal, pagoActual, pagoRestante } = calcularMontos(data);

        // Creamos un div para mostrar el registro
        const div = document.createElement("div");
        div.classList.add("p-3", "m-3", "d-flex", "flex-column", "cardRegistro");

        // Contenido HTML del registro
        div.innerHTML = `
          <p>Registro: <b>${item.id.toUpperCase()}</b></p>
          <h5>Cliente: <b>${data.cliente.toUpperCase()}</b></h5>
          <p>Fecha: <b>${data.fecha}</b></p>
          <p>Tipo de video: <b>${data.tipoVideo.toUpperCase()}</b></p>
          <p>Estado Pago: <b>${data.opcionPago === "pagoParcial" ? "SEÑA" : "PAGO TOTAL"}</b></p>

          <p>Monto Total: <b>$${montoTotal}</b></p>
          <p>Pago Actual: <b class="pagoActual">$${pagoActual}</b></p>
          <p><b class="pagoRestante">Pago Restante: $${pagoRestante}</b></p>

          ${data.transporte != 0 ? "<p>Transporte: <b>$" + parseInt(data.transporte) + "</b></p>" : ""}

          <p>Pago Matías: <b>${data.pagoMatiasConfirmado ? "Sí" : "No"}</b></p>

          ${data.opcionPago === "pagoParcial" ? `<button data-id='${item.id}' class='completar btn my-2'>Completar pago</button>` : ""}

          ${!data.pagoMatiasConfirmado ? `<button data-id="${item.id}" class="pagoMatias btn btn-warning my-2">Confirmar Pago Matías</button>` : ""}

          <button data-id="${item.id}" class="eliminar btn btn-danger mt-2">Borrar</button>
        `;

        // Agregamos el registro al contenedor
        contenedor.appendChild(div);
      });

      // === Listeners ===

      // Botón para confirmar pago a Matías
      document.querySelectorAll(".pagoMatias").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;

          Swal.fire({
            title: '¿Confirmar que se pagó a Matías?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await updateDoc(doc(db, "registros", id), {
                  pagoMatiasConfirmado: true
                });

                await cargarRegistros(); // Recargamos los registros

                Swal.fire({
                  icon: 'success',
                  title: '¡Confirmado!',
                  text: 'El pago a Matías ha sido marcado como realizado.',
                  timer: 2000,
                  showConfirmButton: false
                });
              } catch (error) {
                console.error("Error confirmando pago a Matías.", error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo confirmar el pago.' });
              }
            }
          });
        });
      });

      // Botón para eliminar un registro
      document.querySelectorAll(".eliminar").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;

          Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo!",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await deleteDoc(doc(db, "registros", id));
                await cargarRegistros(); // Recargamos luego de borrar

                Swal.fire({
                  icon: 'success',
                  title: '¡Eliminado!',
                  text: 'Registro eliminado con éxito.',
                  timer: 2000,
                  showConfirmButton: false
                });
              } catch (error) {
                console.error("Error eliminando el registro.", error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el registro.' });
              }
            }
          });
        });
      });

      // Botón para completar un pago parcial
      document.querySelectorAll(".completar").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;

          Swal.fire({
            title: '¿Confirmar pago total?',
            text: "Se actualizará el pago de este registro.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const snapshot = await getDocs(registrosCollection);
                const item = snapshot.docs.find((item) => item.id == id);
                if (!item) return;

                const data = item.data();

                const nuevosCalculos = calcularDatosFormulario({
                  tipoVideo: data.tipoVideo,
                  opcionPago: "pagoTotal",
                  descuento: data.descuento,
                  transporte: data.transporte
                });

                await updateDoc(doc(db, "registros", id), {
                  opcionPago: "pagoTotal",
                  precioVideo: nuevosCalculos.precioVideo,
                  pagoLautaro: nuevosCalculos.pagoLautaro,
                  pagoMatias: nuevosCalculos.pagoMatias,
                });

                await cargarRegistros(); // Recargamos para reflejar el cambio

                Swal.fire({
                  icon: 'success',
                  title: '¡Actualizado!',
                  text: 'El pago se actualizó correctamente.',
                  timer: 2000,
                  showConfirmButton: false
                });

              } catch (error) {
                console.error("Error actualizando el pago.", error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el pago.' });
              }
            }
          });
        });
      });

    } catch (error) {
      console.error("Error cargando registros.", error);
      contenedor.innerHTML = "<p>Error cargando registros</p>";
    }
  }

  // Llamamos a la función que carga los registros al iniciar
  await cargarRegistros();
}
