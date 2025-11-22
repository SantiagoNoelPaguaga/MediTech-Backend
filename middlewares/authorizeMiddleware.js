export function authorizeRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("No autenticado");
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).send("No tienes permiso para esta acción");
    }

    next();
  };
}
