//  Clases 
class Producto {
    constructor(id, nombre, precio, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}

class ItemCarrito {
    constructor(producto, cantidad) {
        this.id = producto.id;
        this.nombre = producto.nombre;
        this.precio = producto.precio;
        this.cantidad = cantidad;
        this.subtotal = this.precio * this.cantidad;
    }

    actualizarCantidad(nuevaCantidad) {
        this.cantidad = nuevaCantidad;
        this.subtotal = this.precio * nuevaCantidad;
    }
}

//  Datos 
const productos = [];

async function cargarProductos() {
    try {
        const res = await fetch("data/productos.json");
        if (!res.ok) throw new Error("No se pudo cargar productos");
        const data = await res.json();
        productos.push(...data);
        renderizarProductos();
    } catch (error) {
        mensajeError.textContent = "❌ Error al cargar los productos.";
        console.warn(error);
    }
}

//  Variables 
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//  Elementos del DOM 
const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-container");
const subtotalDOM = document.getElementById("subtotal");
const finalizarBtn = document.getElementById("finalizar-compra");
const vaciarBtn = document.getElementById("vaciar-carrito");
const primeraCompraCheckbox = document.getElementById("primera-compra");
const mensajeFinal = document.getElementById("mensaje-final");
const mensajeError = document.getElementById("mensaje-error");

// Funciones 

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderizarProductos() {
    productosContainer.innerHTML = "";
    productos.forEach((prod) => {
        const div = document.createElement("div");
        div.classList.add("producto");

        const h3 = document.createElement("h3");
        h3.textContent = prod.nombre;

        const pCategoria = document.createElement("p");
        pCategoria.textContent = `Categoría: ${prod.categoria}`;

        const pPrecio = document.createElement("p");
        pPrecio.textContent = `Precio: $${prod.precio}`;

        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `cantidad-${prod.id}`;
        inputCantidad.setAttribute("aria-label", `Cantidad para ${prod.nombre}`);
        inputCantidad.addEventListener("input", () => {
            if (inputCantidad.value < 0) inputCantidad.value = 0;
        });

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", () => agregarAlCarrito(prod.id));

        div.append(h3, pCategoria, pPrecio, inputCantidad, boton);
        productosContainer.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find((p) => p.id === id);
    const cantidadInput = document.getElementById(`cantidad-${id}`);
    const cantidad = parseInt(cantidadInput.value);

    if (!cantidad || cantidad <= 0) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debés ingresar al menos 1 unidad.',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top',
        toast: true
    });
    return;
}


    const existente = carrito.find((item) => item.id === id);
    if (existente) {
        existente.actualizarCantidad(existente.cantidad + cantidad);
    } else {
        carrito.push(new ItemCarrito(producto, cantidad));
    }

    guardarCarrito();
    renderizarCarrito();

    cantidadInput.value = 0;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
}

function renderizarCarrito() {
    carritoContainer.innerHTML = "";

    carrito.forEach((prod, index) => {
        const div = document.createElement("div");
        div.classList.add("producto-carrito");

        div.innerHTML = `
            <p>${prod.nombre} x${prod.cantidad} - $${(prod.precio * prod.cantidad).toFixed(2)}</p>
            <button class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${prod.nombre} del carrito">&times;</button>
        `;

        carritoContainer.appendChild(div);
    });

    document.querySelectorAll(".btn-eliminar").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            eliminarDelCarrito(index);
        });
    });

    actualizarSubtotal();
}

function actualizarSubtotal() {
    let subtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

    if (primeraCompraCheckbox.checked && subtotal > 0) {
        const descuento = subtotal * 0.10;
        const totalConDescuento = subtotal - descuento;
        subtotalDOM.innerHTML = `
            <span style="text-decoration: line-through; color: grey;">Subtotal: $${subtotal.toFixed(2)}</span><br>
            <span style="color: green; font-weight: bold;">Total con 10% de descuento: $${totalConDescuento.toFixed(2)}</span>
        `;
    } else {
        subtotalDOM.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mensajeError.textContent = "El carrito está vacío.";
        return;
    }

    mensajeError.textContent = "";
    const esPrimera = primeraCompraCheckbox.checked;
    let total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    let totalFinal = esPrimera ? total * 0.9 : total;

    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    subtotalDOM.textContent = "";

    // Destildar checkbox de primera compra
    primeraCompraCheckbox.checked = false;

    // Uso SweetAlert2 para el mensaje final
    Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        html: `<p>Total pagado: <strong>$${totalFinal.toFixed(2)}</strong></p><p>🙏 Gracias por tu compra en Teje y Desteje</p>`,
        confirmButtonText: 'Cerrar'
    });

    mensajeFinal.innerHTML = "";
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    subtotalDOM.textContent = "";
    mensajeFinal.innerHTML = "";
    mensajeError.textContent = "";

    primeraCompraCheckbox.checked = false;
}

//  Eventos 
primeraCompraCheckbox.addEventListener('change', () => {
    renderizarCarrito();
});

finalizarBtn.addEventListener("click", finalizarCompra);
vaciarBtn.addEventListener("click", vaciarCarrito);

//  Inicialización 
cargarProductos();
renderizarCarrito();
