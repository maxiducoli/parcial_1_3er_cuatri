// src/types/product.ts

import type { ICategoria } from "../types/ICategoria";
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
    categorias: ICategoria[]; // Array de categorías
}