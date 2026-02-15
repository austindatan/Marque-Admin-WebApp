import { Link, useLocation } from 'react-router-dom'

function Navigation({ onLogout }) {
    const location = useLocation()

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' }
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Marque
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === link.path
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation
