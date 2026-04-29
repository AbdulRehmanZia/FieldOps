# Questions I Would Have Asked

Before starting this project, I would have asked the following:

1. **Job reassignment history** — Should the system track which technicians were previously assigned to a job, or only the current assignee?

2. **Notification delivery** — Is in-app notification sufficient, or is email delivery required for job assignments and status changes?

3. **Client registration** — Do clients self-register, or does the admin invite them? Self-registration was assumed but invite-based is more realistic.

4. **Scheduling conflicts** — Should the system prevent assigning a technician to two jobs scheduled at the same time slot?

5. **Soft delete visibility** — Should admins be able to see and restore soft-deleted jobs, or is deletion permanent from the UI?

6. **Job notes** — Can notes be edited or deleted after creation, or are they append-only for audit purposes?

7. **Dashboard date range** — Should the summary stats be all-time or filterable by date range (this week, this month)?

8. **Multi-tenancy** — Is this for a single company, or should it eventually support multiple organizations with isolated data?

9. **Technician availability** — Should technicians have a calendar or availability status that prevents them from being assigned when unavailable?

10. **Client job creation** — Should clients ever be able to request/submit a job themselves, or is job creation always admin-initiated?

