🧠 PhysioPlus Healthcare - React Web App
This is a responsive React-based web application for PhysioPlus Healthcare, built with Vite, TailwindCSS, and Redux. The project supports both patients and physiotherapists with role-based login, booking, professional profile setup, and more.

🗂️ Project Structure Overview
bash
Copy
Edit
.
├── public/                 # Static assets served as-is (images, pdfs, svgs)
├── src/                   # Source code
│   ├── api/               # All API call functions (Axios config, auth, blog, etc.)
│   ├── components/        # Reusable UI components (cards, modals, banners, etc.)
│   ├── Mock/              # Local mock data used for prototyping
│   ├── pages/             # All route-based pages
│   │   ├── Auth/          # Login and Signup pages for Patient and Physio
│   │   ├── Blog/          # Blog and BlogDetail pages
│   │   ├── Booking/       # Booking flow and history pages
│   │   └── PhysioConnect/ # Pages related to Physio registration and management
│   ├── slices/            # Redux slices for state management
│   ├── App.jsx            # App wrapper with routes
│   ├── main.jsx           # Entry point
│   ├── store.js           # Redux store setup
│   └── validation.js      # Form validation logic
├── .env                   # Environment variables
├── tailwind.config.js     # TailwindCSS configuration
├── vite.config.js         # Vite project configuration
└── README.md              # This file
🧰 Tech Stack
React.js (Vite)

TailwindCSS (Material Tailwind UI)

Redux Toolkit

React Router DOM

Axios (API calls)
ReactQuery

Form validation logic (custom)

🚀 Getting Started
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/saloniiii12/your-repo-name.git
cd your-repo-name
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup .env
Duplicate .env.example and rename to .env, then configure your environment variables (API URLs, etc.)

4. Start development server
bash
Copy
Edit
npm run dev
✨ Features
🔐 Role-based login (Patient vs Physio)

📅 Physio booking with slot selection

🧾 Professional profile builder for Physios

📃 Blog and contact pages

🎨 Reusable and clean UI components

🔄 Redux-managed modals and state

📦 Organized folder structure for scaling

📁 Pages Overview
Folder	Purpose
Auth	Login, Signup for different roles
Blog	Blog listings and details
Booking	Find physios, book appointments, view history
PhysioConnect	Multi-step signup and profile editing for physios
components	All UI elements (cards, forms, navbars, etc.)
api	API integrations split by feature
slices	Redux slices for modular state
🧪 Testing & Debugging
Add breakpoints using browser dev tools

Redux DevTools is supported

All API endpoints use a centralized Axios config (axiosConfig.js)

🧑‍💻 Contributing
Pull requests are welcome! Please ensure code is formatted and tested.

