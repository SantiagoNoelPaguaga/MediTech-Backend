import jwt from "jsonwebtoken";

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

const authenticateToken = (req, res, next) => {
  const token = getTokenFrom(req);
  let decodedToken;

  try {
    if (!token) {
      throw new Error("Token no proporcionado");
    }

    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    console.log(error.name, error.message);

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    return res.redirect("/");
  }

  if (!decodedToken.id) {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.redirect("/");
  }

  req.user = {
    id: decodedToken.id,
    dni: decodedToken.dni,
    rol: decodedToken.rol,
  };

  next();
};

export { authenticateToken };
