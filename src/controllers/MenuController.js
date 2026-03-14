import { getMenu } from "../models/menuModel.js";

class MenuController {
  static listarMenu(req, res) {
    const tipo = req.params.tipo;
    const menu = getMenu(tipo);

    if (!menu) {
      return res.status(404).json({ error: "Tipo de menu não encontrado" });
    }

    return res.status(200).json(menu);
  }
}

export { MenuController };

