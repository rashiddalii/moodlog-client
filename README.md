# Mental Health Journal - Frontend Client

This is the frontend client for the Mental Health Journal application, built with React, Vite, and Tailwind CSS.

## Features

- **Anonymous Authentication**: Secure login and registration with JWT tokens
- **Daily Journaling**: Write and edit daily journal entries with mood tracking
- **Mood Analytics**: Interactive charts and trends visualization
- **Community Stories**: Read and share anonymous support stories
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, accessible interface with smooth animations

## Tech Stack

- **React 19**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Recharts**: Beautiful and responsive charts
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API communication
- **React Toastify**: Toast notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout with navigation
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Journal.jsx     # Journal entry management
│   ├── MoodTrends.jsx  # Mood analytics and charts
│   ├── Stories.jsx     # Community stories feed
│   ├── StoryDetail.jsx # Individual story view
│   └── Profile.jsx     # User profile management
├── services/           # API and external services
│   └── api.js         # Axios configuration and interceptors
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Key Features

### Authentication
- Anonymous account creation
- Secure JWT-based authentication
- Automatic token refresh
- Protected routes

### Journal Management
- Daily journal entries with mood tracking (1-5 scale)
- Mood emoji selection
- Edit and delete entries
- Date navigation
- Character limits and validation

### Mood Analytics
- Interactive line and bar charts
- Mood distribution pie chart
- Trend analysis and statistics
- Customizable time periods
- Responsive chart layouts

### Community Stories
- Anonymous story sharing
- Category-based organization
- Like and flag functionality
- Pagination and filtering
- Moderation system

### User Experience
- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications
- Keyboard navigation support

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- Automatic JWT token management
- Request/response interceptors
- Error handling and retry logic
- Base URL configuration

## Styling

The application uses Tailwind CSS for styling with:

- Custom utility classes
- Responsive design patterns
- Dark mode support (prepared)
- Consistent color scheme
- Accessibility considerations

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## Security

- JWT tokens stored securely
- Input validation and sanitization
- XSS protection
- CSRF protection (handled by backend)
- Secure API communication
