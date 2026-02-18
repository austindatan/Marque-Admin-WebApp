import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const mockStudents = [
    { id: '2021-00001', name: 'Maria Santos', course: 'BS Computer Science', year: '3rd Year', org: 'CSS', status: 'Active' },
    { id: '2021-00042', name: 'Juan dela Cruz', course: 'BS Information Technology', year: '2nd Year', org: 'ITSOC', status: 'Active' },
    { id: '2022-00118', name: 'Ana Reyes', course: 'BS Computer Engineering', year: '2nd Year', org: 'IEEE', status: 'Active' },
    { id: '2020-00305', name: 'Carlos Mendoza', course: 'BS Computer Science', year: '4th Year', org: 'CSS', status: 'Inactive' },
    { id: '2023-00021', name: 'Sofia Garcia', course: 'BS Information Systems', year: '1st Year', org: '—', status: 'Active' },
    { id: '2022-00089', name: 'Miguel Torres', course: 'BS Computer Science', year: '3rd Year', org: 'ACM', status: 'Active' },
    { id: '2021-00200', name: 'Isabella Lim', course: 'BS Information Technology', year: '3rd Year', org: 'ITSOC', status: 'Inactive' },
]

// Generate a consistent color from a name string
const avatarColors = [
    ['#dbeafe', '#1d4ed8'], // blue
    ['#ede9fe', '#6d28d9'], // purple
    ['#dcfce7', '#15803d'], // green
    ['#fef9c3', '#a16207'], // yellow
    ['#fee2e2', '#b91c1c'], // red
    ['#e0f2fe', '#0369a1'], // sky
    ['#fce7f3', '#be185d'], // pink
]

function getAvatarColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function Students() {
    const [search, setSearch] = useState('')

    const filtered = mockStudents.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.includes(search) ||
        s.course.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Students</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage and view all registered students.</p>
                </div>
                <Button className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <CardTitle className="text-sm font-semibold text-muted-foreground">
                            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                        </CardTitle>
                        <div className="relative w-64">
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <Input
                                placeholder="Search students..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(student => {
                                const [bg, fg] = getAvatarColor(student.name)
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-full shrink-0">
                                                    <AvatarFallback
                                                        className="rounded-full text-xs font-bold"
                                                        style={{ backgroundColor: bg, color: fg }}
                                                    >
                                                        {getInitials(student.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold">{student.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.course}</TableCell>
                                        <TableCell>{student.year}</TableCell>
                                        <TableCell>{student.org}</TableCell>
                                        <TableCell>
                                            <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Students
