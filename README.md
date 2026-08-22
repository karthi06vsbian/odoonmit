# Dayflow - Human Resource Management System (HRMS)

> *Every workday, perfectly aligned.*

A modern, full-stack Human Resource Management System designed to digitize and streamline workforce operations, employee onboarding, attendance tracking, leave management, payroll visibility, and administrative approval workflows based on the official Odoo HRMS specification.

---

## 🌟 Key Features & Functional Modules

### 1. 🔐 Multi-Role Authentication & Access Control
- **Dual Login Support**: Sign in using **Email Address** or **Employee ID**.
- **Role-Based Guards**: Strict segregation between **HR / Admin** and **Employee** roles.
- **OTP Verification Simulation**: Instant 6-digit email activation code generated on employee registration.
- **JWT Session Security**: Access token and refresh token rotation with automated client-side Axios interceptors.

### 2. 📊 Interactive Role Dashboards
- **HR Director View**:
  - **Staff Roster Directory**: Search employees by name, ID, or filter by department.
  - **Live Attendance Meter**: Real-time counter of checked-in staff.
  - **Leave Approvals Queue Widget**: Quick access to pending time-off requests.
  - **Visual Analytics**: Interactive Recharts graphs showing department headcount distribution and workforce proportions.
- **Employee View**:
  - **Workday Status Clock**: Interactive live timer card with Check-In / Check-Out actions.
  - Summary metric cards for active leave requests, latest salary slips, and company alerts.

### 3. ⏱️ Attendance & Time Tracking
- Real-time Check-In and Check-Out actions with timestamp logging.
- Automated work hours calculation and dynamic status determination:
  - **Present**: $\ge 8\text{ hrs}$
  - **Half-day**: $\ge 4\text{ hrs}$
  - **Absent**: $< 4\text{ hrs}$
- Historical 30-day personal attendance log.
- **HR Master Attendance View**: Company-wide attendance records filterable by date, department, status, and staff search.

### 4. 🏖️ Time-Off & Leave Management
- Time-off application modal supporting **Paid Vacation**, **Sick/Medical**, and **Unpaid** leaves with automated day calculations.
- Real-time status badges (`Pending`, `Approved`, `Rejected`).
- **HR Approval Queue**: Administrative queue with one-click **Approve / Reject** buttons and feedback comments.

### 5. 💵 Payroll & Salary Management
- Itemized salary breakdown (Basic Salary, Allowances, Deductions, Net Payable).
- **One-Click Dynamic PDF Payslip Generator**: Download official PDF payslips generated on-the-fly using `pdfkit`.
- **HR Salary Structure Editor**: Update basic compensation, bonuses, and deductions for any employee.

### 6. 👤 Profile & Organization Management
- Personal contact information editing (phone number, residential address, avatar upload).
- Protected job details (Designation, Department, Joining Date, Employment Type) managed exclusively by HR.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, React Toastify.
- **Backend**: Node.js, Express.js, Sequelize ORM, PDFKit, JWT, BcryptJS.
- **Database**: Aiven MySQL Cloud (Production / Vercel) & SQLite (Local Development).

---

## 🔑 Default Credentials (Ready on Boot)

| Role | Email / Employee ID | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **HR / Admin** | `hr@dayflow.com` or `EMP-001` | `Password@123` | Full HR control, approvals, roster, salary editor, analytics |
| **Employee** | `employee@dayflow.com` or `EMP-002` | `Password@123` | Attendance clock, time-off requests, PDF payslips |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Run the Application
```bash
# In terminal 1 (Start Backend Server):
cd server && node server.js

# In terminal 2 (Start Frontend Client):
cd client && npm run dev
```

Open **`http://localhost:5173`** in your browser to access Dayflow HRMS.

---

## 🌐 Deploy to Vercel

1. Push this repository to your GitHub account.
2. Import the repository in **[Vercel Dashboard](https://vercel.com/dashboard)** with Root Directory `./`.
3. Add the following **Environment Variables**:
   - `DB_URI` = `mysql://avnadmin:YOUR_PASSWORD@YOUR_AIVEN_HOST:PORT/defaultdb`
   - `DB_DIALECT` = `mysql`
   - `JWT_SECRET` = `dayflow_hrms_super_secret_jwt_key_2026`
   - `JWT_REFRESH_SECRET` = `dayflow_hrms_super_refresh_secret_key_2026`
4. Click **Deploy**!
