# 🛠️ CivicMitra — MVP

**CivicMitra** is a citizen-first platform to report and track civic issues like potholes, water leaks, and waste management problems.  
The MVP is built as a **Progressive Web App (PWA)** that works offline and saves reports locally, ready for integration with an admin panel.

---

## ✨ Features
- 📱 **PWA Support** — Installable on mobile & desktop, works offline.  
- 📝 **Report Issue Form** — Citizens can submit complaints with name, contact, description, and optional photo/location.  
- 💾 **Offline-First Storage** — Reports saved locally (IndexedDB / local files).  
- 🌙 **Dark/Light Mode** — Smooth theme switching.  
- 🖥️ **Responsive UI** — Looks like an app on mobile and a web app on desktop.  
- ⚡ **Hackathon-Ready Backend** — Node.js + Express setup for saving reports into a local folder (`/reports`).  

---

## 🚀 Tech Stack
- **Frontend:** React + Vite + TailwindCSS + Lucide Icons  
- **PWA:** Vite Plugin PWA (offline caching, install prompt)  
- **Backend:** Node.js + Express (MVP local file storage)  
- **Storage:** IndexedDB (client) & JSON file (server)  

---

## 📂 Project Structure
```
civic_mitra/
 ├── src/
 │   ├── components/     # Navbar, Sidebar, etc.
 │   ├── pages/          # Landing, ReportPage
 │   ├── context/        # Theme Context
 │   └── lib/            # Sync & IndexedDB utilities
 ├── backend/
 │   └── server.js       # Express server (saves reports to /reports folder)
 ├── public/             # PWA icons & manifest
 ├── package.json
 └── README.md
```

---

## ⚙️ Setup & Run
```bash
# Clone repo
git clone https://github.com/your-username/civicmitra.git
cd civicmitra

# Install dependencies
npm install

# Run frontend
npm run dev

# Run backend (in another terminal)
cd backend
npm install
nodemon server.js
```

---

## 📸 Demo (MVP)
- **Landing Page:** Clean, app-like interface.  
- **Report Page:** Simple form, saves reports locally/offline.  
- **PWA:** Can be installed, works offline.  

---

## 🌍 Future Scope
- 🔑 Authentication & role-based admin panel  
- 🗄️ Database integration (MongoDB / Firebase)  
- 📊 Dashboard for tracking and analytics  
- 📍 Smart location tagging & AI-based issue categorization  

---

## 👨‍💻 Team
- **Ashutosh** — Developer & Designer  
(BCA Final Year Student, balancing gym, coding & govt. exam prep 💪)

---

## 📜 License
MIT License
