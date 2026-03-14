import { Router } from "express";
import menuRoute from "./menuRoute.js";

const routes = Router();

routes.get("/", (req, res) => {
  res.status(200).send("API Pizzalab funcionando 🍕");
});

routes.use("/menu", menuRoute);

export default routes;