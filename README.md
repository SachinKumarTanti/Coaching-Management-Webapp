# Laxmi Competition Classes (Sangrampur) - Web Application

A modern, fast, secure, mobile-first Progressive Web Application (PWA) built for **Laxmi Competition Classes**, located in **Sangrampur**, directed by **Vishal Sir**.

Tailored specifically for students preparing on Android smartphones for competitive examinations like **SSC**, **Railway**, **Banking**, and **State Police/Daroga**, with complete desktop and tablet responsiveness.

---

## 🚀 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Optimized touch targets $\ge 44\text{px}$)
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth (Email / Password + Role-based Session Guards)
- **Storage:** Supabase Storage (Private `study-materials` bucket with signed URL verification)
- **Validation:** Zod
- **PWA:** Web App Manifest + Android Install Banner

---

## 📁 Key Features

### 1. Public Portal
- **Home Page (`/`):** Welcoming hero section, introduction to Vishal Sir, highlights, featured courses, recent announcements, and WhatsApp contact link.
- **About Page (`/about`):** Detailed coaching center mission, vision, and biography of Vishal Sir.
- **Courses Page (`/courses` & `/courses/[id]`):** Browsable batches with syllabus highlights and admission instructions.
- **Announcements Page (`/announcements`):** Official center notices, mock test schedules, and holiday broadcasts.
- **Contact Page (`/contact`):** Sangrampur address, map, phone, email, and interactive WhatsApp inquiry button.

### 2. Student Portal (`/dashboard`)
- **Mobile Bottom Navigation Bar:** Dedicated bottom bar on smartphones (Overview, My Courses, Study Notes, Profile).
- **Dashboard Overview:** Personal welcome greeting, summary metrics, enrolled courses, and latest notices.
- **My Courses (`/dashboard/courses`):** List of courses the student is actively enrolled in.
- **Study Notes & PDFs (`/dashboard/materials`):** Filterable list of PDFs and practice sheets.
- **Secure File Download (`/dashboard/materials/[id]/download`):** Strict verification ensuring only enrolled students or admins can download course materials.
- **Profile Management (`/dashboard/profile`):** Update full name, phone number, and password.

### 3. Admin Control Panel (`/admin`)
- **Admin Overview (`/admin`):** Live counts for courses, registered students, uploaded study notes, and active notices.
- **Course Management (`/admin/courses`):** Create, edit, toggle active status, and delete course batches with confirmation dialogs.
- **Announcement Management (`/admin/announcements`):** Post, edit, publish/unpublish, and delete notices.
- **Study Material Management (`/admin/materials`):** Upload PDFs (up to 50MB) tagged to specific courses, view file sizes, and delete files with storage cleanup.
- **Student & Enrollment Management (`/admin/students`):** View registered students, view their enrolled courses, enroll students in new courses, and revoke enrollments.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New Project**, name it `laxmi-competition-classes`, set a strong database password, and select your preferred region (e.g. `ap-south-1` for Mumbai, India).
3. Wait for the project to provision.

### 2. Run Database Migrations
1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Copy the entire contents of [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) and paste it into the SQL Editor. Click **Run**.
   - *This creates the `profiles`, `courses`, `enrollments`, `announcements`, and `study_materials` tables, automated triggers, and Row Level Security (RLS) policies.*
3. Copy the contents of [`supabase/migrations/002_storage_setup.sql`](supabase/migrations/002_storage_setup.sql) and paste it into the SQL Editor. Click **Run**.
   - *This creates the private `study-materials` storage bucket with access policies.*
4. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to populate initial starter courses and announcements.

### 3. Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** > **API Keys** (or **API**).
2. Supabase uses new **opaque API keys**:
   - **Publishable Key (`sb_publishable_...`):** Safe for browser/client-side access (replaces the legacy `anon` key).
   - **Secret Key (`sb_secret_...`):** Strictly for backend/server access (replaces the legacy `service_role` key).
3. Copy your **Project URL**, your **Publishable Key**, and your **Secret Key**.
4. In your project root, create a file named `.env.local` based on `.env.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Publishable Key (sb_publishable_..., client-safe)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here

# Supabase Secret Key (sb_secret_..., server-only)
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# (Optional: Legacy anon and service_role keys are also supported for backward compatibility)
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Create the First Admin Account (Vishal Sir)
1. Start the application locally (`npm run dev`) and navigate to `http://localhost:3000/register`.
2. Register an account with your desired admin email (e.g., `vishalsir@laxmiclasses.com`) and password.
3. Open the Supabase **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'vishalsir@laxmiclasses.com'
);
```

4. Log in at `http://localhost:3000/login`. You will be automatically redirected to the **Admin Control Panel** (`/admin`).

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) on your desktop or mobile browser.

---

## 🏗️ Production Build

Verify that TypeScript and the Next.js production build pass cleanly:

```bash
npm run build
npm run start
```

---

## 🌐 Deployment (Cloudflare / Vercel)

### Option A: Cloudflare Pages (with `@cloudflare/next-on-pages`) or Vercel
1. Push your Git repository to GitHub or GitLab.
2. In the hosting dashboard (Vercel or Cloudflare):
   - Import the repository.
   - Set the build command to `npm run build`.
   - Set the output directory to standard Next.js default.
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_APP_URL` (set to your custom domain or deployment URL)
3. Deploy!

---

## 📱 Progressive Web App (PWA) on Android

Students opening the website in Google Chrome on Android will see an **"Install Laxmi Classes App"** banner at the bottom. Once installed, the application opens full-screen like a native Android app without the browser address bar, providing instant access to class notes and announcements.
