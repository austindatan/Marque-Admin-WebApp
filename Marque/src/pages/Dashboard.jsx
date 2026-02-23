import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

// ✅ Initial stats template
const statsTemplate = [
  { label: 'Total Students', value: '0', change: 'Students Registered', positive: true, iconBg: 'bg-blue-50 text-blue-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
  )},
  { label: 'Organizations', value: '0', change: 'Active Organizations', positive: true, iconBg: 'bg-purple-50 text-purple-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
  )},
  { label: 'Upcoming Events', value: '0', change: 'Events Scheduled', positive: true, iconBg: 'bg-yellow-50 text-yellow-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
  )},
  { label: 'Concluded Events', value: '0', change: 'Events Completed', positive: true, iconBg: 'bg-teal-50 text-teal-600', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
  )},
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(statsTemplate)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // ✅ Load user from localStorage
    const loggedUser = JSON.parse(localStorage.getItem("user"))
    if (loggedUser) setUser(loggedUser)

    // ✅ Fetch stats
    fetch("http://localhost:5000/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setStats(prev => prev.map(stat => {
          switch(stat.label) {
            case 'Total Students': return { ...stat, value: data.totalStudents }
            case 'Organizations': return { ...stat, value: data.totalOrganizations }
            case 'Upcoming Events': return { ...stat, value: data.upcomingEvents }
            case 'Concluded Events': return { ...stat, value: data.concludedEvents }
            default: return stat
          }
        }))
      })
      .catch(err => console.error("Failed to fetch dashboard stats:", err))

    // ✅ Fetch recent events
    fetch("http://localhost:5000/recent-events")
      .then(res => res.json())
      .then(data => {
        const formatted = data
          .sort((a, b) => new Date(b.event_date) - new Date(a.event_date)) // newest first
          .map(e => ({
            name: e.event_name,
            venue: e.venue,
            status: e.status
          }))
        setRecentActivity(formatted)
      })
      .catch(err => console.error("Failed to fetch recent events:", err))
  }, [])

  return (
    <div className="p-8 space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome back, {user ? user.email : 'Admin'}. Here's what's happening today.
          </p>
        </div>
        <span className="text-xs text-muted-foreground pt-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* ===== STATS CARDS ===== */}
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

      {/* ===== RECENT ACTIVITY ===== */}

    </div>
  )
}