import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    experienceLevel: user.experienceLevel,
    createdAt: user.createdAt,
  };
}

export async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return response.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return response.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = createToken(user._id);

    return response.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email?.trim() || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return response.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(request, response) {
  return response.status(200).json({
    success: true,
    user: formatUser(request.user),
  });
}

export async function updateProfile(request, response, next) {
  try {
    const { name, targetRole, experienceLevel } = request.body;

    const user = await User.findById(request.user._id);

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return response.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (targetRole !== undefined) {
      user.targetRole = targetRole.trim() || "Software Engineer";
    }

    if (experienceLevel !== undefined) {
      const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

      if (!allowedLevels.includes(experienceLevel)) {
        return response.status(400).json({
          success: false,
          message: "Invalid experience level",
        });
      }

      user.experienceLevel = experienceLevel;
    }

    await user.save();

    return response.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(request, response, next) {
  try {
    const { currentPassword, newPassword } = request.body;

    if (!currentPassword || !newPassword) {
      return response.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    if (newPassword.length < 8) {
      return response.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters",
      });
    }

    if (currentPassword === newPassword) {
      return response.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const user = await User.findById(request.user._id).select("+password");

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordIsCorrect = await user.comparePassword(currentPassword);

    if (!passwordIsCorrect) {
      return response.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(error);
  }
}
