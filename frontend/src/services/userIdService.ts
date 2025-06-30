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
