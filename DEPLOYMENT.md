# Arth Properties — Deployment & Client Handover Guide
**Boutique Real Estate Platform for Monali Khedekar | Pune, Maharashtra**

---

## 1. Architecture & Cost Analysis

| Component | Recommended Provider | Tier | Recurring Cost |
| :--- | :--- | :--- | :--- |
| **Frontend & API Routes** | [Vercel](https://vercel.com) | Hobby Free Tier | **₹0 / $0 per month** |
| **Database & Auth** | [Supabase](https://supabase.com) | Free Tier (500MB DB, 50,000 MAU) | **₹0 / $0 per month** |
| **Media Hosting** | Supabase Storage / Cloudinary | Free Tier (1GB+) | **₹0 / $0 per month** |
| **Domain Name** | Namecheap / GoDaddy | Annual Registration | ~₹800 - ₹1,200 / year (Standard ICANN domain cost) |
| **Total Monthly Infrastructure Cost** | | | **₹0 / month** |

---

## 2. Setting Up Supabase (Persistent Database)

### Step 2.1 — Create a Free Supabase Project
1. Visit [https://supabase.com](https://supabase.com) and sign up with GitHub or Google.
2. Click **New Project**.
3. Set:
   - **Name:** `arth-properties`
   - **Database Password:** Choose a strong password and save it securely.
   - **Region:** `ap-south-1 (Mumbai)` for fastest response times in Pune & Maharashtra.
   - **Pricing Plan:** Free tier.
4. Click **Create new project** and wait ~2 minutes for provisioning.

### Step 2.2 — Run Database Schema Migration
1. In the Supabase Dashboard, open **SQL Editor** from the left navigation bar.
2. Click **New Query**.
3. Open `supabase/migrations/20261017_initial_schema.sql` from this codebase, copy all contents, and paste into the query window.
4. Click **Run** (or `Ctrl+Enter`).
   - This creates tables: `properties`, `enquiries`, `owner_submissions`.
   - Sets up indexes, search triggers, updated_at triggers, and Row Level Security (RLS) policies.
5. In the SQL Editor, create another query, paste the contents of `supabase/seed.sql`, and click **Run**.
   - This populates authentic Pune property listings across Baner, Kharadi, Koregaon Park, Wakad, Viman Nagar, and Bavdhan.

### Step 2.3 — Copy API Keys
1. Go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL:** e.g. `https://xyzcompany.supabase.co`
   - **anon / public key:** `eyJhbGciOi...`
3. If using server functions with administrative bypass, copy the **service_role secret**.

### Step 2.4 — (Optional) Create Admin User in Supabase Auth
1. Go to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Email: `arthproperties@gmail.com`
4. Set a strong password (e.g. `Arth@Pune2026!`).
5. Check **Auto Confirm User**.

*(Note: The platform also contains an automatic fallback admin authentication layer using `ADMIN_FALLBACK_PASSWORD`, so the client can log into `/admin/login` even before connecting Supabase).*

---

## 3. Deploying to Vercel (1-Click Hosting)

### Step 3.1 — Push to GitHub
1. Initialize git in the project root if not already done:
   ```bash
   git init
   git add .
   git commit -m "Arth Properties production ready build"
   ```
2. Create a private repository on [GitHub](https://github.com) named `arth-properties`.
3. Push code to the repository:
   ```bash
   git remote add origin https://github.com/<your-username>/arth-properties.git
   git branch -M main
   git push -u origin main
   ```

### Step 3.2 — Deploy on Vercel
1. Log into [https://vercel.com](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Select your `arth-properties` repository and click **Import**.
4. In the **Environment Variables** section, add the following variables:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://arthproperties.in` | Canonical URL of the production website |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-id.supabase.co` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase Anonymous public key |
| `ADMIN_FALLBACK_EMAIL` | `arthproperties@gmail.com` | Primary admin email |
| `ADMIN_FALLBACK_PASSWORD` | `Arth@Pune2026!` | Strong fallback admin passphrase |

5. Click **Deploy**. Vercel will build and deploy the Next.js application in ~60 seconds.

---

## 4. Custom Domain Setup (e.g. `arthproperties.in`)

1. In Vercel Project Settings, go to **Domains**.
2. Enter your registered domain: `arthproperties.in` and `www.arthproperties.in`.
3. Vercel will provide DNS records:
   - **Type A:** Point `@` to `76.76.21.21`
   - **Type CNAME:** Point `www` to `cname.vercel-dns.com`
4. Open your domain registrar (GoDaddy, Namecheap, etc.), go to DNS Management, and add the records.
5. SSL/TLS certificates will be automatically provisioned for free by Let's Encrypt through Vercel.

---

## 5. Client Operations Manual (For Monali Khedekar)

### How to Access the Admin Dashboard:
1. Open your browser and navigate to: `https://yourdomain.com/admin`
2. If not logged in, you will be redirected to the secure login screen:
   - **Email:** `arthproperties@gmail.com`
   - **Password:** `Arth@Pune2026!` (or the custom password you configure)
3. Click **Sign In to Dashboard**.

### Managing Properties:
- **Add New Property:** Click the **Add New Property** red button. Enter property title, location (e.g., Baner, Kharadi), price (in ₹, formatted automatically into Lakhs/Crores), carpet area, bedrooms, amenities, and image links. Click **Create Listing**.
- **Change Status (Available / Sold / Rented):** In the property table, click the status badge (`Available`, `Sold`, `Rented`) to cycle statuses instantly.
- **Feature on Homepage:** Click the Star icon next to any property to feature it on the home page showcase.
- **Edit Property:** Click the blue pencil icon to update price, description, or amenities.
- **Delete Property:** Click the red trash icon and confirm.

### Managing Customer Leads:
- Navigate to **Customer Enquiries** in the admin sidebar.
- Every time a buyer requests a site visit, call back, or submits an inquiry, it appears here in real time.
- **One-Click WhatsApp:** Click the green WhatsApp icon to open a pre-filled WhatsApp conversation with the prospective buyer.
- **One-Click Call:** Click the phone icon to dial directly from your smartphone or laptop.
- Update lead status from `New` to `Contacted` or `Closed` to track your sales pipeline.

### Reviewing Owner Submissions:
- Navigate to **Owner Submissions** in the admin sidebar.
- When an owner lists a property on your public `/sell` page, it appears under "Pending Review".
- You can inspect their expected price, carpet area, description, and photos.
- Click **Approve & Convert to Live Listing** to instantly convert their submission into an active listing in your portfolio without manual data entry.
- Click **WhatsApp** or **Call Owner** to schedule physical verification or negotiate brokerage terms.

---

## 6. Security & Data Protection Checklist
- All customer phone numbers and messages are protected by Row Level Security (RLS) in PostgreSQL.
- Only authenticated admins can modify property records, view owner phone numbers, or mark leads as contacted.
- Client credentials and Supabase keys are managed via server-safe environment variables.
- HTTPS/TLS 1.3 encryption is enforced by default.
