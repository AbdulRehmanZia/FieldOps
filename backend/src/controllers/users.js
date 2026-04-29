import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { success, error } from '../utils/response.js';

export async function getUsers(req, res, next) {
  try {
    const { role } = req.query;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can view users', 403);
    }

    let whereClause = { isActive: true };
    if (role) {
      whereClause.role = role;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return success(res, users);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Can view own profile or ADMIN can view any
    if (id !== userId && userRole !== 'ADMIN') {
      return error(res, 'Forbidden: You can only view your own profile', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { email, password, name, role } = req.validated;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can create users', 403);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return success(res, user, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, password } = req.validated;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Can update own profile or ADMIN can update any (except role)
    if (id !== userId && userRole !== 'ADMIN') {
      return error(res, 'Forbidden: You can only update your own profile', 403);
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({ where: { id } });
    if (!currentUser) {
      return error(res, 'User not found', 404);
    }

    // Prevent users from changing their own role
    if (id === userId && req.validated.role && req.validated.role !== currentUser.role) {
      return error(res, 'You cannot change your own role', 400);
    }

    // Build update data
    const updateData = { name };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only ADMIN can change role
    if (userRole === 'ADMIN' && req.validated.role) {
      updateData.role = req.validated.role;
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return success(res, updatedUser);
  } catch (err) {
    next(err);
  }
}
