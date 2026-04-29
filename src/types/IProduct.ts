// src/types/product.ts

// 2. Interfaz Producto
export interface IProduct {
    id: number;
    eliminado: boolean;
    createdAt: string;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string; // Solo el nombre del archivo
    disponible: boolean;
    categorias: ICategory[]; // Array de categorías
}

// 3. Interfaz Carrito
export interface ICartItem {
    productId: number; // Solo guardamos la referencia
    cantidad: number;
}