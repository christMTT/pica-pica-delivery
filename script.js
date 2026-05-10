// ============================================
// PICA PICA DELIVERY - Conexión con la API
// Backend: Juan Escalante
// API: SheetDB + Google Sheets
// ============================================

const API_URL = "https://sheetdb.io/api/v1/iqzxj7h81qhi5";

// =====================
// MENÚ
// =====================
let usuarioLogueado = null; // Guardará el nombre si tiene suscripción

// 1. Función para verificar si el usuario es suscriptor
async function verificarYActivarModo() {
    const nombreInput = document.getElementById('check-user-name').value.trim();
    const msg = document.getElementById('sub-status-msg');

    if (!nombreInput) return;

    msg.textContent = "Verificando...";

    try {
        const suscripciones = await obtenerSuscripciones();
        // Buscamos si el nombre existe en la lista de suscriptores
        const esSuscriptor = suscripciones.find(s => 
            s.Nombre_vecino.toLowerCase() === nombreInput.toLowerCase()
        );

        if (esSuscriptor) {
            usuarioLogueado = esSuscriptor.Nombre_vecino;
            msg.textContent = `✅ Plan Semanal Activo. ¡Hola ${usuarioLogueado}! Tus platos hoy son gratis.`;
            msg.style.color = "var(--color-primary-dark)";
            renderMenu(menuData); // Volvemos a renderizar para mostrar "Gratis"
        } else {
            usuarioLogueado = null;
            msg.textContent = "❌ No tienes una suscripción activa con ese nombre.";
            msg.style.color = "#d64541";
            renderMenu(menuData);
        }
    } catch (error) {
        msg.textContent = "Error al verificar. Intenta de nuevo.";
    }
}

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

// 2. Modificar la creación de la tarjeta para mostrar "GRATIS"
function crearTarjetaPlato(plato) {
  // Acceso seguro a la propiedad
  const linkImagen = plato.Imagen_Url; 
  
  // Imprime en consola para ver qué está llegando realmente
  console.log("Cargando imagen para:", plato.Nombre, "URL:", linkImagen);

  const imageUrl = (linkImagen && linkImagen.trim() !== "")
    ? linkImagen
    : 'https://via.placeholder.com/480x280?text=Sin+Imagen';

  return `
    <article class="card">
      <img class="card__image" 
           src="${imageUrl}" 
           alt="${plato.Nombre}" 
           style="width:100%; height:160px; object-fit:cover;"
           onerror="this.src='https://via.placeholder.com/480x280?text=Error+al+cargar'">
      <div class="card__body">
        <h3 class="card__name">${plato.Nombre}</h3>
        <p class="text-muted">${plato.Categoria || 'General'}</p>
        <div class="card__footer">
          <span class="card__price">Bs ${usuarioLogueado ? "0" : (plato.Precio || '0')}</span>
          <button class="btn-add" onclick="procesarPedidoRapido('${plato.Nombre}', ${plato.Precio})">
            ${usuarioLogueado ? "Gratis" : "+"}
          </button>
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
// 3. Función para procesar el pedido al hacer clic en "+"
async function procesarPedidoRapido(nombrePlato, precioOriginal) {
    let nombreCliente = usuarioLogueado;
    let precioFinal = usuarioLogueado ? 0 : precioOriginal;

    // Si no está identificado, le pedimos su nombre para el pedido normal
    if (!usuarioLogueado) {
        nombreCliente = prompt("Ingresa tu nombre para el pedido:");
        if (!nombreCliente) return;
    }

    const nuevoPedido = {
        ID_Pedido: Date.now(), // Generamos un ID único temporal
        Nombre_Cliente: nombreCliente,
        Nombre_Plato: nombrePlato,
        Hora_Entrega: "Por confirmar",
        Fecha: new Date().toISOString().slice(0, 10),
        Estado: "pendiente",
        Precio: precioFinal
    };

    try {
        alert("Enviando pedido...");
        await crearPedido(nuevoPedido);
        alert(`¡Pedido realizado! ${nombrePlato} por Bs ${precioFinal}`);
        if(typeof cargarResumenPedidos === 'function') cargarResumenPedidos(); // Recarga el resumen si existe
    } catch (error) {
        alert("Hubo un error al procesar el pedido.");
    }
}

// 4. Asignar el evento al botón de verificar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const btnCheck = document.getElementById('btn-check-sub');
    if (btnCheck) {
        btnCheck.addEventListener('click', verificarYActivarModo);
    }
});

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
// ============================================
// LÓGICA PARA AÑADIR PLATOS (ADMIN)
// ============================================

const addDishForm = document.getElementById('add-dish-form');
const dishFeedback = document.getElementById('add-dish-feedback');

if (addDishForm) {
    addDishForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Capturamos los datos del formulario
        const nuevoPlato = {
            ID: Date.now(), // ID único basado en tiempo
            Nombre: document.getElementById('dish-name').value.trim(),
            Categoria: document.getElementById('dish-category').value.trim(),
            Precio: document.getElementById('dish-price').value,
            Imagen_Url: document.getElementById('dish-img-url').value.trim(),
            Descripcion: document.getElementById('dish-desc').value.trim()
        };

        dishFeedback.textContent = "Subiendo plato al menú...";
        dishFeedback.style.color = "var(--color-primary)";

        try {
            // 2. Llamamos a la función que ya tenías en el script
            const resultado = await agregarPlato(nuevoPlato);

            if (resultado) {
                dishFeedback.textContent = "✅ ¡Plato añadido con éxito!";
                dishFeedback.style.color = "var(--color-primary-dark)";
                addDishForm.reset(); // Limpiamos el formulario
                
                // Opcional: Recargar el menú si estás en la misma página
                if (typeof iniciarPagina === 'function') iniciarPagina();
            }
        } catch (error) {
            console.error("Error al añadir plato:", error);
            dishFeedback.textContent = "❌ Error al conectar con la base de datos.";
            dishFeedback.style.color = "#d64541";
        }
    });
}
