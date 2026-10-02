import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}
