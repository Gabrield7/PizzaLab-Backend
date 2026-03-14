import usuarios from "../data/usuarios.json" with { type: "json" };

export const getUsuario= (id) => {
  return id ? usuarios.find((user) => user.id === id) : usuarios;
};