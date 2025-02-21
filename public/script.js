// Firebase Configuración
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvX35fPzeyDRacGv88NPO31AA3I5rUOxM",
    authDomain: "rifa-17158.firebaseapp.com",
    projectId: "rifa-17158",
    storageBucket: "rifa-17158.firebasestorage.app",
    messagingSenderId: "413646346970",
    appId: "1:413646346970:web:7d95ece41fe7442ed323e3",
    measurementId: "G-GR8G56E4RB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tabla = document.getElementById("tabla-rifa");

async function obtenerNumerosVendidos() {
    const querySnapshot = await getDocs(collection(db, "rifa"));
    let vendidos = [];
    querySnapshot.forEach(doc => vendidos.push(Number(doc.id)));
    return vendidos;
}

async function venderNumero(numero) {
    await setDoc(doc(db, "rifa", String(numero)), { numero: numero });
}

async function eliminarNumero(numero) {
    await deleteDoc(doc(db, "rifa", String(numero)));
}

async function contarNumerosVendidos() {
    const vendidos = await obtenerNumerosVendidos();
    const totalVendidos = vendidos.length;
    const totalDisponibles = 250 - totalVendidos;
    document.getElementById('contador-vendidos').innerText = `Vendidos: ${totalVendidos} | Disponibles: ${totalDisponibles}`;
}

async function generarTabla() {
    let vendidos = await obtenerNumerosVendidos();
    let filas = "";
    let num = 1;

    for (let i = 0; i < 25; i++) {
        filas += "<tr>";
        for (let j = 0; j < 10; j++) {
            let clase = vendidos.includes(num) ? "vendido" : "";
            filas += `<td class="${clase}" data-numero="${num}">${num}</td>`;
            num++;
        }
        filas += "</tr>";
    }
    tabla.innerHTML = filas;

    // Evento de clic en cada celda
    document.querySelectorAll("td").forEach(td => {
        td.addEventListener("click", async function() {
            let numero = Number(this.dataset.numero);
            if (!this.classList.contains("vendido")) {
                await venderNumero(numero);
                this.classList.add("vendido");
                contarNumerosVendidos();
            }
        });
    });
}

document.getElementById("btn-reglas").addEventListener("click", () => {
    document.getElementById("modal-reglas").style.display = "block";
});

document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-reglas").style.display = "none";
});

document.querySelectorAll('.facebook').forEach(button => {
    button.href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
});

document.querySelectorAll('.twitter').forEach(button => {
    button.href = `https://twitter.com/intent/tweet?url=${window.location.href}&text=¡Participa en nuestra rifa futurista!`;
});

document.querySelectorAll('.whatsapp').forEach(button => {
    button.href = `https://wa.me/?text=¡Participa en nuestra rifa futurista! ${window.location.href}`;
});
document.querySelectorAll('.instagram').forEach(button => {
    button.href = `https://www.instagram.com/`;
});


// Función para abrir el modal
const btnReglas = document.getElementById("btn-reglas");
const modalReglas = document.getElementById("modal-reglas");
const cerrarModal = document.getElementById("cerrar-modal");

btnReglas.addEventListener("click", function() {
    modalReglas.style.display = "block"; // Mostrar modal
});

// Cuando el usuario hace clic en "X" para cerrar el modal
cerrarModal.addEventListener("click", function() {
    modalReglas.style.display = "none"; // Cerrar modal
});

// Cuando el usuario hace clic fuera del modal, también cerrarlo
window.addEventListener("click", function(event) {
    if (event.target === modalReglas) {
        modalReglas.style.display = "none"; // Cerrar modal
    }
});

// Llamar a la función al cargar la página
generarTabla();
contarNumerosVendidos();

