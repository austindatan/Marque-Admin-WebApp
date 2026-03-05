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

export default function EventMonitoring() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [selectedEventId, setSelectedEventId] = useState(id || '')
    const [events, setEvents] = useState([])
    const [attendanceList, setAttendanceList] = useState([])
    const [loading, setLoading] = useState(false)
    
    // Filters
    const [search, setSearch] = useState('')
    const [filterProgram, setFilterProgram] = useState('All')
    const [filterYear, setFilterYear] = useState('All')
    const [filterStatus, setFilterStatus] = useState('All')

    // Events for Dropdown
    useEffect(() => {
        fetch('http://localhost:5000/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data)
                if (!id && data.length > 0) setSelectedEventId(data[0]._id)
            })
    }, [id])

    // Attendance for Selected Event
    const fetchAttendance = async () => {
        if (!selectedEventId) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/attendance/monitoring/${selectedEventId}`);
            const data = await res.json();
            setAttendanceList(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedEventId]);


    const filteredAttendance = attendanceList.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.student_number.includes(search)
        const matchStatus = filterStatus === 'All' || item.status === filterStatus
        return matchSearch && matchStatus
    })

    const checkedIn = attendanceList.length

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/events')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary">Monitoring View</h1>
                        <p className="text-muted-foreground text-sm">Live Event Tracking</p>
                    </div>
                </div>

    
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-sm border-l-4 border-l-primary">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-muted-foreground">Checked-In Count</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h2 className="text-4xl font-extrabold">{checkedIn}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card className="shadow-sm">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between gap-4 p-5 border-b flex-wrap">
                                <h3 className="font-semibold text-lg">Live Attendance</h3>
                                <div className="flex items-center gap-3">
                                    <select className="text-sm border rounded-lg px-3 py-1.5" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                        <option value="All">All Statuses</option>
                                        <option value="Present">On-Time</option>
                                        <option value="Late">Late</option>
                                    </select>
                                    <Input 
                                        placeholder="Search student..." 
                                        className="w-48 h-9" 
                                        value={search} 
                                        onChange={e => setSearch(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
                                    ) : filteredAttendance.length > 0 ? (
                                        filteredAttendance.map((log) => (
                                            <TableRow key={log._id}>
                                                <TableCell className="font-medium">{log.student_number}</TableCell>
                                                <TableCell className="font-semibold">{log.name}</TableCell>
                                                <TableCell>{new Date(log.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={log.status === 'Present' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}>
                                                        {log.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">QR</span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10">No records found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                </div>
            </div>
    )
}