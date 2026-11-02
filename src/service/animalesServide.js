// src/service/animalesServide.js

import api from "./api";

// ----------------------------------------------------
// Crear FormData para crear o editar un animal
// ----------------------------------------------------

const crearFormDataAnimal = (datos) => {
  // Si ya recibimos un FormData, lo usamos directamente.
  if (datos instanceof FormData) {
    return datos;
  }

  const formData = new FormData();

  const campos = [
    'edadMeses','videoUrl','compatibleNinios','compatiblePerros','compatibleGatos','historiaPublica','historiaAdopcion',
    "nombre",
    "estado",
    "tipo",
    "historia",
    "imageUrl",
    "publicado",
    "adoptado",
    "sexo",
    "edad",
    "tamanio",
    "raza",
    "personalidad",
    "estadoSalud",
    "requisitos",
    "localidad",
    "vacunado",
    "castrado",
    "desparasitado",

    // Para la edición
    "eliminarImagen",
  ];

  campos.forEach((campo) => {
    const valor = datos?.[campo];

    if (
      valor !== undefined &&
      valor !== null
    ) {
      formData.append(
        campo,
        String(valor)
      );
    }
  });

  // Multer espera la imagen con el nombre "imagen".
  if (datos?.imagen instanceof File) {
    formData.append(
      "imagen",
      datos.imagen
    );
  }

  if(Array.isArray(datos.fotosExistentes))formData.append('fotosExistentes',JSON.stringify(datos.fotosExistentes));
  for(const file of datos.fotosNuevas||[])if(file instanceof File)formData.append('fotos',file);
  return formData;
};

// ====================================================
// ANIMALES PÚBLICOS
// ====================================================

// Devuelve:
// { page, pageSize, total, totalPages, items }
export const obtenerAnimalesPublicos = async (
  parametros = {}
) => {
  try {
    const { data } = await api.get(
      "/api/animales",
      {
        params: parametros,
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudieron obtener los animales públicos.";

    throw new Error(mensaje);
  }
};

// Obtener detalle público
export const obtenerAnimalPublicoPorId = async (
  id
) => {
  try {
    const { data } = await api.get(
      `/api/animales/${id}`
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo obtener el animal.";

    throw new Error(mensaje);
  }
};

// ====================================================
// ANIMALES DE LA ORGANIZACIÓN
// ====================================================

// Obtener animales de la organización autenticada
export const obtenerMisAnimales = async (
  parametros = {}
) => {
  try {
    const { data } = await api.get(
      "/api/admin/animales",
      {
        params: parametros,
      }
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudieron obtener los animales de la organización.";

    throw new Error(mensaje);
  }
};

// Obtener un animal propio por ID
export const obtenerMiAnimalPorId = async (
  id
) => {
  try {
    const { data } = await api.get(
      `/api/admin/animales/${id}`
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo obtener el animal.";

    throw new Error(mensaje);
  }
};

// ====================================================
// CREAR ANIMAL
// ====================================================

export const crearAnimal = async (
  datos
) => {
  try {
    const formData =
      crearFormDataAnimal(datos);

    const { data } = await api.post(
      "/api/admin/animales",
      formData
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo crear el animal.";

    throw new Error(mensaje);
  }
};

// ====================================================
// ACTUALIZAR ANIMAL
// ====================================================

export const actualizarAnimal = async (
  id,
  datos
) => {
  try {
    const formData =
      crearFormDataAnimal(datos);

    const { data } = await api.put(
      `/api/admin/animales/${id}`,
      formData
    );

    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo actualizar el animal.";

    throw new Error(mensaje);
  }
};

// ====================================================
// ELIMINAR ANIMAL
// ====================================================

export const eliminarAnimal = async (
  id
) => {
  try {
    await api.delete(
      `/api/admin/animales/${id}`
    );

    return true;
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "No se pudo eliminar el animal.";

    throw new Error(mensaje);
  }
};

// ====================================================
// MARCAR COMO ADOPTADO
// ====================================================

export const marcarAnimalComoAdoptado =
  async (id) => {
    try {
      const { data } = await api.patch(
        `/api/admin/animales/${id}/adoptar`
      );

      return data;
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "No se pudo marcar el animal como adoptado.";

      throw new Error(mensaje);
    }
  };

// ====================================================
// ALIAS PARA COMPONENTES ANTERIORES
// ====================================================

export const getAnimales = async (
  parametros = {}
) => {
  const respuesta =
    await obtenerAnimalesPublicos(
      parametros
    );

  return Array.isArray(respuesta)
    ? respuesta
    : Array.isArray(respuesta?.items)
      ? respuesta.items
      : [];
};

// Lo utiliza EditarAnimal.jsx.
// Apunta al endpoint privado de la organización.
export const obtenerAnimalPorId =
  obtenerMiAnimalPorId;

// Alias público anterior
export const getAnimalById =
  obtenerAnimalPublicoPorId;

export const adoptarAnimal =
  marcarAnimalComoAdoptado;