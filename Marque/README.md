# Marque Admin WebApp

A modern, organized web application built with Vite, React 19, TailwindCSS v4, and React Router.

## 📁 Project Structure

```
Marque/
├── src/
│   ├── assets/          # Static assets (images, icons, etc.)
│   ├── components/      # Reusable React components
│   │   └── Navigation.jsx
│   ├── pages/          # Page components (routes)
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── styles/         # CSS files
│   │   ├── index.css   # Global styles + Tailwind imports
│   │   └── App.css     # App-specific styles
│   ├── App.jsx         # Main App component with routing
│   └── main.jsx        # Entry point
├── public/             # Public static files
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🚀 Tech Stack

- **Vite** - Lightning fast build tool
- **React 19** - Latest React with modern features
- **TailwindCSS v4** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **PostCSS** - CSS processing with Autoprefixer

## 🎯 Available Routes

- `/` - Home page (demo with Tailwind examples)
- `/about` - About page
- `/contact` - Contact page with form

## 📝 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Styling

This project uses TailwindCSS v4 with the following setup:

- **Import**: `@import "tailwindcss"` in `src/styles/index.css`
- **PostCSS Plugin**: `@tailwindcss/postcss`
- **Configuration**: `tailwind.config.js`

### Adding Custom Styles

1. **Tailwind Utilities**: Use directly in JSX className
2. **Global Styles**: Add to `src/styles/index.css`
3. **Component Styles**: Add to `src/styles/App.css` or create new CSS files

## 📦 Adding New Pages

1. Create a new component in `src/pages/`
2. Import it in `src/App.jsx`
3. Add a new `<Route>` in the Routes component
4. (Optional) Add navigation link in `src/components/Navigation.jsx`

Example:
```jsx
// src/pages/NewPage.jsx
function NewPage() {
  return <div>New Page Content</div>
}
export default NewPage

// src/App.jsx
import NewPage from './pages/NewPage'
// Add to Routes:
<Route path="/new" element={<NewPage />} />
```

## 🧩 Adding New Components

Create reusable components in `src/components/`:

```jsx
// src/components/Button.jsx
function Button({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
    >
      {children}
    </button>
  )
}
export default Button
```

## 📚 Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

## 🎉 Features

- ✅ Modern project structure
- ✅ Client-side routing
- ✅ Responsive navigation
- ✅ TailwindCSS v4 with custom configuration
- ✅ Hot Module Replacement (HMR)
- ✅ ESLint configuration
- ✅ Production-ready build setup
