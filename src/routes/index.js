import { Router } from "express";
import menuRoute from "./menuRoute.js";
import usuarioRoute from "./usuarioRoute.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.status(200).send("API Pizzalab funcionando 🍕");
});

routes.use("/menu", menuRoute);
routes.use("/usuarios", usuarioRoute);

export default routes;