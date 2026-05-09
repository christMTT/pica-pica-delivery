// ============================================
// PICA PICA DELIVERY - Conexión con la API
// Backend: Juan Escalante
// API: SheetDB + Google Sheets
// ============================================

const API_URL = "https://sheetdb.io/api/v1/iqzxj7h81qhi5";

// =====================
// MENÚ
// =====================

// Obtener todos los platos del menú
async function obtenerMenu() {
  const res = await fetch(`${API_URL}?sheet=Menú`);
  const data = await res.json();
  return data;
}

// Buscar platos por categoría
async function buscarPorCategoria(categoria) {
  const res = await fetch(`${API_URL}/search?Categoria=${categoria}&sheet=Menú`);
  const data = await res.json();
  return data;
}

// Agregar un plato al menú
async function agregarPlato(plato) {
  const res = await fetch(`${API_URL}?sheet=Menú`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [plato] })
  });
  return await res.json();
}

// Actualizar un plato por ID
async function actualizarPlato(id, cambios) {
  const res = await fetch(`${API_URL}/ID/${id}?sheet=Menú`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: cambios })
  });
  return await res.json();
}

// Eliminar un plato por ID
async function eliminarPlato(id) {
  const res = await fetch(`${API_URL}/ID/${id}?sheet=Menú`, {
    method: "DELETE"
  });
  return await res.json();
}

// =====================
// PEDIDOS
// =====================

// Obtener todos los pedidos
async function obtenerPedidos() {
  const res = await fetch(`${API_URL}?sheet=Pedidos`);
  const data = await res.json();
  return data;
}

// Crear un nuevo pedido
async function crearPedido(pedido) {
  const res = await fetch(`${API_URL}?sheet=Pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [pedido] })
  });
  return await res.json();
}

// Actualizar estado de un pedido
async function actualizarEstadoPedido(idPedido, nuevoEstado) {
  const res = await fetch(`${API_URL}/ID_Pedido/${idPedido}?sheet=Pedidos`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { Estado: nuevoEstado } })
  });
  return await res.json();
}

// =====================
// SUSCRIPCIONES
// =====================

// Obtener todas las suscripciones
async function obtenerSuscripciones() {
  const res = await fetch(`${API_URL}?sheet=Suscripciones`);
  const data = await res.json();
  return data;
}

// Registrar nueva suscripción
async function registrarSuscripcion(sub) {
  const res = await fetch(`${API_URL}?sheet=Suscripciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [sub] })
  });
  return await res.json();
}


// =====================
// EJEMPLO DE USO
// =====================
// 
// // Cargar menú al iniciar la página:
// obtenerMenu().then(platos => {
//   platos.forEach(plato => {
//     console.log(plato.Nombre, plato.Precio);
//   });
// });
//
// // Crear un pedido:
// crearPedido({
//   ID_Pedido: 1,
//   Nombre_Cliente: "María López",
//   Nombre_Plato: "Sándwich de Pollo",
//   Hora_Entrega: "12:30",
//   Fecha: "2026-05-06",
//   Estado: "pendiente",
//   Precio: 25
// });
//
// // Registrar suscripción:
// registrarSuscripcion({
//   ID: 1,
//   Nombre_vecino: "Carlos Pérez",
//   Plan: "Semanal",
//   Fecha: "2026-05-06"
// });
