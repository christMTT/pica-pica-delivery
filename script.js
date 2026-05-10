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





const menuContainer = document.getElementById('menu-container');
const categoryButtonsContainer = document.getElementById('category-buttons');
const subscriptionForm = document.getElementById('subscription-form');
const subscriptionNameInput = document.getElementById('subscription-name');
const subscriptionFeedback = document.getElementById('subscription-feedback');

let menuData = [];

function crearTarjetaPlato(plato) {
  const imageUrl = plato.Imagen_Url && plato.Imagen_Url.startsWith('http')
    ? plato.Imagen_Url
    : 'https://via.placeholder.com/480x280?text=Pica-Pica';

  return `
    <article class="card">
      <img class="card__image" src="${imageUrl}" alt="${plato.Nombre}" onerror="this.src='https://via.placeholder.com/480x280?text=Sin+imagen'" />
      <div class="card__body">
        <h3 class="card__name">${plato.Nombre}</h3>
        <p class="text-muted">${plato.Categoria || 'General'}</p>
        <p style="margin:10px 0 12px; color:var(--color-text-body);">${plato.Descripcion || ''}</p>
        <div class="card__footer">
          <span class="card__price">Bs ${plato.Precio || '0'}</span>
          <button class="btn-add" type="button">+</button>
        </div>
      </div>
    </article>
  `;
}

function renderMenu(platos) {
  if (!menuContainer) return;
  if (!platos || platos.length === 0) {
    menuContainer.innerHTML = '<p class="text-muted">No hay platos disponibles en este momento.</p>';
    return;
  }

  menuContainer.innerHTML = platos.map(crearTarjetaPlato).join('');
}

function renderCategoryButtons(platos) {
  if (!categoryButtonsContainer) return;

  const categorias = Array.from(new Set(platos.map(plato => plato.Categoria || 'Sin categoría')));
  const botones = ['Todos', ...categorias];

  categoryButtonsContainer.innerHTML = botones.map(nombre => {
    const clase = nombre === 'Todos' ? 'btn-primary' : 'btn-outline';
    return `<button type="button" class="${clase}" data-categoria="${nombre}">${nombre}</button>`;
  }).join('');

  categoryButtonsContainer.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      categoryButtonsContainer.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      });

      button.classList.remove('btn-outline');
      button.classList.add('btn-primary');

      const categoria = button.dataset.categoria;
      if (categoria === 'Todos') {
        renderMenu(menuData);
      } else {
        const filtrados = menuData.filter(plato => (plato.Categoria || '').toLowerCase() === categoria.toLowerCase());
        renderMenu(filtrados);
      }
    });
  });
}

function mostrarFeedback(mensaje, esError = false) {
  if (!subscriptionFeedback) return;
  subscriptionFeedback.textContent = mensaje;
  subscriptionFeedback.style.color = esError ? '#d64541' : 'var(--color-text-body)';
}

async function iniciarPagina() {
  try {
    const platos = await obtenerMenu();
    menuData = Array.isArray(platos) ? platos : [];
    renderCategoryButtons(menuData);
    renderMenu(menuData);
  } catch (error) {
    console.error('Error cargando el menú:', error);
    if (menuContainer) {
      menuContainer.innerHTML = '<p class="text-muted">No se pudo cargar el menú. Intenta recargar la página.</p>';
    }
  }
}

if (subscriptionForm) {
  subscriptionForm.addEventListener('submit', async event => {
    event.preventDefault();
    const nombre = subscriptionNameInput?.value.trim();

    if (!nombre) {
      mostrarFeedback('Por favor ingresa tu nombre.', true);
      return;
    }

    mostrarFeedback('Registrando tu suscripción...');

    try {
      await registrarSuscripcion({
        Nombre_vecino: nombre,
        Plan: 'Semanal',
        Fecha: new Date().toISOString().slice(0, 10)
      });

      mostrarFeedback(`¡Gracias ${nombre}! Tu plan semanal fue confirmado.`);
      subscriptionForm.reset();
    } catch (error) {
      console.error('Error registrando suscripción:', error);
      mostrarFeedback('No se pudo registrar la suscripción. Intenta nuevamente.', true);
    }
  });
}

window.addEventListener('DOMContentLoaded', iniciarPagina);
