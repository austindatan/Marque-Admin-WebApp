# MARQUE – Admin Web Portal

**USTP-CDO Event Attendance Monitoring System — Administration Dashboard**

---

## About

The **MARQUE Admin Web Portal** is the web-based management interface of the MARQUE Event Attendance Monitoring System, developed for the **University of Science and Technology of Southern Philippines (USTP)**. It provides administrators with centralized control over the system's data, users, organizations, and events.

This portal works in conjunction with the [MARQUE Mobile Application](https://github.com/austindatan/Marque-Mobile-App), which handles on-ground attendance scanning, student participation, and real-time event activity.

---

## Overview

The Admin Web Portal enables USTP administrators to:

- Monitor live and upcoming events across the university
- Manage student records, organizations, and officer assignments
- View and manage event attendance logs
- Approve, update, or remove events submitted through the mobile app
- Oversee system-wide data with full CRUD access

---

## Key Features

**Dashboard Overview**
A real-time summary of system activity — total students, organizations, events, upcoming schedules, and pending approvals — displayed on a single dashboard.

**Event Monitoring**
View and manage all events across organizations, with filtering by status (Upcoming, Ongoing, Concluded, Pending) and full event detail visibility.

**Student Management**
Browse and manage student records, including college and department assignments, organization memberships, and officer roles.

**Organization Management**
Manage recognized student organizations, including officer assignments and organization profiles.

**JWT-Secured API**
All data interactions between the web portal and backend are authenticated via JSON Web Tokens, mirroring the security model of the mobile application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| UI Components | Radix UI, Lucide React |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Authentication | JSON Web Tokens (JWT) |
| File Storage | Cloudinary |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render |

---

## Access Control

Access to this portal is restricted to users with the **Admin** role. All other roles (President, Manager, Committee, Student) are managed through the MARQUE Mobile Application.

- Authentication is enforced on all API endpoints
- Sessions expire automatically via JWT token expiration
- Unauthorized or expired sessions are redirected to the login page

---

## Acknowledgements

This project was developed as part of a **Software Engineering academic requirement** at USTP. We extend our sincere gratitude to:

- **Sir Cyfred Odarve** — Software Engineering Instructor
- **Sir John Harvey C. Babia** — Elective 1 Instructor (Database Management)
- The **USTP IT Department**
- Participating USTP student organizations
- The **Retuertas family** for their support
- All project members, testers, and contributors

MARQUE represents teamwork, technical learning, and a shared commitment to improving event attendance management at USTP.
