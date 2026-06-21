export default function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!resultado.success) {
      const erros = resultado.error.issues.map((i) => ({
        campo: i.path.join('.'),
        mensagem: i.message,
      }));
      return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
    }

    req.validado = resultado.data;
    next();
  };
}