// firebase.js
// Importamos desde CDN los módulos necesarios de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyC0vucrW19BFnmNDWnI75vp_TfVIhmWPD4",
  authDomain: "kalau-finanzas.firebaseapp.com",
  projectId: "kalau-finanzas",
  storageBucket: "kalau-finanzas.firebasestorage.app",
  messagingSenderId: "798835375765",
  appId: "1:798835375765:web:56096ebe7ebf63ead3e59c",
  measurementId: "G-DTRZN29K6V"
};

// Inicializamos Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos para usar en otros archivos
export { app, db };
