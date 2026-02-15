import { useState } from 'react'

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: Add your backend authentication logic here
        console.log('Login form submitted:', formData)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min bg-white flex items-center justify-center p-10">
            <div className="w-full max-w-md">
                <div className="mb-3 flex justify-center">
                    <img
                        src="/marque full logo.png"
                        alt="Marque Logo"
                        className="h-32 w-auto"
                    />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <div className="flex">
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                            Login to your account.
                        </label>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                placeholder="ID Number"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-[#FECB20] hover:text-[#FECB20]/50 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#0A0F51] hover:bg-[#0A0F51]/50 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-[#FECB20] hover:text-[#FECB20]/50 font-medium">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}

export default Login
