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

// ESTA FUNCIÓN ES EL MOTOR DE VIBRAS ZUASS
window.lanzarPedido = function() {
    const nombre = document.getElementById('nombre-cliente').value;
    if (!nombre) return alert("¡Zuass! Vecino, dinos tu nombre para el pedido.");
    
    // 1. Intentar capturar el GPS
    navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        // 2. Guardar en Firebase
        const pedidosRef = ref(db, 'pedidos');
        const nuevoPedidoRef = push(pedidosRef);
        
        set(nuevoPedidoRef, {
            cliente: nombre,
            items: window.carrito, // Lee el carrito global del index.html
            total: window.total,     // Lee el total global del index.html
            estado: "pendiente",
            fecha: new Date().toLocaleTimeString(),
            coords: coords 
        }).then(() => {
            // 3. WhatsApp con link real de Google Maps
            let msg = `*Vibras Zuass!*%0ANuevo Pedido de ${nombre}:%0A`;
            window.carrito.forEach(i => msg += `- ${i.nombre}%0A`);
            msg += `%0A*Total: $${window.total}*%0A📍 Mi ubicación: https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
            
            window.open(`https://wa.me/573117700431?text=${msg}`, '_blank');
        });

    }, (error) => {
        alert("¡Zuass! Necesitamos el GPS activo para que el repartidor llegue a tu casa en Caucasia.");
    });
};

console.log("Cerebro Zuass! con GPS cargado y listo.");
