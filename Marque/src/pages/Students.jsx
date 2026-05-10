import { apiFetch } from '../utils/apiFetch';
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import StudentForms from '@/pages/forms/StudentForms'
import EditStudentForms from '@/pages/forms/EditStudentForms'
import ViewStudentForms from '@/pages/forms/ViewStudentForms'


const avatarColors = [
    ['#dbeafe', '#1d4ed8'],
    ['#ede9fe', '#6d28d9'],
    ['#dcfce7', '#15803d'],
    ['#fef9c3', '#a16207'],
    ['#fee2e2', '#b91c1c'],
    ['#e0f2fe', '#0369a1'],
    ['#fce7f3', '#be185d'],
]

function getAvatarColor(name = '') {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

function getOrgAcronym(name = '') {
    return name
        .split(' ')
        .filter(w => w.length > 2)
        .map(w => w[0])
        .slice(0, 3)
        .join('')
        .toUpperCase() || name.slice(0, 3).toUpperCase()
}

function getFullName(user) {
    if (!user) return '—'
    return [user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ')
}

const ROLE_FILTERS = ['All', 'With Role', 'No Role']

const roleBadgeStyle = {
    President: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Manager: 'bg-blue-100 text-blue-800 border-blue-300',
    Committee: 'bg-purple-100 text-purple-800 border-purple-300',
}

const orgChipColors = [
    ['#dbeafe', '#1d4ed8'],
    ['#ede9fe', '#6d28d9'],
    ['#dcfce7', '#15803d'],
    ['#fef9c3', '#a16207'],
    ['#fee2e2', '#b91c1c'],
    ['#e0f2fe', '#0369a1'],
    ['#fce7f3', '#be185d'],
]

function getOrgColor(name = '') {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return orgChipColors[Math.abs(hash) % orgChipColors.length]
}

function OrgChips({ orgs = [] }) {
    const [expanded, setExpanded] = useState(false)

    if (orgs.length === 0) return <span className="text-xs text-muted-foreground">—</span>

    const visible = expanded ? orgs : orgs.slice(0, 2)
    const overflow = orgs.length - 2

    return (
        <div className="flex flex-col gap-1.5">
            {visible.map((o, i) => {
                const [bg, fg] = getOrgColor(o.org_name)
                const acronym = getOrgAcronym(o.org_name)
                return (
                    <div key={i} className="flex items-center gap-1.5 min-w-0">
                        <div
                            className="h-5 w-5 rounded-md shrink-0 flex items-center justify-center text-[8px] font-extrabold"
                            style={{ backgroundColor: o.pfp ? 'transparent' : bg, color: fg }}
                        >
                            {o.pfp
                                ? <img src={o.pfp} alt={o.org_name} className="h-5 w-5 rounded-md object-cover" />
                                : acronym
                            }
                        </div>
                        <span className="text-xs font-medium truncate max-w-[110px]" title={o.org_name}>
                            {o.org_name}
                        </span>
                        <Badge
                            variant="outline"
                            className={`text-[9px] font-bold px-1.5 py-0 border shrink-0 ${roleBadgeStyle[o.role] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                            {o.role}
                        </Badge>
                    </div>
                )
            })}

            {!expanded && overflow > 0 && (
                <button
                    onClick={() => setExpanded(true)}
                    className="text-[10px] text-primary font-semibold hover:underline text-left"
                >
                    +{overflow} more
                </button>
            )}
            {expanded && orgs.length > 2 && (
                <button
                    onClick={() => setExpanded(false)}
                    className="text-[10px] text-muted-foreground hover:underline text-left"
                >
                    Show less
                </button>
            )}
        </div>
    )
}

function Students() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [viewData, setViewData] = useState(null)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [collegeFilter, setCollegeFilter] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('')

    const [students, setStudents] = useState([])
    const [colleges, setColleges] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStudents = () => {
        setLoading(true)
        apiFetch('http://localhost:5000/students')
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(data => { setStudents(data); setLoading(false) })
            .catch(() => { setError('Could not load students. Is the backend running?'); setLoading(false) })
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    useEffect(() => {
        apiFetch('http://localhost:5000/colleges')
            .then(r => r.json())
            .then(setColleges)
            .catch(() => { })
    }, [])

    useEffect(() => {
        setDepartmentFilter('')
        const url = collegeFilter
            ? `http://localhost:5000/departments?college_id=${collegeFilter}`
            : 'http://localhost:5000/departments'
        apiFetch(url)
            .then(r => r.json())
            .then(setDepartments)
            .catch(() => { })
    }, [collegeFilter])

    const filtered = students.filter(s => {
        const name = getFullName(s.users_id)
        const email = s.users_id?.email ?? ''
        const sn = s.student_number ?? ''
        const dept = s.department_id?.department_name ?? ''
        const deptId = s.department_id?._id ?? ''
        const collegeId = s.college_id?._id ?? ''

        const matchSearch = (
            name.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase()) ||
            sn.includes(search) ||
            dept.toLowerCase().includes(search.toLowerCase())
        )
        const matchRole = (
            roleFilter === 'All' ||
            (roleFilter === 'With Role' && s.hasRole) ||
            (roleFilter === 'No Role' && !s.hasRole)
        )
        const matchCollege = !collegeFilter || collegeId === collegeFilter
        const matchDepartment = !departmentFilter || deptId === departmentFilter

        return matchSearch && matchRole && matchCollege && matchDepartment
    })

    function handleAddStudent() {
        // Refresh the students list after successful addition
        apiFetch('http://localhost:5000/students')
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(data => setStudents(data))
            .catch(err => console.error('Failed to refresh students:', err));
    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Students</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage and view all registered students.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </Button>
            </div>

            <StudentForms open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddStudent} />

            <div className="flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                    {ROLE_FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setRoleFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${roleFilter === f
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <select
                    value={collegeFilter}
                    onChange={e => setCollegeFilter(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                >
                    <option value="">All Colleges</option>
                    {colleges.map(c => (
                        <option key={c._id} value={c._id}>{c.college_name}</option>
                    ))}
                </select>

                <select
                    value={departmentFilter}
                    onChange={e => setDepartmentFilter(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                >
                    <option value="">All Departments</option>
                    {departments.map(d => (
                        <option key={d._id} value={d._id}>{d.department_name}</option>
                    ))}
                </select>

                <div className="relative ml-auto w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        placeholder="Search name, email, ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {loading && (
                <Card className="shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {['Stu ID', 'Name', 'Email', 'Department', 'College', 'Organizations', 'Actions'].map(h => (
                                        <TableHead key={h}>{h}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-4 w-28" />
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-3 w-36" /></TableCell>
                                        <TableCell><Skeleton className="h-3 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-5 w-5 rounded-md" />
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-4 w-14 rounded-full" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {error && !loading && (
                <div className="text-center py-20 text-red-500">
                    <p className="text-4xl mb-3">⚠️</p>
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stu ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>College</TableHead>
                                    <TableHead>Organizations</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? filtered.map(student => {
                                    const name = getFullName(student.users_id)
                                    const [bg, fg] = getAvatarColor(name)
                                    const dept = student.department_id?.department_name ?? '—'
                                    const deptCode = student.department_id?.department_code ?? ''
                                    const college = student.college_id?.college_name ?? '—'
                                    const collegeCode = student.college_id?.college_code ?? ''

                                    return (
                                        <TableRow key={student._id} className="align-top">

                                            <TableCell className="font-mono text-xs text-muted-foreground pt-4">
                                                {student.student_number ?? '—'}
                                            </TableCell>

                                            <TableCell className="pt-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 rounded-full shrink-0">
                                                        {student.users_id?.profile_image ? (
                                                            <img src={student.users_id.profile_image} alt={name} className="h-full w-full rounded-full object-cover" />
                                                        ) : (
                                                            <AvatarFallback
                                                                className="rounded-full text-xs font-bold"
                                                                style={{ backgroundColor: bg, color: fg }}
                                                            >
                                                                {getInitials(name)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <span className="font-semibold text-sm">{name}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-xs text-muted-foreground pt-4">
                                                {student.users_id?.email ?? '—'}
                                            </TableCell>

                                            <TableCell className="pt-4">
                                                <span className="text-sm">{dept}</span>
                                                {deptCode && <span className="ml-1 text-[10px] font-mono text-muted-foreground">({deptCode})</span>}
                                            </TableCell>

                                            <TableCell className="pt-4">
                                                <span className="text-sm">{college}</span>
                                                {collegeCode && <span className="ml-1 text-[10px] font-mono text-muted-foreground">({collegeCode})</span>}
                                            </TableCell>

                                            <TableCell className="pt-3">
                                                <OrgChips orgs={student.orgs} />
                                            </TableCell>

                                            <TableCell className="text-right pt-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => {
                                                            setViewData(student)
                                                            setIsViewOpen(true)
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                                        onClick={() => {
                                                            setEditData(student)
                                                            setIsEditOpen(true)
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            No students match the current filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <EditStudentForms
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open)
                    if (!open) setEditData(null)
                }}
                initialData={editData}
                onSubmit={async (data) => {
                    try {
                        const res = await apiFetch(`http://localhost:5000/api/students/${editData._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        })
                        if (res.ok) {
                            fetchStudents()
                        } else {
                            let errMessage = 'Server error';
                            try {
                                const err = await res.json();
                                errMessage = err.message || errMessage;
                            } catch (e) {
                                // If the backend returns HTML or non-JSON (like 404), this catches the error
                            }
                            alert('Failed to update student: ' + errMessage)
                        }
                    } catch (error) {
                        console.error(error)
                        alert('An error occurred while updating the student.')
                    }
                }}
                onDelete={async (idToDelete) => {
                    if (!idToDelete) return;
                    try {
                        const res = await apiFetch(`http://localhost:5000/api/students/${idToDelete}`, {
                            method: 'DELETE',
                        });
                        if (!res.ok) throw new Error('Failed to delete student');

                        // Update state locally without re-fetching the whole table
                        setStudents(prev => prev.filter(s => s._id !== idToDelete));
                        setIsEditOpen(false);
                        setEditData(null);
                    } catch (err) {
                        console.error(err);
                        alert('Error deleting student');
                    }
                }}
            />

            <ViewStudentForms
                open={isViewOpen}
                onOpenChange={(open) => {
                    setIsViewOpen(open)
                    if (!open) setViewData(null)
                }}
                initialData={viewData}
            />
        </div>
    )
}

export default Students
