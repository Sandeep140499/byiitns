# ByIITians Olympiad Registration - Vercel Deployment Guide

## 🎯 Quick Summary

Your app now deploys as a **single unit** to Vercel with no separate backend needed!

- ✅ Frontend: React + Vite (deploys to Vercel)
- ✅ Backend: Vercel Serverless Functions (runs as `/api/register`)
- ✅ Email: Nodemailer via Gmail (configured)
- ✅ PDF: Generated using pdfkit on the server

## 📝 Files Changed

```
api/register.js         ← NEW: Vercel Serverless Function
api/pdfGenerator.js     ← NEW: PDF invoice generator  
vercel.json             ← UPDATED: API route configuration
vite.config.ts          ← UPDATED: Development proxy
src/pages/OlympiadRegistration.tsx ← UPDATED: API endpoint
```

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel Functions for email & PDF"
git push origin main
```

### Step 2: Deploy to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Click "Deploy"

**That's it!** Vercel automatically:
- ✅ Builds your React app
- ✅ Discovers API functions in `api/` folder
- ✅ Deploys them as serverless functions

### Step 3: Test on Vercel
- Your app URL: `https://your-project.vercel.app`
- API endpoint: `https://your-project.vercel.app/api/register`
- Emails will be sent via nodemailer automatically

## 🧪 Local Development

### Option A: With Email Testing (Express Server)
If you want to test emails locally:

```bash
# Terminal 1: Start Express server
cd d:\VG\byiitns
node server/index.js
# Server runs on http://localhost:5000

# Terminal 2: Start dev server
npm run dev
# App runs on http://localhost:8080
# API calls proxy to http://localhost:5000
```

### Option B: Without Email Testing (Frontend Only)
If you just want to test the UI:

```bash
npm run dev
# App runs on http://localhost:8080
# Email feature won't work locally (will error)
```

**Note:** Email testing requires the Express server running on port 5000.

## ⚙️ How It Works

### Local Development Flow
```
Browser → Frontend (/api/register)
              ↓
          Vite Proxy (localhost:8080)
              ↓
          Express Server (localhost:5000)
              ↓
          Nodemailer → Gmail
```

### Production on Vercel Flow
```
Browser → Frontend (vercel.app)
              ↓
          Vercel Router
              ↓
          api/register.js (Serverless Function)
              ↓
          Nodemailer → Gmail
```

## 📧 Email Configuration

**Already configured in the code:**
- Email: `sumanme10@gmail.com`
- App Password: `sykn fpnn soyc jrcq`

**No environment variables needed!** (Not ideal for production, but works for now)

### ⚠️ Future Security Note
When you go live, move credentials to environment variables:
```
GMAIL_USER=sumanme10@gmail.com
GMAIL_PASSWORD=sykn fpnn soyc jrcq
```

Then update `api/register.js`:
```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});
```

## 🔗 API Endpoint

**POST** `/api/register`

**Request Body:**
```json
{
  "name": "Student Name",
  "fatherName": "Father Name",
  "phoneNumber": "10 digits",
  "email": "student@email.com",
  "class": "12",
  "schoolName": "School Name",
  "section": "A",
  "rollNumber": "123",
  "city": "Delhi",
  "gender": "Male",
  "percentage": "85%"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful! Confirmation emails sent.",
  "serialNumber": "BYIIT-ABC123"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 📁 Project Structure

```
byiitns/
├── api/
│   ├── register.js          ← Vercel Function
│   └── pdfGenerator.js      ← PDF invoice generator
├── server/
│   ├── index.js             ← Local Express server
│   ├── emailService.js      ← Email logic (local)
│   └── pdfGenerator.js      ← PDF logic (local)
├── src/
│   ├── pages/
│   │   └── OlympiadRegistration.tsx
│   ├── components/
│   │   └── InvoiceComponent.tsx
│   └── ...
├── vercel.json              ← Vercel configuration
├── vite.config.ts           ← Dev proxy config
└── package.json
```

## 🎯 What Happens on Registration

1. **User fills form** → clicks "Register & Pay ₹225"
2. **Frontend sends request** → `/api/register`
3. **Vercel Function processes**:
   - ✅ Validates form
   - ✅ Generates serial number (BYIIT-XXXXX)
   - ✅ Creates PDF invoice
   - ✅ Sends email to student
   - ✅ Sends email to owner
4. **Returns serial number** to frontend
5. **UI displays**:
   - ✅ Serial number (prominent)
   - ✅ PayTM QR code
   - ✅ Download PDF button
   - ✅ Payment instructions

## ✅ Checklist Before Deployment

- [ ] Push code to GitHub
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Import GitHub repository
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Test registration form on deployed URL
- [ ] Check emails (student + owner)
- [ ] Download PDF invoice

## 🆘 Troubleshooting

**Q: Emails not sending on Vercel?**
A: Check that Gmail credentials are hardcoded in `api/register.js` (they should be)

**Q: API returns 404?**
A: Make sure `api/register.js` exists in the root `api/` folder

**Q: Local development not working?**
A: Check if Express server is running on port 5000, or comment out the proxy in vite.config.ts

**Q: PDF download not working?**
A: Install `html2pdf.js` in frontend (should already be done)

## 📚 Links

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Nodemailer Docs](https://nodemailer.com)
- [pdfkit Docs](http://pdfkit.org)

---

**That's it!** Your app is ready to deploy. Just push to GitHub and watch Vercel do the rest. 🚀
