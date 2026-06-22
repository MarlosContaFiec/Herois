import { verificarToken } from "../utils/jwt.js";

export default function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const token = header.split(" ")[1];
    req.usuario = verificarToken(token);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
