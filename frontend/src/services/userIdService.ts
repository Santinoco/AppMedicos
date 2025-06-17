// Función para decodificar el token JWT
export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar la parte del payload
      return payload.id; // Retornar el ID del usuario
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
  return null;
};
