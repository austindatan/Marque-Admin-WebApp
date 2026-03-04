import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Concluded', 'Cancelled']

const statusStyles = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-green-100 text-green-700',
    Concluded: 'bg-gray-100 text-gray-500',
    Cancelled: 'bg-red-100 text-red-500',
}

// Fallback gradients and emojis for events without a cover image
const GRADIENTS = [
    { from: '#0A0F51', to: '#3b4fd8' },
    { from: '#1e3a5f', to: '#2563eb' },
    { from: '#14532d', to: '#16a34a' },
    { from: '#4a1d96', to: '#7c3aed' },
    { from: '#7c2d12', to: '#ea580c' },
    { from: '#831843', to: '#db2777' },
]
const EMOJIS = ['🏆', '💻', '🤖', '🎓', '🎮', '⚽', '🎉', '📚', '🎨', '🌟']

function Events() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('http://localhost:5000/events')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch events')
                return res.json()
            })
            .then(data => {
                setEvents(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Could not load events. Is the backend running?')
                setLoading(false)
            })
    }, [])

    const filtered = events.filter(e => {
        const name = e.event_name ?? ''
        const matchSearch = name.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'All' || e.status === filter
        return matchSearch && matchFilter
    })

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Events</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Track and manage all student organization events.</p>
                </div>
                <Button className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Event
                </Button>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${filter === f
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="relative w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        placeholder="Search events..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Loading skeleton — 8 card placeholders */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden shadow-sm">
                            {/* Image area */}
                            <Skeleton className="h-36 w-full rounded-none" />
                            <CardContent className="pt-4 pb-5 px-5 space-y-3">
                                {/* Title + org */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                {/* Date + venue */}
                                <div className="space-y-1.5">
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                {/* Buttons */}
                                <div className="flex gap-2 pt-1">
                                    <Skeleton className="h-8 flex-1 rounded-md" />
                                    <Skeleton className="h-8 flex-1 rounded-md" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="text-center py-20 text-red-500">
                    <p className="text-4xl mb-3">⚠️</p>
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            {/* Events grid */}
            {!loading && !error && (
                <>
                    <p className="text-sm text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((event, idx) => {
                            const gradient = GRADIENTS[idx % GRADIENTS.length]
                            const emoji = EMOJIS[idx % EMOJIS.length]
                            const dateLabel = event.event_date
                                ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : '—'

                            const isDimmed =
                                (event.status === 'Concluded' || event.status === 'Cancelled') &&
                                filter !== 'Concluded' && filter !== 'Cancelled'

                            return (
                                <Card key={event._id} className={`overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group ${isDimmed ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}>

                                    <div className="h-36 relative overflow-hidden">
                                        {event.event_image ? (
                                            <img
                                                src={event.event_image}
                                                alt={event.event_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                                            >
                                                <span className="text-6xl select-none">{emoji}</span>
                                            </div>
                                        )}
                                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyles[event.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <CardContent className="pt-4 pb-5 px-5 space-y-3">
                                        <div>
                                            <h3 className="font-bold truncate text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                                                {event.event_name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-[9px] font-bold text-primary">
                                                        {event.event_type?.slice(0, 2) ?? 'EV'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium">{event.event_type ?? 'Event'}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{dateLabel}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{event.venue ?? '—'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 h-8 text-xs gap-1.5"
                                                onClick={() => navigate(`/events/monitoring/${event._id}`)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="font-semibold">No events found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Events
