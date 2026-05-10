import { apiFetch } from '../../utils/apiFetch';
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
    orgs: z.array(z.object({
        org: z.string().min(1, 'Organization is required.'),
        role: z.string().min(1, 'Role is required.')
    })).optional(),
    username: z.string().optional(),
    email: z.union([z.literal(''), z.string().email('Enter a valid email address.')]).optional(),
    contactNumber: z.string().optional(),
    password: z.string().optional(),
})

const Req = () => <span className="text-red-500 ml-0.5">*</span>

function EditStudentForms({ open, onOpenChange, onSubmit, onDelete, initialData }) {
    const [colleges, setColleges] = useState([])
    const [departments, setDepartments] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [roles, setRoles] = useState(['Committee', 'Manager', 'President'])
    const [existingPresidentsByOrg, setExistingPresidentsByOrg] = useState({})
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: '',
            firstName: '',
            middleName: '',
            lastName: '',
            college: '',
            department: '',
            orgs: [],
            username: '',
            email: '',
            contactNumber: '',
            password: '',
        },
    })

    useEffect(() => {
        if (open && initialData) {
            const user = initialData.users_id || {}
            
            const orgsData = (initialData.orgs || []).map(o => ({
                org: o.org_id || '',
                role: o.role || ''
            }))

            form.reset({
                studentId: initialData.student_number || '',
                firstName: user.firstname || '',
                middleName: user.middlename || '',
                lastName: user.lastname || '',
                college: initialData.college_id?._id || '',
                department: initialData.department_id?._id || '',
                orgs: orgsData,
                username: user.username || '',
                email: user.email || '',
                contactNumber: user.contact_number || '',
                password: '', // Leave blank when editing unless they want to change it
            })
        } else if (!open) {
            form.reset()
        }
    }, [open, initialData, form])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'orgs',
    })

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
        apiFetch('http://localhost:5000/colleges')
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
        apiFetch(url)
            .then(r => r.json())
            .then(data => setDepartments(Array.isArray(data) ? data : []))
            .catch(() => setDepartments([]))
    }, [form.watch('college')])

    // fetch organizations
    useEffect(() => {
        apiFetch('http://localhost:5000/organizations')
            .then(r => r.json())
            .then(data => setOrganizations(Array.isArray(data) ? data : []))
            .catch(() => setOrganizations([]))
    }, [])

    // Fetch existing presidents to enforce one president per organization
    useEffect(() => {
        apiFetch('http://localhost:5000/students')
            .then(r => r.json())
            .then(data => {
                const orgHasPresident = {};
                data.forEach(student => {
                    // skip current student being edited
                    if (initialData && student._id === initialData._id) return;
                    (student.orgs || []).forEach(o => {
                        if (o.role === 'President') {
                            orgHasPresident[o.org_id] = true;
                        }
                    })
                })
                setExistingPresidentsByOrg(orgHasPresident);
            })
            .catch(err => console.error('Failed to fetch students for validation:', err));
    }, [initialData]);

    function handleDelete() {
        if (!initialData || !initialData._id) return;
        setIsDeleteDialogOpen(true);
    }

    return (
        <>
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

                        {/* Organizations & Roles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <FormLabel className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    Organizations & Roles
                                </FormLabel>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 gap-1.5"
                                    onClick={() => append({ org: '', role: '' })}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Organization
                                </Button>
                            </div>

                            {fields.map((fieldItem, index) => {
                                // Filter available organizations: Exclude orgs selected in OTHER rows
                                const selectedOrgs = form.watch('orgs').map(o => o.org).filter((_, i) => i !== index);
                                const availableOrgs = (organizations || []).filter(o => o._id && !selectedOrgs.includes(o._id));

                                // Filter available roles: A student can only be President of one organization
                                const selectedRoles = form.watch('orgs').map(o => o.role).filter((_, i) => i !== index);
                                const hasPresident = selectedRoles.some(r => r && r.toLowerCase() === 'president');
                                const currentOrg = form.watch(`orgs.${index}.org`);
                                const orgAlreadyHasPresident = currentOrg ? existingPresidentsByOrg[currentOrg] : false;

                                const availableRoles = (roles || []).filter(r => {
                                    if (!r) return false;
                                    if (hasPresident && r.toLowerCase() === 'president') return false;
                                    if (r.toLowerCase() === 'president' && orgAlreadyHasPresident) return false;
                                    return true;
                                });

                                return (
                                    <div key={fieldItem.id} className="flex items-start gap-4 p-4 border rounded-xl bg-slate-50/50 relative">
                                        <div className="flex-1 space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`orgs.${index}.org`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Organization<Req /></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white">
                                                                    <SelectValue placeholder="Select Org" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableOrgs.map(o => (
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
                                                name={`orgs.${index}.role`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role<Req /></FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white">
                                                                    <SelectValue placeholder="Select Role" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableRoles.map(r => (
                                                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-7"
                                            onClick={() => remove(index)}
                                            title="Remove Organization"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </div>
                                )
                            })}
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

                        {/* Contact Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
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
                        </div>

                        {/* Submit and Delete */}
                        <div className="pt-2 flex gap-4">
                            <Button 
                                type="button" 
                                variant="destructive" 
                                className="w-full gap-2"
                                onClick={handleDelete}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Student
                            </Button>
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this student? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => {
                        setIsDeleteDialogOpen(false)
                        onDelete?.(initialData._id)
                    }}>
                        Delete Student
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default EditStudentForms
