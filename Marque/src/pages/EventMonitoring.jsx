import { apiFetch } from '../utils/apiFetch';
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
import {

    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

const statusStyles = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-green-100 text-green-700',
    Concluded: 'bg-gray-100 text-gray-500',
    Cancelled: 'bg-red-100 text-red-500',
}

function getOptimizedImageUrl(url) {
    if (!url) return url;
    if (typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/upload/')) {
        if (!url.includes('/w_') && !url.includes('/c_')) {
            return url.replace('/upload/', '/upload/w_500,c_limit,q_auto,f_auto/');
        }
    }
    return url;
}

export default function EventMonitoring() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [selectedEventId, setSelectedEventId] = useState(id || '')
    const [events, setEvents] = useState([])
    const [attendanceList, setAttendanceList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Filters
    const [search, setSearch] = useState('')
    const [filterCollege, setFilterCollege] = useState('All')
    const [filterDepartment, setFilterDepartment] = useState('All')

    const [allColleges, setAllColleges] = useState([])
    const [allDepartments, setAllDepartments] = useState([])

    useEffect(() => {
        apiFetch('/colleges').then(res => res.json()).then(setAllColleges).catch(console.error)
        apiFetch('/departments').then(res => res.json()).then(setAllDepartments).catch(console.error)
    }, [])

    // Events for Dropdown
    useEffect(() => {
        apiFetch('/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data)
                setLoading(false)
                if (!id && data.length > 0) setSelectedEventId(data[0]._id)
            })
            .catch(err => { setError(err.message); setLoading(false); })
    }, [id])

    // Attendance for Selected Event
    const fetchAttendance = async () => {
        if (!selectedEventId) return;
        try {
            const res = await apiFetch(`/attendance/monitoring/${selectedEventId}`);
            const data = await res.json();
            setAttendanceList(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedEventId]);

    const handleDeleteEvent = async () => {
        try {
            const res = await apiFetch(`/events/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete event');

            setIsDeleteDialogOpen(false);
            navigate('/events');
        } catch (err) {
            console.error(err);
            alert('Error deleting event');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading event data...</div>
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>

    const checkedIn = attendanceList.length
    const currentEvent = events.find(e => e._id === selectedEventId)
    const currentOrg = currentEvent?.organization_id;

    let showCollegeFilter = true;
    let showDepartmentFilter = true;

    const isExcludedDepartment = (deptName) => {
        if (!deptName) return true;
        const lower = deptName.toLowerCase();
        return lower.includes('extracurricular') ||
            lower.includes('university student government') ||
            lower.includes('university student governemnt') ||
            lower.includes('student council');
    };

    const isExcludedCollege = (colName) => {
        if (!colName) return true;
        const lower = colName.toLowerCase();
        return lower.includes('university student government') ||
            lower.includes('university student governemnt');
    };

    let uniqueColleges = ['All', ...new Set(attendanceList.map(item => item.college).filter(c => !isExcludedCollege(c)))];
    let uniqueDepartments = ['All', ...new Set(attendanceList.map(item => item.department).filter(d => !isExcludedDepartment(d)))];

    if (currentOrg) {
        const orgType = (currentOrg.org_type || '').trim();
        const orgName = (currentOrg.org_name || '').trim();

        if (orgName === 'University Student Government' || orgName === 'USTP Student Affairs - CDO' || orgType === 'FAESO Organization') {
            uniqueColleges = ['All', ...allColleges.filter(c => !isExcludedCollege(c.college_name)).map(c => c.college_name)];
            if (filterCollege === 'All') {
                showDepartmentFilter = false; // Hide department filter until college is chosen
                uniqueDepartments = ['All'];
            } else {
                const selectedCol = allColleges.find(c => c.college_name === filterCollege);
                uniqueDepartments = ['All', ...allDepartments
                    .filter(d => (d.college_id?._id || d.college_id) === selectedCol?._id && !isExcludedDepartment(d.department_name))
                    .map(d => d.department_name)];
            }
        } else if (orgType === 'Unit Organization') {
            showCollegeFilter = false;
            showDepartmentFilter = false;
        } else if (orgType === 'Mother Organization') {
            showCollegeFilter = false;
            const orgCollegeId = currentOrg.department_id?.college_id?._id || currentOrg.department_id?.college_id;
            if (orgCollegeId) {
                uniqueDepartments = ['All', ...allDepartments
                    .filter(d => (d.college_id?._id || d.college_id) === orgCollegeId && !isExcludedDepartment(d.department_name))
                    .map(d => d.department_name)];
            }
        }
    }

    const filteredAttendance = attendanceList.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.student_number.includes(search) || (item.email && item.email.toLowerCase().includes(search.toLowerCase()))
        const matchCollege = !showCollegeFilter || filterCollege === 'All' || item.college === filterCollege
        const matchDepartment = !showDepartmentFilter || filterDepartment === 'All' || item.department === filterDepartment
        return matchSearch && matchCollege && matchDepartment
    })

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
                    {/* Metrics & Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Event Details Card */}
                        <Card className="shadow-sm flex overflow-hidden md:col-span-2">
                            {/* Image side */}
                            <div className="aspect-square w-[140px] md:w-[200px] shrink-0 bg-[#0A0F51] relative flex items-center justify-center">
                                {currentEvent?.event_image ? (
                                    <img src={getOptimizedImageUrl(currentEvent.event_image)} className="w-full h-full object-cover" alt={currentEvent.event_name} />
                                ) : (
                                    <img src="/marque white.png" alt="Marque Logo" className="w-16 h-auto opacity-75 object-contain" />
                                )}
                                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${statusStyles[currentEvent?.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                    {currentEvent?.status || 'Unknown'}
                                </span>
                            </div>

                            {/* Details side */}
                            <CardContent className="p-5 flex flex-col justify-center flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-bold text-lg leading-tight truncate" title={currentEvent?.event_name}>
                                        {currentEvent?.event_name || 'Loading event...'}
                                    </h3>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => setIsDeleteDialogOpen(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>

                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {currentEvent?.organization_id?.pfp ? (
                                            <img src={getOptimizedImageUrl(currentEvent.organization_id.pfp)} alt={currentEvent.organization_id.org_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] font-bold text-primary">
                                                {currentEvent?.organization_id?.org_name?.slice(0, 2)?.toUpperCase() ?? 'OR'}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium truncate" title={currentEvent?.organization_id?.org_name}>
                                        {currentEvent?.organization_id?.org_name ?? 'Unknown Organization'}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2" title={currentEvent?.description}>
                                    {currentEvent?.description || 'No description available for this event.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>
                                            {currentEvent?.event_date
                                                ? new Date(currentEvent.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="truncate" title={currentEvent?.venue}>{currentEvent?.venue ?? '—'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-l-4 border-l-primary flex flex-col justify-center">
                            <CardContent className="p-6">
                                <p className="text-sm font-medium text-muted-foreground">Checked-In Count</p>
                                <div className="flex items-end gap-2 mt-2">
                                    <h2 className="text-4xl font-extrabold">{checkedIn}</h2>
                                    <span className="text-sm text-muted-foreground mb-1">students</span>
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
                                    {showCollegeFilter && (
                                        <select className="text-sm border rounded-lg px-3 py-1.5 max-w-[200px]" value={filterCollege} onChange={e => {
                                            setFilterCollege(e.target.value);
                                            setFilterDepartment('All'); // Reset department when college changes
                                        }}>
                                            {uniqueColleges.map(c => (
                                                <option key={c} value={c}>{c === 'All' ? 'All Colleges' : c}</option>
                                            ))}
                                        </select>
                                    )}
                                    {showDepartmentFilter && (
                                        <select className="text-sm border rounded-lg px-3 py-1.5 max-w-[200px]" value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)}>
                                            {uniqueDepartments.map(d => (
                                                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                                            ))}
                                        </select>
                                    )}
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
                                        <TableHead>Email</TableHead>
                                        <TableHead>College</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAttendance.length > 0 ? (
                                        filteredAttendance.map((log) => (
                                            <TableRow key={log._id}>
                                                <TableCell className="font-medium">{log.student_number}</TableCell>
                                                <TableCell className="font-semibold whitespace-nowrap">{log.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{log.email}</TableCell>
                                                <TableCell className="truncate max-w-[150px]" title={log.college}>{log.college}</TableCell>
                                                <TableCell className="truncate max-w-[150px]" title={log.department}>{log.department}</TableCell>
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
                                        <TableRow><TableCell colSpan={8} className="text-center py-10">No records found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the event "{currentEvent?.event_name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDeleteEvent}>
                            Delete Event
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}