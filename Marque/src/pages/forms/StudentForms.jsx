import { useEffect } from 'react'
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
    studentId: z.string({ required_error: 'Student ID is required.' }).min(1, 'Student ID is required.'),
    firstName: z.string({ required_error: 'First name is required.' }).min(1, 'First name is required.'),
    middleName: z.string().optional(),
    lastName: z.string({ required_error: 'Last name is required.' }).min(1, 'Last name is required.'),
    college: z.string({ required_error: 'College is required.' }).min(1, 'College is required.'),
    department: z.string({ required_error: 'Department is required.' }).min(1, 'Department is required.'),
    year: z.string({ required_error: 'Year level is required.' }).min(1, 'Year level is required.'),
    org: z.string({ required_error: 'Organization is required.' }).min(1, 'Organization is required.'),
    role: z.string({ required_error: 'Role is required.' }).min(1, 'Role is required.'),
    username: z.string({ required_error: 'Username is required.' }).min(1, 'Username is required.'),
    email: z.string({ required_error: 'Email is required.' }).email('Enter a valid email address.'),
    contactNumber: z.string({
        required_error: 'Contact number is required.',
        invalid_type_error: 'Contact number is required.',
    }).min(1, 'Contact number is required.'),
    password: z.string({
        required_error: 'Password is required.',
        invalid_type_error: 'Password is required.',
    }).min(8, 'Password must be at least 8 characters.'),
})

const COLLEGE_OPTIONS = [
    'College of Engineering and Architecture',
    'College of Information Technology and Computing',
    'College of Science and Mathematics',
    'College of Science and Technology Education',
    'College of Technology',
    'College of Medicine',
    'Senior High School',
]

const DEPARTMENT_OPTIONS = [
    'Department of Information Technology',
    'Department of Technology Communication Management',
    'Department of Data Science',
    'Department of Computer Science',
]

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
const ORG_OPTIONS = ['CSS', 'ITSOC', 'IEEE', 'ACM', 'None']
const ROLE_OPTIONS = ['President', 'Manager', 'Committee']

const Req = () => <span className="text-red-500 ml-0.5">*</span>

function StudentForms({ open, onOpenChange, onSubmit }) {
    const form = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: '',
            firstName: '',
            middleName: '',
            lastName: '',
            college: '',
            department: '',
            year: '',
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
        onSubmit?.(values)
        form.reset()
        onOpenChange(false)
    }

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
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-5 pt-2"
                    >
                        {/* ── Student ID ── */}
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

                        {/* ── Name row: First | Middle (opt) ── */}
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

                        {/* ── Last Name ── */}
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

                        {/* ── College (full width) ── */}
                        <FormField
                            control={form.control}
                            name="college"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>College<Req /></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select College" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {COLLEGE_OPTIONS.map(c => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Department  ── */}
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department<Req /></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {DEPARTMENT_OPTIONS.map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Selects: Year | Organization | Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year<Req /></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Year" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {YEAR_OPTIONS.map(y => (
                                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="org"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization<Req /></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Org" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ORG_OPTIONS.map(o => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
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
                                        <FormLabel>Role<Req /></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ROLE_OPTIONS.map(r => (
                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1">
                            Account Details
                        </p>

                        {/* Username | Email*/}
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
