import { Router } from "express";
import menuRoute from "./menuRoute.js";
import usuarioRoute from "./usuarioRoute.js";
import pedidoRoute from "./pedidoRoute.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.status(200).send("API Pizzalab funcionando 🍕");
});

routes.use("/menu", menuRoute);
routes.use("/usuarios", usuarioRoute);
routes.use("/pedidos", pedidoRoute);

export default routes;
