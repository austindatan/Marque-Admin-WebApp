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
    username: z.string().min(1, 'Username is required.'),
    email: z.string().email('Enter a valid email address.'),
    contactNumber: z.string().min(1, 'Contact number is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const Req = () => <span className="text-red-500 ml-0.5">*</span>

function StudentForms({ open, onOpenChange, onSubmit }) {
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
        if (!open) form.reset()
    }, [open])

    function handleSubmit(values) {
        fetch('http://localhost:5000/api/students/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add student');
            }
            return response.json();
        })
        .then(data => {
            console.log('Student added successfully:', data);
            onSubmit?.();
            // Reset form and close dialog
            form.reset();
            onOpenChange(false);
        })
        .catch(error => {
            console.error('Error adding student:', error);
        });
    }

    // fetch colleges
    useEffect(() => {
        fetch('http://localhost:5000/colleges')
            .then(r => r.json())
            .then(data => setColleges(data))
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
            .then(data => setDepartments(data))
            .catch(() => setDepartments([]))

        // reset department when college changes
        form.setValue('department', '')
    }, [form.watch('college')])

    // fetch organizations
    useEffect(() => {
        fetch('http://localhost:5000/organizations')
            .then(r => r.json())
            .then(data => setOrganizations(data))
            .catch(() => setOrganizations([]))
    }, [])

    // fetch roles
    useEffect(() => {
    fetch('http://localhost:5000/api/students/roles') 
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        })
        .then(data => setRoles(data))
        .catch(err => console.error('Failed to fetch roles:', err));
}, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Student</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Fill in the student details below. Fields marked as optional may be left blank.
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
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select College" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(colleges || []).map(c => (
                                                    <SelectItem key={c._id} value={c._id}>{c.college_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(departments || []).map(d => (
                                                    <SelectItem key={d._id} value={d._id}>{d.department_name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Org | Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="org"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Organization{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Org" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(organizations || []).map(o => (
                                                        <SelectItem key={o._id} value={o._id}>{o.org_name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
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
                                            Role{' '}
                                            <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(roles || []).map(r => (
                                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1">
                            Account Details
                        </p>

                        {/* Username | Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username<Req /></FormLabel>
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
                                        <FormLabel>Email<Req /></FormLabel>
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
                                        <FormLabel>Contact Number<Req /></FormLabel>
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
                                        <FormLabel>Password<Req /></FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Min. 8 characters" {...field} />
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
                                Publish User
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default StudentForms