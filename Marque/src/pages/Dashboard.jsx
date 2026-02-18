import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const stats = [
    {
        label: 'Total Students',
        value: '1,284',
        change: '+12 this month',
        positive: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        iconBg: 'bg-blue-50 text-blue-600',
    },
    {
        label: 'Organizations',
        value: '34',
        change: '+2 this semester',
        positive: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        iconBg: 'bg-purple-50 text-purple-600',
    },
    {
        label: 'Upcoming Events',
        value: '8',
        change: '3 this week',
        positive: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        iconBg: 'bg-yellow-50 text-yellow-600',
    },
    {
        label: 'Pending Approvals',
        value: '17',
        change: '-4 from last week',
        positive: false,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        iconBg: 'bg-green-50 text-green-600',
    },
]

const recentActivity = [
    { action: 'New student registered', name: 'Maria Santos', time: '2 minutes ago', initials: 'MS', variant: 'default' },
    { action: 'Event created', name: 'Leadership Summit 2026', time: '1 hour ago', initials: 'LS', variant: 'secondary' },
    { action: 'Organization approved', name: 'Computer Science Society', time: '3 hours ago', initials: 'CS', variant: 'default' },
    { action: 'Profile updated', name: 'Juan dela Cruz', time: '5 hours ago', initials: 'JC', variant: 'secondary' },
    { action: 'Event completed', name: 'Freshmen Orientation', time: 'Yesterday', initials: 'FO', variant: 'secondary' },
]

function Dashboard() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <span className="text-xs text-muted-foreground pt-2">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="pt-6 pb-5 px-5">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                                    {stat.icon}
                                </div>
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

            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-primary">Recent Activity</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 px-5 pb-5">
                    <div className="space-y-1">
                        {recentActivity.map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-4 py-3">
                                    <Avatar className="h-9 w-9 rounded-xl bg-primary text-primary-foreground">
                                        <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                                            {item.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground">{item.action}</p>
                                        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs text-muted-foreground shrink-0">
                                        {item.time}
                                    </Badge>
                                </div>
                                {i < recentActivity.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard
