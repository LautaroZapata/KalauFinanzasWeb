// db.js
// Importamos Firestore desde CDN y la instancia db de firebase.js
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Referencia a la colección "registros"
const registrosCollection = collection(db, "registros");

/**
 * Guarda un nuevo registro en Firestore
 * @param {Object} datos Datos a guardar
 * @returns {Promise<string>} ID del nuevo documento
 */
export async function guardarRegistro(datos) {
  try {
    const docRef = await addDoc(registrosCollection, datos);
    console.log("Registro guardado con ID.", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error guardando registro.", error);
    throw error;
  }
}

// Exportamos db y la referencia a la colección de registros
export { db, registrosCollection };
