import { getMenu } from "../models/menuModel.js";

export const listarMenu = (req, res) => {
  const tipo = req.params.tipo;

  if(tipo){   
    const menu = getMenu(tipo);

    if(!menu) return res.status(404).json({ error: "Tipo de menu não encontrado!" });
    
    return res.status(200).json(menu);
  }

  const menu = getMenu();
  return res.status(200).json(menu);
};



