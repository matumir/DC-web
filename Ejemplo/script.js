const btnAgregar = document.getElementById("btnAgregar");
const btnWhatsapp = document.getElementById("btnWhatsapp");
const listaCarrito = document.getElementById("listaCarrito");
const totalHTML = document.getElementById("total");
const inputCantidad = document.getElementById("cantidad");
const selectTalle = document.getElementById("talle");

const producto = {
  nombre: "Zapatilla OMBU Sneaker",
};

let carrito = [];

/* AGREGAR AL CARRITO */
btnAgregar.addEventListener("click", () => {
  const cantidad = parseInt(inputCantidad.value);
  const talleSeleccionado = selectTalle.value;

  if (!talleSeleccionado) {
    alert("Por favor, seleccioná un talle");
    return;
  }

  if (cantidad <= 0 || isNaN(cantidad)) {
    alert("Cantidad inválida");
    return;
  }

  const itemExistente = carrito.find(item =>
    item.nombre === producto.nombre && item.talle === talleSeleccionado
  );

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      nombre: producto.nombre,
      talle: talleSeleccionado,
      cantidad: cantidad
    });
  }

  renderCarrito();
  inputCantidad.value = 1;
  selectTalle.value = "";
});

/* RENDER DEL CARRITO */
function renderCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const li = document.createElement("li");
    li.textContent = `${item.nombre} | Talle ${item.talle} | x${item.cantidad}`;
    listaCarrito.appendChild(li);
  });

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>No hay productos en el carrito</li>";
  }
}

/* WHATSAPP */
btnWhatsapp.addEventListener("click", finalizarCompra);

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola! Quiero solicitar cotización:%0A%0A";
  let total = 0;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `- ${item.nombre} | Talle ${item.talle} | x${item.cantidad}%0A`;

  });

  const telefono = "5493564333963"; // Reemplazar por el real
  const url = `https://wa.me/${telefono}?text=${mensaje}`;

  window.open(url, "_blank");
}
