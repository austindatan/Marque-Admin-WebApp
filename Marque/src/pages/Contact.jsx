import { Link } from 'react-router-dom'
import { useState } from 'react'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        alert('Message sent! (This is a demo)')
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-orange-600 bg-clip-text text-transparent mb-6">
                    Contact Us
                </h1>

                <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl border border-pink-500/20 p-8 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white resize-none"
                                placeholder="Your message..."
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                            >
                                Send Message
                            </button>
                            <Link
                                to="/"
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
