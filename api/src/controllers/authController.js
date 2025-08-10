const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/auth");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      return res
        .status(409)
        .json({
          error: {
            code: "USER_EXISTS",
            message: "User with this email already exists.",
          },
        });
    }
    res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Could not register user." },
      });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res
      .status(500)
      .json({ error: { code: "SERVER_ERROR", message: "Login failed." } });
  }
};
