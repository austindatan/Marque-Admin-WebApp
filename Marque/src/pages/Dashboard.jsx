import { apiFetch } from '../utils/apiFetch';
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


function getOptimizedImageUrl(url) {
  if (!url) return url;
  if (typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('/w_') && !url.includes('/c_')) {
      return url.replace('/upload/', '/upload/w_200,c_limit,q_auto,f_auto/');
    }
  }
  return url;
}

const statsTemplate = [
  {
    label: 'Total Students', value: '0', change: 'Students Registered', positive: true, iconBg: 'bg-blue-50 text-blue-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    label: 'Organizations', value: '0', change: 'Active Organizations', positive: true, iconBg: 'bg-purple-50 text-purple-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    label: 'Upcoming Events', value: '0', change: 'Events Scheduled', positive: true, iconBg: 'bg-yellow-50 text-yellow-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    label: 'Concluded Events', value: '0', change: 'Events Completed', positive: true, iconBg: 'bg-teal-50 text-teal-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  },
]

const statusStyles = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Ongoing: 'bg-green-100 text-green-700',
  Concluded: 'bg-gray-100 text-gray-500',
  Cancelled: 'bg-red-100 text-red-500',
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(statsTemplate)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"))
    if (loggedUser) setUser(loggedUser)

    apiFetch("http://localhost:5000/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setStats(prev => prev.map(stat => {
          switch (stat.label) {
            case 'Total Students': return { ...stat, value: data.totalStudents }
            case 'Organizations': return { ...stat, value: data.totalOrganizations }
            case 'Upcoming Events': return { ...stat, value: data.upcomingEvents }
            case 'Concluded Events': return { ...stat, value: data.concludedEvents }
            default: return stat
          }
        }))
      })
      .catch(err => console.error("Failed to fetch dashboard stats:", err))

    apiFetch("http://localhost:5000/recent-events")
      .then(res => res.json())
      .then(data => {
        const formatted = data
          .map(e => ({
            id: e._id || Math.random().toString(),
            name: e.name,
            venue: e.venue,
            status: e.status,
            time: e.time,
            organization: e.organization,
            event_image: e.event_image,
            org_logo: e.org_logo
          }))
        setRecentActivity(formatted)
      })
      .catch(err => console.error("Failed to fetch recent events:", err))
  }, [])

  const ongoingEvents = recentActivity.filter(e => e.status === 'Ongoing')
  const upcomingEvents = recentActivity.filter(e => e.status === 'Upcoming').slice(0, 5) // recent 5
  const concludedEvents = recentActivity.filter(e => e.status === 'Concluded').slice(0, 5) // recent 5

  const renderEventList = (events, emptyMessage) => {
    if (events.length === 0) {
      return <div className="text-sm text-muted-foreground italic py-4">{emptyMessage}</div>
    }

    return (
      <div className="space-y-4 mt-4">
        {events.map((event, i) => (
          <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer group" onClick={() => window.location.href = `/events/monitoring/${event.id}`}>

            <div className="flex items-start gap-3 flex-1 pr-3">
              {/* Event Image */}
              <div className="w-18 h-18 shrink-0 bg-[#0A0F51] rounded-md overflow-hidden relative">
                {event.event_image ? (
                  <img src={getOptimizedImageUrl(event.event_image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Event" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-70 p-2">
                    <img src="/marque white.png" alt="Marque Logo" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{event.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar className="w-4 h-4 border shadow-sm">
                    {event.org_logo ? (
                      <AvatarImage src={getOptimizedImageUrl(event.org_logo)} alt={event.organization} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                      {event.organization?.slice(0, 2)?.toUpperCase() || 'OR'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium text-primary line-clamp-1">{event.organization}</p>
                </div>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate max-w-[50px]">{event.venue || 'TBA'}</span>
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.time ? new Date(event.time).toLocaleDateString() : 'TBA'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant="secondary" className={`${statusStyles[event.status]} border-0 text-[10px] px-2 py-0.5`}>
                {event.status}
              </Badge>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back, {user ? user.email : 'Admin'}. Here's what's happening today.
          </p>
        </div>
        <span className="text-xs text-muted-foreground pt-2 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(stat => (
          <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6 pb-5 px-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>{stat.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-primary mt-1 leading-none">{stat.value}</p>
                  <p className={`text-xs font-medium mt-1.5 ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.positive ? '↑' : '↓'} {stat.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ongoing Events
            </CardTitle>
            <CardDescription>Events happening right now.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderEventList(ongoingEvents, "No ongoing events at the moment.")}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>Recently posted upcoming events.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderEventList(upcomingEvents, "No upcoming events scheduled.")}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recently Concluded</CardTitle>
            <CardDescription>Events that have recently finished.</CardDescription>
          </CardHeader>
          <CardContent>
            {renderEventList(concludedEvents, "No concluded events found.")}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
