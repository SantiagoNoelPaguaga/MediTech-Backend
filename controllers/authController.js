import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Empleado from "../models/EmpleadoModel.js";

const loginEmpleado = async (req, res) => {
  const { dni, password } = req.body;

  try {
    const empleado = await Empleado.obtenerPorDni(dni);

    const passwordCorrect =
      empleado === null
        ? false
        : await bcrypt.compare(password, empleado.passwordHash);

    if (!(empleado && passwordCorrect)) {
      return res.status(401).render("auth/login", {
        modalMessage: "DNI o contraseña inválida",
        modalType: "error",
        modalTitle: "Error",
      });
    }

    const userForToken = {
      dni: empleado.dni,
      id: empleado._id,
      rol: empleado.rol,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });

    if (empleado.mustChangePassword) {
      return res.redirect("cambiarPassword");
    }

    return res.redirect("/index");
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).render("login", {
      modalMessage: "Error interno del servidor",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const formChangePassword = (req, res) => {
  res.render("auth/cambiarPassword", {
    modalMessage: null,
    modalType: "info",
    modalTitle: null,
  });
};

const changePassword = async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  if (!newPassword || newPassword !== confirmNewPassword) {
    return res.render("auth/cambiarPassword", {
      modalMessage: "Las contraseñas no coinciden o están vacías",
      modalType: "error",
      modalTitle: "Error de validación",
    });
  }

  try {
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    await Empleado.cambiarPassword(req.user.id, newHash);

    const userForToken = {
      dni: req.user.dni,
      id: req.user.id,
      rol: req.user.rol,
    };
    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.redirect("/index");
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    return res.render("auth/cambiarPassword", {
      modalMessage: "Ocurrió un error al cambiar la contraseña",
      modalType: "error",
      modalTitle: "Error",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");

  res.redirect("/");
};

export default {
  loginEmpleado,
  formChangePassword,
  changePassword,
  logout,
};
