import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const mockEvents = [
    {
        id: 1,
        name: 'Light of First Dawn',
        org: 'Chrysos Heirs',
        date: 'Feb 25, 2026',
        venue: 'Auditorium A',
        participants: 200,
        status: 'Upcoming',
        cover: null,
        colorFrom: '#0A0F51',
        colorTo: '#3b4fd8',
        emoji: '🏆',
        cover: '/events/first.jpg',
    },
    {
        id: 2,
        name: 'No Aha at Full Moon',
        org: 'Mask Fools',
        date: 'Mar 5, 2026',
        venue: 'Computer Lab 3',
        status: 'Upcoming',
        cover: '/events/4.0.jpg',
        colorFrom: '#1e3a5f',
        colorTo: '#2563eb',
        emoji: '💻',
    },
    {
        id: 3,
        name: 'Light Slips the Gate, Shadow Greets the Throne',
        org: 'Chrysos Heirs',
        date: 'Mar 12, 2026',
        venue: 'Seminar Room B',
        status: 'Upcoming',
        cover: '/events/3.1.jpg',
        colorFrom: '#14532d',
        colorTo: '#16a34a',
        emoji: '🤖',
    },
    {
        id: 4,
        name: 'Parade of Providence',
        org: 'Sumeru Academia',
        date: 'Feb 10, 2026',
        venue: 'Main Hall',
        status: 'Concluded',
        cover: '/events/parade.png',
        colorFrom: '#4a1d96',
        colorTo: '#7c3aed',
        emoji: '🎓',
    },
    {
        id: 5,
        name: 'Cookie Town',
        org: 'Cookie Run Kingdom',
        date: 'Jan 28, 2026',
        venue: 'Room 204',
        status: 'Concluded',
        cover: '/events/cookie.jpg',
        colorFrom: '#7c2d12',
        colorTo: '#ea580c',
        emoji: '🎮',
    },
    {
        id: 6,
        name: 'Sabrina Aryan',
        org: 'Headphone Girl',
        date: 'Apr 1, 2026',
        venue: 'Gymnasium',
        status: 'Ongoing',
        cover: '/events/sabrina.jpg',
        colorFrom: '#831843',
        colorTo: '#db2777',
        emoji: '⚽',
    },
]

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Concluded']

const statusStyles = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-green-100 text-green-700',
    Concluded: 'bg-gray-100 text-gray-500',
}

function Events() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const filtered = mockEvents.filter(e => {
        const matchSearch =
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.org.toLowerCase().includes(search.toLowerCase())
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

            <p className="text-sm text-muted-foreground">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(event => (
                    <Card key={event.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group">

                        <div className="h-36 relative overflow-hidden">
                            {event.cover ? (
                                <img
                                    src={event.cover}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${event.colorFrom}, ${event.colorTo})` }}
                                >
                                    <span className="text-6xl select-none">{event.emoji}</span>
                                </div>
                            )}
                            <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyles[event.status]}`}>
                                {event.status}
                            </span>
                        </div>

                        <CardContent className="pt-4 pb-5 px-5 space-y-3">
                            <div>
                                <h3 className="font-bold truncate text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                                    {event.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-primary">{event.org.slice(0, 2)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">{event.org}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.venue}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1.5">
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
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-semibold">No events found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter.</p>
                </div>
            )}
        </div>
    )
}

export default Events
