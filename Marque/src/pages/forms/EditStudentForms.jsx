import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const studentSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required.'),
    firstName: z.string().min(1, 'First name is required.'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required.'),
    college: z.string().min(1, 'College is required.'),
    department: z.string().min(1, 'Department is required.'),
    org: z.string().optional(),
    role: z.string().optional(),
    username: z.string().optional(),
    email: z.union([z.literal(''), z.string().email('Enter a valid email address.')]).optional(),
    contactNumber: z.string().optional(),
    password: z.string().optional(),
})

const Req = () => <span className="text-red-500 ml-0.5">*</span>

function EditStudentForms({ open, onOpenChange, onSubmit, initialData }) {
    const [colleges, setColleges] = useState([])
    const [departments, setDepartments] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [roles, setRoles] = useState([])

    const form = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: '',
            firstName: '',
            middleName: '',
            lastName: '',
            college: '',
            department: '',
            org: '',
            role: '',
            username: '',
            email: '',
            contactNumber: '',
            password: '',
        },
    })

    useEffect(() => {
        if (open && initialData) {
            const user = initialData.users_id || {}
            
            // Extract the first organization and role if they exist
            const org = initialData.orgs?.[0]?.org_id || ''
            const role = initialData.orgs?.[0]?.role || ''

            form.reset({
                studentId: initialData.student_number || '',
                firstName: user.firstname || '',
                middleName: user.middlename || '',
                lastName: user.lastname || '',
                college: initialData.college_id?._id || '',
                department: initialData.department_id?._id || '',
                org: org,
                role: role,
                username: user.username || '',
                email: user.email || '',
                contactNumber: user.contact_number || '',
                password: '', // Leave blank when editing unless they want to change it
            })
        } else if (!open) {
            form.reset()
        }
    }, [open, initialData, form])

    // Sync password with studentId
    useEffect(() => {
        const sid = form.watch('studentId')
        if (sid !== undefined) {
            form.setValue('password', sid)
        }
    }, [form.watch('studentId'), form.setValue])

    function handleSubmit(values) {
        onSubmit?.(values)
        form.reset()
        onOpenChange(false)
    }

    // fetch colleges
    useEffect(() => {
        fetch('http://localhost:5000/colleges')
            .then(r => r.json())
            .then(data => setColleges(Array.isArray(data) ? data : []))
            .catch(() => setColleges([]))
    }, [])

    // fetch departments 
    useEffect(() => {
        const collegeId = form.watch('college')
        const url = collegeId
            ? `http://localhost:5000/departments?college_id=${collegeId}`
            : 'http://localhost:5000/departments'
        fetch(url)
            .then(r => r.json())
            .then(data => setDepartments(Array.isArray(data) ? data : []))
            .catch(() => setDepartments([]))
    }, [form.watch('college')])

    // fetch organizations
    useEffect(() => {
        fetch('http://localhost:5000/organizations')
            .then(r => r.json())
            .then(data => setOrganizations(Array.isArray(data) ? data : []))
            .catch(() => setOrganizations([]))
    }, [])

    // fetch roles
    useEffect(() => {
        fetch('http://localhost:5000/api/students/roles') 
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => setRoles(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to fetch roles:', err));
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Student</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Update the student details below. Fields marked <Req /> are required.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 pt-2">
                        {/* Student ID */}
                        <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student ID<Req /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2024-00001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Name row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name<Req /></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Juan" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Middle Name{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="dela" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Last Name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name<Req /></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cruz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* College */}
                        <FormField
                            control={form.control}
                            name="college"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>College<Req /></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select College" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(colleges || []).filter(c => c._id).map(c => (
                                                <SelectItem key={c._id} value={c._id}>{c.college_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Department */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department<Req /></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(departments || []).filter(d => d._id).map(d => (
                                                <SelectItem key={d._id} value={d._id}>{d.department_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Org | Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="org"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Organization
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Org" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(organizations || []).filter(o => o._id).map(o => (
                                                    <SelectItem key={o._id} value={o._id}>{o.org_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Role
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(roles || []).filter(r => r).map(r => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1 border-t mt-4 mb-2 pt-4">
                            Account Details
                        </p>

                        {/* Username | Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="juan.delacruz" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="juan@school.edu.ph" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Contact Number | Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Contact Number{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="09xxxxxxxxx" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Auto-filled from Student ID" readOnly className="bg-muted" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <Button type="submit" className="w-full gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditStudentForms
