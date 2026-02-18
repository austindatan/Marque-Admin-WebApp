import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const mockOrgs = [
    { id: 1, name: 'Computer Science Society', acronym: 'CSS', type: 'Academic', members: 142, president: 'Carlos Mendoza', status: 'Active', logo: null },
    { id: 2, name: 'IT Students Organization', acronym: 'ITSOC', type: 'Academic', members: 98, president: 'Isabella Lim', status: 'Active', logo: null },
    { id: 3, name: 'Association for Computing Machinery', acronym: 'ACM', type: 'Professional', members: 67, president: 'Miguel Torres', status: 'Active', logo: null },
    { id: 4, name: 'Institute of Electrical & Electronics Engineers', acronym: 'IEEE', type: 'Professional', members: 54, president: 'Ana Reyes', status: 'Active', logo: null },
    { id: 5, name: 'Junior Philippine Computer Society', acronym: 'JPCS', type: 'Academic', members: 30, president: 'Sofia Garcia', status: 'Pending', logo: null },
    { id: 6, name: 'Game Developers Club', acronym: 'GDC', type: 'Special Interest', members: 22, president: 'Juan dela Cruz', status: 'Inactive', logo: null },
]

const statusVariant = (s) => {
    if (s === 'Active') return 'default'
    if (s === 'Pending') return 'outline'
    return 'secondary'
}

const orgColors = [
    ['#dbeafe', '#1d4ed8'],
    ['#ede9fe', '#6d28d9'],
    ['#dcfce7', '#15803d'],
    ['#fef9c3', '#a16207'],
    ['#fee2e2', '#b91c1c'],
    ['#e0f2fe', '#0369a1'],
]

function getOrgColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return orgColors[Math.abs(hash) % orgColors.length]
}

const personColors = [
    ['#fce7f3', '#be185d'],
    ['#ede9fe', '#6d28d9'],
    ['#dcfce7', '#15803d'],
    ['#dbeafe', '#1d4ed8'],
    ['#fef9c3', '#a16207'],
    ['#fee2e2', '#b91c1c'],
]

function getPersonColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return personColors[Math.abs(hash) % personColors.length]
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

function Organizations() {
    const [search, setSearch] = useState('')

    const filtered = mockOrgs.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.acronym.toLowerCase().includes(search.toLowerCase()) ||
        o.type.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight">Organizations</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage all student organizations and their details.</p>
                </div>
                <Button className="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Organization
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
                                placeholder="Search organizations..."
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
                                <TableHead>Organization</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>President</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(org => {
                                const [orgBg, orgFg] = getOrgColor(org.name)
                                const [pBg, pFg] = getPersonColor(org.president)
                                return (
                                    <TableRow key={org.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-xl shrink-0">
                                                    {org.logo && <AvatarImage src={org.logo} alt={org.name} className="object-cover rounded-xl" />}
                                                    <AvatarFallback
                                                        className="rounded-xl text-xs font-extrabold"
                                                        style={{ backgroundColor: orgBg, color: orgFg }}
                                                    >
                                                        {org.acronym.slice(0, 3)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm leading-tight">{org.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{org.acronym}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">{org.type}</Badge>
                                        </TableCell>
                                        <TableCell>{org.members}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7 rounded-full shrink-0">
                                                    <AvatarFallback
                                                        className="rounded-full text-[10px] font-bold"
                                                        style={{ backgroundColor: pBg, color: pFg }}
                                                    >
                                                        {getInitials(org.president)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{org.president}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(org.status)}>
                                                {org.status}
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

export default Organizations
