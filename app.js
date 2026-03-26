import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBa3WgBBS0ES3HCMHXebTDNPprGZmePi70",
    authDomain: "vibraszuass.firebaseapp.com",
    projectId: "vibraszuass",
    storageBucket: "vibraszuass.firebasestorage.app",
    messagingSenderId: "441433261428",
    appId: "1:441433261428:web:f418c47d4352cb28a59821",
    databaseURL: "https://vibraszuass-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ESTA FUNCIÓN ES LA QUE CAPTURA EL GPS Y ENVÍA TODO
window.enviarPedidoZuass = function(carrito, total, nombre) {
    // 1. Intentar capturar el GPS
    navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        // 2. Guardar en Firebase con las coordenadas
        const pedidosRef = ref(db, 'pedidos');
        const nuevoPedidoRef = push(pedidosRef);
        
        set(nuevoPedidoRef, {
            cliente: nombre,
            items: carrito,
            total: total,
            estado: "pendiente",
            fecha: new Date().toLocaleTimeString(),
            coords: coords // <--- AQUÍ VA EL GPS PARA EL DOMICILIARIO
        }).then(() => {
            // 3. Abrir WhatsApp con el link de ubicación
            let msg = `*Vibras Zuass!*%0ANuevo Pedido de ${nombre}:%0A`;
            carrito.forEach(i => msg += `- ${i.nombre}%0A`);
            msg += `%0A*Total: $${total}*%0A📍 Mi ubicación: https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
            window.open(`https://wa.me/573117700431?text=${msg}`, '_blank');
        });

    }, (error) => {
        // Si el cliente no acepta el GPS, le avisamos:
        alert("¡Zuass! Vecino, para que el domiciliario llegue rápido, necesitamos que aceptes el permiso de GPS.");
    });
};

console.log("Cerebro Zuass! cargado con GPS");
