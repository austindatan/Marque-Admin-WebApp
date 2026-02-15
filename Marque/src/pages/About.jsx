import { Link } from 'react-router-dom'

function About() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-6">
                    About Page
                </h1>

                <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20 p-8 mb-6">
                    <h2 className="text-2xl font-bold text-green-400 mb-4">Welcome to Marque Admin WebApp</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        This is a modern web application built with:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                        <li><span className="text-blue-400 font-semibold">Vite</span> - Lightning fast build tool</li>
                        <li><span className="text-cyan-400 font-semibold">React 19</span> - Latest React features</li>
                        <li><span className="text-purple-400 font-semibold">TailwindCSS v4</span> - Modern utility-first CSS</li>
                        <li><span className="text-pink-400 font-semibold">React Router</span> - Client-side routing</li>
                    </ul>

                    <div className="flex gap-4">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                        >
                            ← Back to Home
                        </Link>
                        <Link
                            to="/contact"
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                        >
                            Contact Us →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
