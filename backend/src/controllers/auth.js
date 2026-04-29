import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { signToken } from '../utils/jwt.js';
import { success, error } from '../utils/response.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.validated;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role CLIENT by default
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CLIENT',
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return success(res, user, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return error(res, 'Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return error(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = signToken({ id: user.id, role: user.role });

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return success(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token');
    return success(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function createTechnicianOrAdmin(req, res, next) {
  try {
    const { email, password, name, role } = req.validated;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can create technicians or admins', 403);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with specified role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return success(res, user, 201);
  } catch (err) {
    next(err);
  }
}
