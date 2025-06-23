export const verificarTipoUsuario = (tipoUsuario: string): boolean => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);

      // Verifica si el campo "type.name" es el tipo de usuario esperado
      return userObj?.type?.name === tipoUsuario;
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      return false;
    }
  }

  return false;
};
