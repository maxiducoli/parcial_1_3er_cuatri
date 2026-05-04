// src/pages/store/home/home.ts

// --- IMPORTACIONES ---
import { getCategories, PRODUCTS } from "../../../data/data";
import type { IProduct } from "../../../types/IProduct";
import type { ICategoria } from "../../../types/ICategoria";
import type { ICartItem } from "../../../types/ICarrito";

// --- REFERENCIAS AL DOM ---
const categoriesContainer = document.getElementById("categories-panel");
const productsContainer = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input") as HTMLInputElement;

// --- ESTADO LOCAL (Para saber qué filtro o búsqueda está activa) ---
let currentCategoryFilter: number | null = null;
let currentSearchText: string = "";

// --- 1. RENDERIZADO DE CATEGORÍAS ---
function renderCategories(categories: ICategoria[]): void {
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = ""; // Limpiar

    const title = document.createElement("h2");
    title.textContent = "Categorías";
    categoriesContainer.appendChild(title);

    // Botón "Todas" para resetear filtros
    const allBtn = document.createElement("button");
    allBtn.textContent = "Ver Todo";
    allBtn.classList.add("category-item");
    allBtn.onclick = () => {
        currentCategoryFilter = null;
        renderFilteredProducts(); // Re-renderizar productos sin filtro
    };
    categoriesContainer.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.nombre;
        btn.classList.add("category-item");
        btn.onclick = () => {
            currentCategoryFilter = cat.id;
            renderFilteredProducts(); // Re-renderizar con filtro
        };
        categoriesContainer.appendChild(btn);
    });
}

// --- 2. RENDERIZADO DE PRODUCTOS ---
function renderProducts(productsToRender: IProduct[]): void {
    if (!productsContainer) return;

    productsContainer.innerHTML = ""; // Limpiar grilla anterior

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    productsToRender.forEach(product => {
        // Crear tarjeta
        const card = document.createElement("div");
        card.classList.add("product-card"); // Clase para tu CSS

        // Imagen: Concatenamos la ruta base con el nombre del archivo
        const img = document.createElement("img");
        // ⚠️ Ajusta esta ruta si tus imágenes están en otra carpeta.
        // Asumiendo estructura: src/assets/images/
        img.src = `/src/assets/images/${product.imagen}`; 
        img.alt = product.nombre;
        img.classList.add("product-img");

        // Contenido
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("product-info");

        const name = document.createElement("h3");
        name.textContent = product.nombre;

        const desc = document.createElement("p");
        desc.textContent = product.descripcion;
        desc.style.fontSize = "0.9em";
        desc.style.color = "#666";

        const price = document.createElement("p");
        price.textContent = `$${product.precio.toLocaleString('es-AR')}`;
        price.style.fontWeight = "bold";
        price.style.fontSize = "1.2em";

        // Botón Agregar
        const btnAdd = document.createElement("button");
        btnAdd.textContent = "Agregar al Carrito";
        btnAdd.classList.add("btn-add");
        
        // Evento de agregar (Lógica HU-P1-03)
        btnAdd.onclick = () => {
            addToCart(product.id);
            // Feedback visual simple
            btnAdd.textContent = "¡Agregado!";
            setTimeout(() => btnAdd.textContent = "Agregar al Carrito", 1500);
        };

        // Ensamblar tarjeta
        infoDiv.appendChild(name);
        infoDiv.appendChild(desc);
        infoDiv.appendChild(price);
        infoDiv.appendChild(btnAdd);

        card.appendChild(img);
        card.appendChild(infoDiv);

        // Agregar al contenedor principal
        productsContainer.appendChild(card);
    });
}

// --- 3. LÓGICA DE FILTRADO Y BÚSQUEDA (HU-P1-01 y HU-P1-02) ---
function renderFilteredProducts(): void {
    // 1. Empezar con todos los productos disponibles
    let filtered = PRODUCTS.filter(p => p.disponible);

    // 2. Aplicar filtro de categoría si existe
    if (currentCategoryFilter !== null) {
        filtered = filtered.filter(p => 
            p.categorias.some(c => c.id === currentCategoryFilter)
        );
    }

    // 3. Aplicar filtro de búsqueda si hay texto
    if (currentSearchText.trim() !== "") {
        const searchLower = currentSearchText.toLowerCase();
        filtered = filtered.filter(p => 
            p.nombre.toLowerCase().includes(searchLower)
        );
    }

    // 4. Renderizar el resultado
    renderProducts(filtered);
}

// --- 4. EVENTOS DE INTERACCIÓN ---
// Escuchar cuando el usuario escribe en el buscador
searchInput.addEventListener("input", (e) => {
    // e.target es el input, casteamos para acceder a .value
    currentSearchText = (e.target as HTMLInputElement).value;
    renderFilteredProducts();
});

// ... (Mantén tus imports y variables anteriores) ...

// --- 5. LÓGICA DEL CARRITO (HU-P1-03) ---
function addToCart(productId: number): void {
    // 1. Obtener carrito actual desde localStorage
    // Usamos '|| []' para que si es null (primera vez), empiece con un array vacío.
    let cart: ICartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

    // 2. Buscar si el producto ya existe en el carrito
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        // Caso A: Ya existe, incrementamos cantidad
        existingItem.cantidad += 1;
        console.log(`Producto ${productId} actualizado. Nueva cantidad: ${existingItem.cantidad}`);
    } else {
        // Caso B: No existe, lo agregamos con cantidad 1
        const newItem: ICartItem = {
            productId: productId,
            cantidad: 1
        };
        cart.push(newItem);
        console.log(`Producto ${productId} agregado al carrito.`);
    }

    // 3. Guardar el carrito actualizado en localStorage
    // localStorage solo acepta strings, por eso usamos JSON.stringify
    localStorage.setItem('cart', JSON.stringify(cart));

    // Feedback visual al usuario (Opcional, pero recomendado para UX)
    alert("Producto agregado al carrito correctamente.");
}

// Ejecutar al cargar la página
renderCategories(getCategories());
renderFilteredProducts();