import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import OrganizationForms from './forms/OrganizationForms'

const orgColors = [
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
    return orgColors[Math.abs(hash) % orgColors.length]
}

function getAcronym(name = '') {
    return name
        .split(' ')
        .filter(w => w.length > 2)
        .map(w => w[0])
        .slice(0, 4)
        .join('')
        .toUpperCase() || name.slice(0, 3).toUpperCase()
}

const ORG_TYPES = ['All', 'Unit Organization', 'Mother Organization', 'FAESO Organization']

const typeBadgeStyle = {
    'Unit Organization': 'bg-blue-100 text-blue-800 border-blue-200',
    'Mother Organization': 'bg-purple-100 text-purple-800 border-purple-200',
    'FAESO Organization': 'bg-amber-100 text-amber-800 border-amber-200',
}

function Organizations() {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('All')
    const [departmentFilter, setDepartmentFilter] = useState('')

    const [orgs, setOrgs] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('http://localhost:5000/organizations')
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(data => { setOrgs(data); setLoading(false) })
            .catch(() => { setError('Could not load organizations. Is the backend running?'); setLoading(false) })
    }, [])

    useEffect(() => {
        fetch('http://localhost:5000/departments')
            .then(r => r.json())
            .then(setDepartments)
            .catch(() => { })
    }, [])

    const filtered = orgs.filter(o => {
        const name = o.org_name ?? ''
        const desc = o.description ?? ''
        const dept = o.department_id?.department_name ?? ''
        const deptId = o.department_id?._id ?? ''

        const matchSearch = (
            name.toLowerCase().includes(search.toLowerCase()) ||
            desc.toLowerCase().includes(search.toLowerCase()) ||
            dept.toLowerCase().includes(search.toLowerCase()) ||
            (o.moderator_name ?? '').toLowerCase().includes(search.toLowerCase())
        )
        const matchType = typeFilter === 'All' || o.org_type === typeFilter
        const matchDepartment = !departmentFilter || deptId === departmentFilter

        return matchSearch && matchType && matchDepartment
    })

    return (
        <div className="p-8 space-y-6">

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage all student organizations and their details.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Organization
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                    {ORG_TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${typeFilter === t
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {t === 'All' ? 'All' : t.replace(' Organization', '')}
                        </button>
                    ))}
                </div>

                <select
                    value={departmentFilter}
                    onChange={e => setDepartmentFilter(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                >
                    <option value="">All Departments</option>
                    {departments.map(d => (
                        <option key={d._id} value={d._id}>
                            {d.department_code ? `${d.department_code} — ` : ''}{d.department_name}
                        </option>
                    ))}
                </select>

                <div className="relative ml-auto w-64">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        placeholder="Search organizations..."
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
                                    {['Organization', 'Type', 'Department', 'Description', 'Actions'].map(h => (
                                        <TableHead key={h}>{h}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-9 w-9 rounded-xl" />
                                                <div className="space-y-1.5">
                                                    <Skeleton className="h-4 w-36" />
                                                    <Skeleton className="h-3 w-24" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                                        <TableCell>
                                            <Skeleton className="h-3 w-28" />
                                            <Skeleton className="h-2.5 w-16 mt-1" />
                                        </TableCell>
                                        <TableCell><Skeleton className="h-3 w-48" /></TableCell>
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
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="max-w-xs">Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? filtered.map(org => {
                                    const [bg, fg] = getOrgColor(org.org_name ?? '')
                                    const acronym = getAcronym(org.org_name ?? '')
                                    const dept = org.department_id?.department_name ?? '—'
                                    const deptCode = org.department_id?.department_code ?? ''
                                    const college = org.department_id?.college_id?.college_name ?? ''

                                    return (
                                        <TableRow key={org._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 rounded-xl shrink-0">
                                                        {org.pfp
                                                            ? <AvatarImage src={org.pfp} alt={org.org_name} className="object-cover rounded-xl" />
                                                            : null
                                                        }
                                                        <AvatarFallback
                                                            className="rounded-xl text-xs font-extrabold"
                                                            style={{ backgroundColor: bg, color: fg }}
                                                        >
                                                            {acronym}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm leading-tight">{org.org_name}</p>
                                                        {college && (
                                                            <p className="text-[11px] text-muted-foreground">{college}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] font-bold border whitespace-nowrap ${typeBadgeStyle[org.org_type] ?? 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {org.org_type}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <p className="text-sm">{dept}</p>
                                                {deptCode && (
                                                    <p className="text-[10px] font-mono text-muted-foreground">{deptCode}</p>
                                                )}
                                            </TableCell>

                                            <TableCell className="max-w-xs">
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {org.description ?? '—'}
                                                </p>
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
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No organizations match the current filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )
            }

            <OrganizationForms
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSubmit={(data) => { console.log('New organization data:', data) }}
            />
        </div >
    )
}

export default Organizations
