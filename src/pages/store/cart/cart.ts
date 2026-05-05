// src/pages/store/cart/cart.ts

import { PRODUCTS } from "../../../data/data";
import type { ICartItem } from "../../../types/ICarrito"

// --- REFERENCIAS AL DOM ---
const cartItemsContainer = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("empty-cart-message");
const cartTotalElement = document.getElementById("cart-total-price");

// --- FUNCIÓN PRINCIPAL DE RENDERIZADO ---
function renderCart(): void {
    // 1. Leer carrito desde localStorage
    const cart: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Validaciones de seguridad
    if (!cartItemsContainer || !emptyCartMessage || !cartTotalElement) {
        console.error("No se encontraron los contenedores del carrito en el DOM");
        return;
    }

    // 2. Limpiar contenido previo
    cartItemsContainer.innerHTML = "";

    // 3. Manejar carrito vacío
    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        cartTotalElement.textContent = "$0.00";
        return;
    } else {
        emptyCartMessage.style.display = "none";
    }

    let total = 0;

    // 4. Iterar sobre cada ítem del carrito
    cart.forEach((cartItem) => {
        // Buscar el producto completo en el array de datos
        // Usamos .find() porque buscamos por ID único
        const product = PRODUCTS.find((p) => p.id === cartItem.productId);

        // Si el producto no existe (ej. fue eliminado de data.ts), lo saltamos
        if (!product) {
            console.warn(`Producto ID ${cartItem.productId} no encontrado en datos.`);
            return;
        }

        // Calcular subtotal de este ítem
        const subtotal = product.precio * cartItem.cantidad;
        total += subtotal;

        // --- CREAR ELEMENTOS HTML ---
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item"); // Clase para CSS

        // Imagen
        const img = document.createElement("img");
        img.src = `/src/assets/images/${product.imagen}`;
        img.alt = product.nombre;
        img.classList.add("cart-item-img");

        // Info (Nombre y Precio Unitario)
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("cart-item-info");
        
        const name = document.createElement("h3");
        name.textContent = product.nombre;
        
        const price = document.createElement("p");
        price.textContent = `Precio unitario: $${product.precio.toLocaleString('es-AR')}`;

        infoDiv.appendChild(name);
        infoDiv.appendChild(price);

        // Controles (Cantidad y Subtotal)
        const controlsDiv = document.createElement("div");
        controlsDiv.classList.add("cart-item-controls");

        // Input de cantidad (para modificar)
        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.value = cartItem.cantidad.toString();
        qtyInput.min = "1";
        qtyInput.classList.add("qty-input");
        
        // Evento para actualizar cantidad
        qtyInput.addEventListener("change", (e) => {
            const newQty = parseInt((e.target as HTMLInputElement).value);
            if (newQty > 0) {
                updateCartItemQuantity(product.id, newQty);
            }
        });

        // Subtotal
        const subtotalElement = document.createElement("p");
        subtotalElement.classList.add("cart-item-subtotal");
        subtotalElement.textContent = `Subtotal: $${subtotal.toLocaleString('es-AR')}`;

        // Botón Eliminar
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Eliminar";
        removeBtn.classList.add("btn-remove");
        removeBtn.onclick = () => {
            removeCartItem(product.id);
        };

        controlsDiv.appendChild(qtyInput);
        controlsDiv.appendChild(subtotalElement);
        controlsDiv.appendChild(removeBtn);

        // Ensamblar tarjeta del ítem
        itemElement.appendChild(img);
        itemElement.appendChild(infoDiv);
        itemElement.appendChild(controlsDiv);

        // Agregar al contenedor principal
        cartItemsContainer.appendChild(itemElement);
    });

    // 5. Mostrar Total General (HU-P1-05)
    cartTotalElement.textContent = `$${total.toLocaleString('es-AR')}`;
}

// --- FUNCIONES DE ACTUALIZACIÓN ---

// Actualizar cantidad de un ítem
function updateCartItemQuantity(productId: number, newQuantity: number): void {
    let cart: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.cantidad = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // Re-renderizar para actualizar totales
    }
}

// Eliminar un ítem del carrito
function removeCartItem(productId: number): void {
    let cart: ICartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Filtrar para quitar el producto
    cart = cart.filter(i => i.productId !== productId);
    
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart(); // Re-renderizar
}

// --- INICIALIZACIÓN ---
// Ejecutar al cargar la página
renderCart();