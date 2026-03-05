# 🧑‍💼 Mini CRM — Firebase Edition

A lightweight, modern **Customer Relationship Management (CRM)** web app built with **React + Vite** on the frontend and **Firebase Firestore** as the database. Manage your leads, track statuses, and add activity notes — all in real time.

---

## 🚀 Live Preview

> Clone the repo and run it locally (instructions below) — no backend server required!

---

## ✨ Features

- 📋 **Add & manage leads** (name, email, source)
- 🔄 **Update lead status** — New → Contacted → Converted
- 📝 **Activity notes** per lead
- 🔍 **Search** leads by name or email
- 📊 **Live stats** — Total, Active, and Converted leads
- 🔥 **Firebase Firestore** as the real-time database
- ⚡ **Vite + React 19** for a blazing-fast dev experience

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19, Vite 6                  |
| UI         | Vanilla CSS, Framer Motion, Lucide React |
| Database   | Firebase Firestore                |
| Hosting    | Node.js Express (static server)   |

---

## 📦 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/anjan0205/future_fs_02.git
cd future_fs_02
```

---

### 2. Install Dependencies

#### Frontend (React + Firebase)
```bash
cd client
npm install
```

#### Backend (Static Server — optional for production)
```bash
cd ../server
npm install
```

---

### 3. Firebase Setup

> The Firebase config is already included in `client/src/firebase.js`.  
> You just need to make sure **Firestore** is enabled in your Firebase Console.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open the **anjan-crm** project
3. Navigate to **Firestore Database** → Create database (if not already created) → choose **Native mode**
4. Set Firestore **Security Rules** (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

### 4. Run the App Locally

```bash
cd client
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

### 5. Build for Production (Optional)

To build the frontend and serve it through the Express server:

```bash
# Build the frontend
cd client
npm run build

# Start the Express server
cd ../server
npm start
```

The app will run at:

```
http://localhost:5000
```

---

## 📁 Project Structure

```
future_fs_02/
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main app component (Firestore CRUD)
│   │   ├── firebase.js       # Firebase configuration & Firestore export
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Express static file server
│   ├── server.js             # Serves built React app
│   ├── .env                  # Environment variables (PORT)
│   └── package.json
│
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ❤️ by [anjan0205](https://github.com/anjan0205)
