// Importar Firebase y Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBvX35fPzeyDRacGv88NPO31AA3I5rUOxM",
    authDomain: "rifa-17158.firebaseapp.com",
    projectId: "rifa-17158",
    storageBucket: "rifa-17158.firebasestorage.app",
    messagingSenderId: "413646346970",
    appId: "1:413646346970:web:7d95ece41fe7442ed323e3",
    measurementId: "G-GR8G56E4RB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Conectar a Firestore

const tabla = document.getElementById("tabla-rifa");

// Función para obtener los números vendidos de Firebase
async function obtenerNumerosVendidos() {
    const querySnapshot = await getDocs(collection(db, "rifa"));
    let vendidos = [];
    querySnapshot.forEach((doc) => {
        vendidos.push(Number(doc.id)); // Guardamos el número vendido (ID del documento)
    });
    return vendidos;
}

// Función para guardar un número vendido en Firebase
async function venderNumero(numero) {
    await setDoc(doc(db, "rifa", String(numero)), { numero: numero });
}

// Función para eliminar un número vendido (desmarcarlo)
async function eliminarNumero(numero) {
    await deleteDoc(doc(db, "rifa", String(numero)));
}

// Generar tabla de rifa con números del 1 al 250
async function generarTabla() {
    let vendidos = await obtenerNumerosVendidos(); // Obtener números vendidos desde Firebase
    let filas = "";
    let num = 1;

    for (let i = 0; i < 25; i++) { // 25 filas
        filas += "<tr>";
        for (let j = 0; j < 10; j++) { // 10 columnas
            let clase = vendidos.includes(num) ? "vendido" : "";
            filas += `<td class="${clase}" data-numero="${num}">${num}</td>`;
            num++;
        }
        filas += "</tr>";
    }
    tabla.innerHTML = filas;

    // Agregar evento de click a los números
    document.querySelectorAll("td").forEach(td => {
    td.addEventListener("click", async function() {
        let numero = Number(this.dataset.numero);

        // Solo permitir marcar como vendido (sin eliminar)
        if (!this.classList.contains("vendido")) {
            await venderNumero(numero);
            this.classList.add("vendido");
        }
    });
});

}

// Ejecutar función al cargar la página
generarTabla();

