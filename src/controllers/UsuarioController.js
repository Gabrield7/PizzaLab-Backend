import { getUsuario } from "../models/usuarioModel.js";

class UsuarioController {
  static listarUsuario(req, res) {
    const id = parseInt(req.params.id);
    const usuario = getUsuario(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    return res.status(200).json(usuario);
  }

  static listarUsuarios(req, res) {
    const usuarios = getUsuario();

    if (!usuarios) {
      return res.status(400).json({ error: "Não foi possível listar usuários!" });
    }

    return res.status(200).json(usuarios);
  }
}

export { UsuarioController };
