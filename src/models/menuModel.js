import pizzas from "../data/pizzas.json" with { type: "json" };
import bebidas from "../data/bebidas.json" with { type: "json" };

const menu = { pizzas, bebidas };

export const getMenu = (tipo) => {
  return tipo ? menu[tipo] : menu;
};


