import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table'

// Mock attendance data
const mockAttendanceList = [
    { id: '2021-00123', name: 'Alice Smith', program: 'BSCS - 3', time: '08:15 AM', status: 'On-Time', method: 'QR', programCode: 'BSCS', year: '3' },
    { id: '2022-00456', name: 'Bob Johnson', program: 'BSIT - 2', time: '08:30 AM', status: 'On-Time', method: 'QR', programCode: 'BSIT', year: '2' },
    { id: '2023-00789', name: 'Charlie Davis', program: 'BSIS - 1', time: '09:05 AM', status: 'Late', method: 'Manual', programCode: 'BSIS', year: '1' },
    { id: '2020-00111', name: 'Diana Evans', program: 'BSCS - 4', time: '08:25 AM', status: 'On-Time', method: 'QR', programCode: 'BSCS', year: '4' },
    { id: '2021-00222', name: 'Evan Wright', program: 'BSIT - 3', time: '09:15 AM', status: 'Late', method: 'QR', programCode: 'BSIT', year: '3' },
]

export default function EventMonitoring() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [selectedEventId, setSelectedEventId] = useState(id || '')
    const [events, setEvents] = useState([])
    const [search, setSearch] = useState('')
    const [filterProgram, setFilterProgram] = useState('All')
    const [filterYear, setFilterYear] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')

    // Fetch all events for the dropdown
    useEffect(() => {
        fetch('http://localhost:5000/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data)
                // If no id in URL, default to first event
                if (!id && data.length > 0) setSelectedEventId(data[0]._id)
            })
            .catch(err => console.error('Failed to fetch events:', err))
    }, [])

    const currentEvent = events.find(e => e._id === selectedEventId) || events[0] || {}


    // Update selectedEventId if URL changes directly
    useEffect(() => {
        if (id) setSelectedEventId(id)
    }, [id])

    const filteredAttendance = mockAttendanceList.filter(student => {
        const matchSearch = student.name.toLowerCase().includes(search.toLowerCase()) || student.id.includes(search)
        const matchProgram = filterProgram === 'All' || student.programCode === filterProgram
        const matchYear = filterYear === 'All' || student.year === filterYear
        const matchStatus = filterStatus === 'All' || student.status === filterStatus
        return matchSearch && matchProgram && matchYear && matchStatus
    })

    // Mock computed metrics
    const totalExpected = 200
    const checkedIn = mockAttendanceList.length
    const attendancePercentage = ((checkedIn / totalExpected) * 100).toFixed(1)

    return (
        <div className="p-8 space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/events')} title="Back to Events">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Monitoring View</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Live Event Tracking</p>
                    </div>
                </div>

                
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Panel */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-sm border-l-4 border-l-primary">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-muted-foreground">Checked-In Count</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h2 className="text-4xl font-extrabold text-foreground">{checkedIn}</h2>
                                    <span className="text-sm text-muted-foreground mb-1">/ {totalExpected}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h2 className="text-4xl font-extrabold text-foreground">{attendancePercentage}%</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table Area */}
                    <Card className="shadow-sm">
                        <CardContent className="p-0">

                            {/* Toolbar */}
                            <div className="flex items-center justify-between gap-4 p-5 border-b flex-wrap">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Live Attendance
                                </h3>

                                <div className="flex items-center gap-3">
                                    <select
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                                        value={filterProgram}
                                        onChange={e => setFilterProgram(e.target.value)}
                                    >
                                        <option value="All">All Programs</option>
                                        <option value="BSCS">BSCS</option>
                                        <option value="BSIT">BSIT</option>
                                        <option value="BSIS">BSIS</option>
                                    </select>
                                    <select
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                                        value={filterYear}
                                        onChange={e => setFilterYear(e.target.value)}
                                    >
                                        <option value="All">All Years</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                    <select
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(e.target.value)}
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="On-Time">On-Time</option>
                                        <option value="Late">Late</option>
                                    </select>
                                    <div className="relative w-48">
                                        <Input
                                            placeholder="Search student..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="pl-8 h-9 text-sm"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Program & Year</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Method</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAttendance.length > 0 ? (
                                            filteredAttendance.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium text-xs">{student.id}</TableCell>
                                                    <TableCell className="font-semibold text-sm">{student.name}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{student.program}</TableCell>
                                                    <TableCell className="text-sm">{student.time}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`text-[10px] font-bold ${student.status === 'On-Time' ? 'text-green-600 bg-green-50 border-green-200' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                                                            {student.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${student.method === 'QR' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                            {student.method}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No records found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: QR Scanner */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-sm border-2 border-primary/10 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500"></div>
                        <CardContent className="p-6 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-6">
                                <h3 className="font-bold text-foreground">QR Scanner</h3>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Active
                                </span>
                            </div>

                            {/* Scanner Mockup */}
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-primary/30 rounded-2xl m-4"></div>
                                <div className="absolute top-0 w-full h-0.5 bg-primary shadow-[0_0_8px_currentColor] animate-bounce"></div>

                                {/* Simulated Camera Feed */}
                                <div className="w-full h-full opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiAvPgo8cGF0aCBkPSJNMCAwbDhfOG04XzBMXzAgOE00IDBMXzQgOE0wIDRMXzggNCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')]"></div>

                                <div className="absolute flex flex-col items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <p className="text-white/50 text-xs font-medium">Align QR Code</p>
                                </div>
                            </div>

                            {/* Recent Scan Feedback */}
                            <div className="mt-8 w-full bg-muted/50 rounded-xl p-4 border text-center space-y-2">
                                <p className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-1.5 border border-green-200 bg-green-50 text-green-700 py-1.5 px-3 rounded-md w-fit mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold">Scan Successful</span>
                                </p>
                                <div className="pt-2">
                                    <p className="text-sm font-bold text-foreground">Alice Smith</p>
                                    <p className="text-xs text-muted-foreground">ID: 2021-00123 • BSCS-3</p>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>

        </div>
    )
}
