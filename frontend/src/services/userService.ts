import api from "./api";

/**
 * Elimina un usuario por su ID.
 * @param userId - El ID del usuario a eliminar.
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};
