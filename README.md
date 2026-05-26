# Vector

A fitness training app designed to help users set goals, track workouts, and build sustainable training habits.

Vector is being built toward an AI-guided coaching experience that adapts around real-world training rather than rigid plans.

<!-- ---

## Live Demo

 Add deployed link 
[Live App](#)

---

## Screenshots

## Dashboard
![Dashboard](./screenshots/dashboard.png)

## Goals
![Goals](./screenshots/goals.png)

## Workouts
![Workouts](./screenshots/workouts.png)

## Mobile Navigation
![Mobile Navigation](./screenshots/mobile-nav.png)
-->

---

## Features

### Current MVP Features

- Authentication with Firebase
- Protected routes
- Create goals
- Edit goals
- End goals (completed/inactive)
- Log workouts
- Edit workouts
- Delete workouts
- Responsive navigation
- Mobile hamburger menu
- Shared user context

---

## Planned Features

- AI coach/chat experience
- Dynamic training recommendations
- Dashboard
- Upcoming workout plans
- Training state awareness
- Progress analytics
- Weekly planning adjustments

---

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui

### Backend / Data

- Firebase Authentication
- Firestore

### Other Tools

- date-fns
- Lucide Icons

---

## Installation

Clone the repository:

```bash
git clone https://github.com/espressoGoddess/vector.git
```

Move into the project:

```bash
cd vector
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Future Improvements

- Workout analytics
- Training trends and progress tracking
- Improved mobile UX
- AI-generated training suggestions
- Calendar/planning views

---

## Author

Amber Shipley

GitHub: https://github.com/espressoGoddess
