// Configuración de Firebase para Vibras Zuass
const firebaseConfig = {
  apiKey: "AIzaSyBa3WgBBS0ES3HCMHXebTDNPprGZmePi70",
  authDomain: "vibraszuass.firebaseapp.com",
  projectId: "vibraszuass",
  storageBucket: "vibraszuass.firebasestorage.app",
  messagingSenderId: "441433261428",
  appId: "1:441433261428:web:f418c47d4352cb28a59821",
  databaseURL: "https://vibraszuass-default-rtdb.firebaseio.com"
};

// Importar Firebase (Versión Web Estándar)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// EXPORTAR FUNCIONES AL WINDOW PARA QUE FUNCIONEN EN HTML
window.enviarPedidoZuass = function(carrito, total) {
    const pedidosRef = ref(db, 'pedidos');
    const nuevoPedidoRef = push(pedidosRef);
    
    const datosPedido = {
        items: carrito,
        total: total,
        estado: "pendiente",
        fecha: new Date().toLocaleTimeString(),
        cliente: "Cliente Caucasia" // Aquí podrías pedir el nombre en un input
    };

    set(nuevoPedidoRef, datosPedido).then(() => {
        // Formar mensaje para WhatsApp
        let msg = `*Vibras Zuass!*%0ANuevo Pedido:%0A`;
        carrito.forEach(i => msg += `- ${i.nombre}%0A`);
        msg += `*Total: $${total}*`;
        window.open(`https://wa.me/573117700431?text=${msg}`, '_blank');
    });
};

// Función para el Restaurante: Escuchar pedidos
window.escucharPedidos = function(callback) {
    const pedidosRef = ref(db, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};

// Función para cambiar estado (Aceptar/Entregar)
window.cambiarEstadoPedido = function(id, nuevoEstado) {
    const pedidoRef = ref(db, `pedidos/${id}`);
    update(pedidoRef, { estado: nuevoEstado });
};
