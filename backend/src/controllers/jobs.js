import { prisma } from '../utils/prisma.js';
import { success, error } from '../utils/response.js';

export async function getJobs(req, res, next) {
  try {
    const { status, technicianId } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = { isActive: true };

    if (userRole === 'ADMIN') {
      // ADMIN can see all jobs with optional filters
      if (status) whereClause.status = status;
      if (technicianId) whereClause.technicianId = technicianId;
    } else if (userRole === 'TECHNICIAN') {
      // TECHNICIAN sees only their assigned jobs
      whereClause.technicianId = userId;
    } else if (userRole === 'CLIENT') {
      // CLIENT sees only their jobs
      whereClause.clientId = userId;
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        notes: { include: { author: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return success(res, jobs);
  } catch (err) {
    next(err);
  }
}

export async function createJob(req, res, next) {
  try {
    const { title, description, clientId, technicianId, scheduledAt } = req.validated;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can create jobs', 403);
    }

    // Verify client exists and is a CLIENT
    const client = await prisma.user.findUnique({ where: { id: clientId } });
    if (!client || client.role !== 'CLIENT') {
      return error(res, 'Invalid client ID', 400);
    }

    // If technicianId provided, verify they exist and are TECHNICIAN
    if (technicianId) {
      const technician = await prisma.user.findUnique({ where: { id: technicianId } });
      if (!technician || technician.role !== 'TECHNICIAN') {
        return error(res, 'Invalid technician ID', 400);
      }
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        clientId,
        technicianId: technicianId || null,
        status: technicianId ? 'ASSIGNED' : 'PENDING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdById: req.user.id,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // If technician assigned, create notification
    if (technicianId) {
      await prisma.notification.create({
        data: {
          userId: technicianId,
          jobId: job.id,
          message: `New job assigned: ${title}`,
        },
      });
    }

    return success(res, job, 201);
  } catch (err) {
    next(err);
  }
}

export async function assignJob(req, res, next) {
  try {
    const { id } = req.params;
    const { technicianId } = req.validated;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can assign jobs', 403);
    }

    // Get job
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || !job.isActive) {
      return error(res, 'Job not found', 404);
    }

    // Verify technician exists and is TECHNICIAN
    const technician = await prisma.user.findUnique({ where: { id: technicianId } });
    if (!technician || technician.role !== 'TECHNICIAN') {
      return error(res, 'Invalid technician ID', 400);
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        technicianId,
        status: 'ASSIGNED',
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Create notification for technician
    await prisma.notification.create({
      data: {
        userId: technicianId,
        jobId: id,
        message: `Job assigned: ${job.title}`,
      },
    });

    return success(res, updatedJob);
  } catch (err) {
    next(err);
  }
}

export async function updateJobStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.validated;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get job
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || !job.isActive) {
      return error(res, 'Job not found', 404);
    }

    // Check permissions
    if (userRole === 'TECHNICIAN' && job.technicianId !== userId) {
      return error(res, 'Forbidden: You can only update your own jobs', 403);
    }

    if (userRole === 'TECHNICIAN') {
      // TECHNICIAN can only set IN_PROGRESS or COMPLETED
      if (!['IN_PROGRESS', 'COMPLETED'].includes(status)) {
        return error(res, 'Technicians can only set jobs to IN_PROGRESS or COMPLETED', 400);
      }
    } else if (userRole !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins and technicians can update job status', 403);
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    // Create notifications for client and admin
    const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    const notificationMessage = `Job status updated to ${status}: ${job.title}`;

    // Notify client
    await prisma.notification.create({
      data: {
        userId: job.clientId,
        jobId: id,
        message: notificationMessage,
      },
    });

    // Notify admins
    for (const admin of adminUsers) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          jobId: id,
          message: notificationMessage,
        },
      });
    }

    return success(res, updatedJob);
  } catch (err) {
    next(err);
  }
}

export async function addJobNote(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.validated;
    const userRole = req.user.role;

    // Check permissions
    if (!['ADMIN', 'TECHNICIAN'].includes(userRole)) {
      return error(res, 'Forbidden: Only admins and technicians can add notes', 403);
    }

    // Get job
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || !job.isActive) {
      return error(res, 'Job not found', 404);
    }

    // Create note
    const note = await prisma.jobNote.create({
      data: {
        content,
        jobId: id,
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return success(res, note, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const { id } = req.params;

    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can delete jobs', 403);
    }

    // Get job
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return error(res, 'Job not found', 404);
    }

    // Soft delete
    const deletedJob = await prisma.job.update({
      where: { id },
      data: { isActive: false },
      include: {
        client: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    return success(res, { message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    next(err);
  }
}

export async function getJobsSummary(req, res, next) {
  try {
    // Verify requester is ADMIN
    if (req.user.role !== 'ADMIN') {
      return error(res, 'Forbidden: Only admins can view job summary', 403);
    }

    const jobCounts = await prisma.job.groupBy({
      by: ['status'],
      where: { isActive: true },
      _count: true,
    });

    const statusMap = {};
    jobCounts.forEach((item) => {
      statusMap[item.status.toLowerCase()] = item._count;
    });

    const totalJobs = await prisma.job.count({ where: { isActive: true } });
    const totalTechnicians = await prisma.user.count({ where: { role: 'TECHNICIAN', isActive: true } });
    const totalClients = await prisma.user.count({ where: { role: 'CLIENT', isActive: true } });

    const summary = {
      totalJobs,
      pendingJobs: statusMap.pending || 0,
      assignedJobs: statusMap.assigned || 0,
      inProgressJobs: statusMap.in_progress || 0,
      completedJobs: statusMap.completed || 0,
      cancelledJobs: statusMap.cancelled || 0,
      totalTechnicians,
      totalClients,
    };

    return success(res, summary);
  } catch (err) {
    next(err);
  }
}
