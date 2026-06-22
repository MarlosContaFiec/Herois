import jwt from "jsonwebtoken";

const CHAVE = process.env.JWT_SECRET;

export const gerarToken = (payload) =>
  jwt.sign(payload, CHAVE, { expiresIn: "7d" });

export const verificarToken = (token) => jwt.verify(token, CHAVE);
