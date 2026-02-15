import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

function Home() {
    const [count, setCount] = useState(0)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="flex gap-8 justify-center mb-8">
                <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="h-24 hover:scale-110 transition-transform" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="h-24 hover:scale-110 transition-transform animate-spin-slow" alt="React logo" />
                </a>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
                Vite + React + Tailwind
            </h1>

            <div className="card">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                    count is {count}
                </button>
                <p className="mt-4 text-gray-400">
                    Edit <code className="bg-gray-800 px-2 py-1 rounded">src/pages/Home.jsx</code> and save to test HMR
                </p>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                Click on the Vite and React logos to learn more
            </p>

            {/* Tailwind Test Section */}
            <div className="mt-12 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 max-w-2xl">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">✨ TailwindCSS is Working!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/50">
                        <p className="text-red-300 font-semibold">Red Card</p>
                    </div>
                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
                        <p className="text-green-300 font-semibold">Green Card</p>
                    </div>
                    <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                        <p className="text-blue-300 font-semibold">Blue Card</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
