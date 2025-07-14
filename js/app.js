// Array con los productos disponibles
const productos = [
    { id: 1, nombre: " 📃 Frida Amigurumi", precio: 1800, categoria: "Tutorial" },
    { id: 2, nombre: " 📃 Bufanda Infinita", precio: 2000, categoria: "Tutorial" },
    { id: 3, nombre: " 🧶 Merino Sedificada", precio: 4800, categoria: "Insumos" },
    { id: 4, nombre: " 🧶 Familia", precio: 1500, categoria: "Insumos" },
    { id: 5, nombre: " 🧸 Groot", precio: 35000, categoria: "Amigurumis" },
    { id: 6, nombre: " 🧸 Spiderman", precio: 40000, categoria: "Amigurumis" },
];

// Array del carrito, si hay datos en localStorage los traemos
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Captura de elementos del DOM
const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-container");
const subtotalDOM = document.getElementById("subtotal");
const finalizarBtn = document.getElementById("finalizar-compra");
const vaciarBtn = document.getElementById("vaciar-carrito");
const primeraCompraCheckbox = document.getElementById("primera-compra");
const mensajeFinal = document.getElementById("mensaje-final");


// Función que renderiza todos los productos en pantalla
function renderProductos() {
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

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", () => agregarAlCarrito(prod.id));

        div.append(h3, pCategoria, pPrecio, inputCantidad, boton);
        productosContainer.appendChild(div);
    });
}


// Función que agrega un producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find((p) => p.id === id);
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);

    // Validación para evitar agregar productos con cantidad 0
    if (!cantidad || cantidad <= 0) {
        alert("⚠️ Debés ingresar al menos 1 unidad.");
        return;
    }

    const existente = carrito.find((item) => item.id === id);
    if (existente) {
        existente.cantidad += cantidad;
        existente.subtotal = existente.precio * existente.cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
            subtotal: producto.precio * cantidad
        });
    }

    guardarCarrito();
    renderCarrito();
}


// Función que guarda el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Función que muestra el carrito en pantalla
function renderCarrito() {
    carritoContainer.innerHTML = "";
    let total = 0;

    carrito.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.textContent = `${item.cantidad} x ${item.nombre} - $${item.precio} = $${item.subtotal}`;
        carritoContainer.appendChild(div);
        total += item.subtotal;
    });

    subtotalDOM.textContent = `💰 Subtotal: $${total}`;
    mensajeFinal.innerHTML = "";
}


// Función que finaliza la compra
function finalizarCompra() {
    if (carrito.length === 0) return;

    const esPrimera = primeraCompraCheckbox.checked;
    let total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    let totalFinal = esPrimera ? total * 0.7 : total;

    carrito = [];
    guardarCarrito();
    renderCarrito();
    subtotalDOM.textContent = "";

    mensajeFinal.innerHTML = `
        <h3>✅ ¡Compra realizada con éxito!</h3>
        <p>Total pagado: $${totalFinal}</p>
        <p>🙏 Gracias por tu compra en Teje y Desteje</p>
    `;
}


// Función que vacía el carrito y el storage
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();
    subtotalDOM.textContent = "";
    mensajeFinal.innerHTML = "";
}


// Eventos asociados a los botones principales
finalizarBtn.addEventListener("click", finalizarCompra);
vaciarBtn.addEventListener("click", vaciarCarrito);


// Lógica inicial: renderizamos productos y el carrito si ya había algo
renderProductos();
renderCarrito();
