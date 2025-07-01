import api from "./api";

// Función para decodificar el token JWT
export const getUserId = (): string | null => {
  const userStr = localStorage.getItem("user");

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);

      return userObj?.id || null;
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      return null;
    }
  }
  return null;
};

/**
 * Elimina un usuario por su ID.
 * @param userId - El ID del usuario a eliminar.
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};
