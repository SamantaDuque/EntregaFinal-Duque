//Array con productos
const productos = [
    { id: 1, nombre: "Frida Amigurumi", precio: 1800, categoria: "tutorial" },
    { id: 2, nombre: "Bufanda Infinita", precio: 2000, categoria: "tutorial" },
    { id: 3, nombre: "Merino Sedificada", precio: 4800, categoria: "lana" },
    { id: 4, nombre: "Familia", precio: 1500, categoria: "lana" },
    { id: 5, nombre: "Groot", precio: 35000, categoria: "amigurumi" },
    { id: 6, nombre: "Spiderman", precio: 40000, categoria: "amigurumi" },
];

//Array con carrito de compras vacio
const carrito = [];

//Función mostrarMenú
function mostrarMenu() {
    let menu = "📋 PRODUCTOS DISPONIBLES:\n\n";
    for (let i = 0; i < productos.length; i++) {
    menu += `• ${productos[i].id} - ${productos[i].nombre} $${productos[i].precio}  (${productos[i].categoria})\n`;
    }
    return menu;
}

//Función agregarAlCarrito
function agregarAlCarrito(id, cantidad) {
    const producto = productos.find((p) => p.id === id);

    if (producto) {
    const itemCarrito = {
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
      subtotal: producto.precio * cantidad,
    };

    carrito.push(itemCarrito);

    console.log(`✅ Se agregó al carrito: ${producto.nombre} x ${cantidad}`);
    } else {
    alert("❌ Producto no encontrado. Ingresá un número válido.");
    }
}

//Función calcularTotal (calcula el total de la compra y retorna el monto total)
function calcularTotal() {
    let total = 0;
    carrito.forEach((item) => {
    total += item.subtotal;
    });
    return total;
}

//Función aplicarDescuento (aplica 30% de descuento por primera compra y retorna el nuevo total)
function aplicarDescuento(total) {
    const respuesta = prompt("Es tu primera compra? (Si/No)").toLowerCase();

    if (respuesta === "si") {
    const descuento = total * 0.3;
    const totalConDescuento = total - descuento;
    alert(
        `🎉 ¡Tenés un 30% de descuento! Total con descuento: $${totalConDescuento}`
    );
    return totalConDescuento;
    } else {
    return total;
    }
}

//Función mostrarResumen (Muestra todos los productos comprados y monto total con descuento aplicado si es que corresponde)
function mostrarResumen() {
    let resumen = "🛒 RESUMEN DE COMPRA:\n\n";
    let total = 0;

    carrito.forEach((item) => {
    resumen += `• ${item.cantidad} x ${item.nombre} - $${item.precio} c/u = $${item.subtotal}\n`;
    total += item.subtotal;
    });

    const totalConDescuento = aplicarDescuento(total);

    resumen += `\n💰 Total a pagar: $${totalConDescuento}`;
    alert(resumen);
}

//Lógica principal de la compra

let seguirComprando = true;

while (seguirComprando) {
    const menu = mostrarMenu();
    const idIngresado = parseInt(
    prompt(`Ingresa el número del producto que deseas comprar:\n\n${menu}`)
    );

    const producto = productos.find((p) => p.id === idIngresado);

    if (producto) {
    const cantidad = parseInt(
        prompt(`¿Cuántos "${producto.nombre}" querés agregar al carrito?`)
    );

    if (!isNaN(cantidad) && cantidad > 0) {
        agregarAlCarrito(idIngresado, cantidad);
    } else {
        alert("❌ Cantidad inválida. Intentálo de nuevo.");
    }
    } else {
    alert("❌ Número inválido. Elegí uno de los productos del menú.");
    }

  // Si hay productos en el carrito, pregunto si quiere finalizar compra
    if (carrito.length > 0) {
    let mensajeParcial = "🛒 Carrito de compras:\n\n";

    carrito.forEach((item) => {
        mensajeParcial += `• ${item.cantidad} x ${item.nombre} - $${item.precio} c/u = $${item.subtotal}\n`;
    });

    mensajeParcial += `Querés seguir comprando?`; 
    seguirComprando = confirm(mensajeParcial);
    }
}

mostrarResumen();
