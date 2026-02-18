import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
    {
        path: '/',
        label: 'Dashboard',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        path: '/events',
        label: 'Events',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        path: '/students',
        label: 'Students',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        path: '/organizations',
        label: 'Organizations',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
]

function Sidebar({ onLogout }) {
    const location = useLocation()

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-primary text-primary-foreground flex flex-col z-50 shadow-xl">

            <div className="flex items-center gap-3 px-6 py-7">
                <img
                    src="/marque white.png"
                    alt="Marque Logo"
                    className="h-8 w-auto"
                />
                <span className="text-[10px] font-bold tracking-widest uppercase bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    Admin
                </span>
            </div>

            <Separator className="bg-white/10" />

            <nav className="flex-1 px-3 py-5 space-y-1">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 px-3 mb-3">Menu</p>
                {navItems.map(item => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                ? 'bg-accent/20 text-accent font-semibold'
                                : 'text-white/60 hover:bg-white/8 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <Separator className="bg-white/10" />

            <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">
                        A
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Administrator</p>
                        <p className="text-xs text-white/40">Super Admin</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-semibold"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Button>
            </div>
        </aside>
    )
}

export default Sidebar
