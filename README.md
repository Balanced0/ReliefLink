<div align="center">

# ReliefLink
### Real-Time Emergency Coordination & Transparent Disaster Relief Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)

---

*Connecting crisis-affected communities with verified volunteers, humanitarian organizations, and transparent aid telemetry.*

</div>

---

## Overview

**ReliefLink** is an open, community-powered disaster response and crisis relief platform. It bridges the gap between affected individuals broadcasting emergency needs and on-the-ground volunteers/organizations delivering aid.

Every emergency request, volunteer dispatch, and completed delivery is logged into a transparent, verifiable impact audit trail with peer trust reviews.

---

## Key Features

### 👤 Role-Based Experience & Security
* **Affected Individuals / Community Members**:
  * Broadcast emergency requests with urgency ratings (*Critical, High, Medium, Low*), supply categories (*Food & Water, Medicine, Shelter, Rescue, Other*), and crisis zone sectors.
  * Track request fulfillment status in real-time (*Open → Claimed → Fulfilled*).
  * Rate and review volunteers upon verified delivery.
  * Dedicated profile tracking personal request history and resolution status.
* **Volunteers & First Responders**:
  * Browse and claim open emergency needs.
  * **"My Areas" Bookmarking**: Bookmark operating crisis zones to filter and prioritize localized aid dispatches.
  * Fulfill claims and earn community feedback, ratings, and verified delivery history.
* **Relief Organizations**:
  * Create, manage, and verify aid organizations.
  * Member approval workflow and resource mobilization.
* **Administrators**:
  * Moderation queue for reported requests.
  * User management center (suspend/reactivate accounts, view roles and joined dates with responsive card/table layout).

---

### Real-Time Impact & Transparency Dashboard
* **Platform Key Performance Indicators (KPIs)**: Total needs broadcasted, total needs fulfilled, and real-time fulfillment resolution rate (`%`).
* **Supply & Urgency Response Distribution**: Category breakdowns across food, medical, rescue, and shelter supplies alongside urgency tier fulfillment volume.
* **Active Crisis Sectors & Volunteer Leaderboard**: Recognition for top contributing volunteers and regional crisis zone breakdown.
* **Recent Verified Deliveries**: Live transparency feed displaying completed aid dispatches with volunteer and area stamps.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components), [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Modern Icons) |
| **Backend** | [Express.js 5](https://expressjs.com/), Node.js |
| **Database** | [MySQL](https://www.mysql.com/) via `mysql2` connection pooling |
| **Authentication** | JWT stored in HTTP-only cookies, `bcrypt` password hashing |

---

## Project Structure

```
relief-link/
├── app/                        # Next.js App Router
│   ├── page.js                 # Landing / Hero Page
│   ├── dashboard/              # Live Needs Feed & "My Areas" Filters
│   ├── needs/
│   │   └── new/                # Post Emergency Need (Triage Form)
│   ├── organizations/          # Relief Organizations Directory
│   ├── impact/                 # Platform Impact & Telemetry Dashboard
│   ├── users/[id]/             # Role-Aware User Profiles & Reviews
│   ├── admin/
│   │   ├── reports/            # Admin Reports Moderation Queue
│   │   └── users/              # Admin User Management Center
│   ├── login/ & signup/        # Authentication Pages
│   └── layout.js               # Root Layout
├── components/                 # Reusable UI Components
│   ├── Navbar.js               # Responsive Navigation with Hamburger Menu
│   ├── NeedDetailModal.js      # Need Details, Claiming, Fulfilling & Reviews
│   └── NeedComments.js         # Direct Coordination Chat (Poster + Volunteer)
├── backend/                    # Express REST API Server
│   ├── controllers/            # Controller Business Logic
│   │   ├── authController.js
│   │   ├── needController.js
│   │   ├── claimController.js
│   │   ├── areaController.js
│   │   ├── organizationController.js
│   │   ├── statsController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── routes/                 # Express API Routes
│   ├── middleware/             # JWT Auth & Role Authorization
│   ├── db/                     # MySQL Pool & Schema Migrations
│   │   └── migrations/         # SQL DDL & Seed Scripts
│   └── server.js               # Server Entrypoint (Port 5000)
└── package.json
```

---

## Getting Started

### 1. Prerequisites
* **Node.js**: v18.0 or higher
* **MySQL**: v8.0 or higher running locally (or remote MySQL instance)
* **Git**

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/relief-link.git
cd relief-link
```

---

### 3. Database Setup
1. Create a MySQL database (e.g. `relieflink`):
```sql
CREATE DATABASE relieflink;
```

2. Configure backend environment variables in `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=relieflink
JWT_SECRET=your_super_secret_jwt_key
```

3. Run migrations and seed data:
```bash
npm run migrate
```

---

### 4. Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend (Root):
```bash
cd ..
npm install
```

---

### 5. Running the Application

Open two terminal tabs:

**Tab 1: Start Backend Server (Express)**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Tab 2: Start Frontend Development Server (Next.js)**
```bash
npm run dev
# Running on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Overview

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new user account |
| `/api/auth/login` | `POST` | Public | Sign in and receive auth cookie |
| `/api/auth/me` | `GET` | Session | Get current authenticated user details |
| `/api/needs` | `GET` | Public | Browse all emergency needs |
| `/api/needs` | `POST` | Affected/Admin | Broadcast a new emergency need |
| `/api/needs/:id/claim` | `POST` | Volunteer | Claim an open need |
| `/api/claims/:id/fulfill`| `PATCH`| Volunteer | Mark claimed need as fulfilled |
| `/api/areas` | `GET` | Public | Get crisis zones / sectors |
| `/api/areas/bookmarks` | `GET/POST`| Volunteer | Manage bookmarked operating zones |
| `/api/stats/impact` | `GET` | Public | Get platform impact and fulfillment metrics |
| `/api/users/:id/rate` | `POST` | Verified Poster | Rate and review volunteer for fulfilled need |
| `/api/admin/users` | `GET` | Admin | Manage all user accounts |
| `/api/admin/reports` | `GET/PATCH` | Admin | Review and moderate reported needs |

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues tab.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.
