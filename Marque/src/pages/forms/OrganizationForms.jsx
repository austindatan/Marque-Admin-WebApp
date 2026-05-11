import { apiFetch } from '../../utils/apiFetch';
import { useEffect, useState, useRef } from 'react'
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

const organizationSchema = z.object({
    logo: z.any().optional(),
    name: z.string({ required_error: 'Organization Name is required.' }).min(1, 'Organization Name is required.'),
    type: z.string({ required_error: 'Type is required.' }).min(1, 'Type is required.'),
    college: z.string().optional(),
    department: z.string().optional(),
    moderator: z.string().optional(),
    description: z.string({ required_error: 'Description is required.' }).min(1, 'Description is required.'),
    facebookLink: z.string().optional(),
    instagramLink: z.string().optional(),
    xLink: z.string().optional(),
})

const TYPE_OPTIONS = [
    'Mother Organization',
    'Unit Organization',
    'FAESO Organization',
]

const Req = () => <span className="text-red-500 ml-0.5">*</span>

const isExcludedDepartment = (deptName) => {
    if (!deptName) return true;
    const lower = deptName.toLowerCase();
    return lower.includes('extracurricular') ||
        lower.includes('university student government') ||
        lower.includes('university student governemnt') ||
        lower.includes('student council');
};

function OrganizationForms({ open, onOpenChange, onSubmit, departments = [], colleges = [], allOrgs = [] }) {
    const fileInputRef = useRef(null)
    const [logoPreview, setLogoPreview] = useState(null)

    const form = useForm({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            logo: null,
            name: '',
            type: '',
            college: '',
            department: '',
            moderator: '',
            description: '',
            facebookLink: '',
            instagramLink: '',
            xLink: '',
        },
    })

    const orgType = form.watch('type');
    const selectedCollegeId = form.watch('college');

    // Reset fields when orgType changes
    useEffect(() => {
        if (open) {
            form.setValue('college', '');
            form.setValue('department', '');
        }
    }, [orgType, form, open]);

    // Reset department when college changes
    useEffect(() => {
        if (open) {
            form.setValue('department', '');
        }
    }, [selectedCollegeId, form, open]);

    useEffect(() => {
        if (!open) {
            form.reset()
            setLogoPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }, [open, form])

    async function handlePreSubmit(values) {
        if (values.type === 'Mother Organization') {
            if (!values.college) {
                form.setError('college', { message: 'College is required for Mother Organization' });
                return;
            }
            try {
                const selectedCol = colleges.find(c => c._id === values.college);
                const deptRes = await apiFetch('/departments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        department_code: `S${selectedCol.college_code}`,
                        department_name: `Student Council of ${selectedCol.college_name}`,
                        college_id: selectedCol._id
                    })
                });
                if (!deptRes.ok) throw new Error("Failed to create department");
                const newDept = await deptRes.json();
                values.department = newDept._id;
            } catch (err) {
                console.error(err);
                alert("Error setting up Mother Organization department.");
                return;
            }
        } else if (values.type === 'Unit Organization') {
            if (!values.college) {
                form.setError('college', { message: 'College is required for Unit Organization' });
                return;
            }
            if (!values.department) {
                form.setError('department', { message: 'Department is required for Unit Organization' });
                return;
            }
        } else if (values.type === 'FAESO Organization') {
            if (!values.department) {
                form.setError('department', { message: 'Department is required for FAESO Organization' });
                return;
            }
        }

        onSubmit?.(values)
        form.reset()
        setLogoPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        onOpenChange(false)
    }

    const handleFileChange = (e, field) => {
        const file = e.target.files?.[0]
        if (file) {
            field.onChange(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            field.onChange(null)
            setLogoPreview(null)
        }
    }

    const collegesWithMotherOrg = new Set(
        allOrgs.filter(o => o.org_type === 'Mother Organization' && o.department_id?.college_id)
            .map(o => o.department_id.college_id._id || o.department_id.college_id)
    );

    const availableColleges = orgType === 'Mother Organization'
        ? colleges.filter(c => !collegesWithMotherOrg.has(c._id))
        : colleges;

    let availableDepartments = [];
    if (orgType === 'FAESO Organization') {
        availableDepartments = departments.filter(d => d.department_name.toLowerCase().includes('extracurricular'));
    } else if (orgType === 'Unit Organization' && selectedCollegeId) {
        availableDepartments = departments.filter(d =>
            (d.college_id?._id || d.college_id) === selectedCollegeId &&
            !isExcludedDepartment(d.department_name)
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Organization</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Fill in the organization details below. Fields marked <Req /> are required.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handlePreSubmit)}
                        className="space-y-5 pt-2"
                    >
                        {/* ── Logo Upload ── */}
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization Logo</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center w-full">
                                            <div
                                                className="relative h-32 w-32 cursor-pointer group shrink-0"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo Preview" className="h-32 w-32 object-cover rounded-full shadow-md" />
                                                ) : (
                                                    <div className="h-32 w-32 bg-muted border rounded-full flex items-center justify-center shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, field)}
                                                />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Organization Name & Type ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization Name<Req /></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Computer Science Society" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type<Req /></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TYPE_OPTIONS.map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ── College & Department Cascading ── */}
                        {orgType && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                                {(orgType === 'Unit Organization' || orgType === 'Mother Organization') && (
                                    <FormField
                                        control={form.control}
                                        name="college"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>College<Req /></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background">
                                                            <SelectValue placeholder="Select College" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableColleges.map(c => (
                                                            <SelectItem key={c._id} value={c._id}>{c.college_name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {(orgType === 'FAESO Organization' || (orgType === 'Unit Organization' && selectedCollegeId)) && (
                                    <FormField
                                        control={form.control}
                                        name="department"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Department<Req /></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-background">
                                                            <SelectValue placeholder="Select Department" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableDepartments.map(d => (
                                                            <SelectItem key={d._id} value={d._id}>{d.department_name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        )}

                        {/* ── Moderator ── */}
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="moderator"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Moderator Name <span className="text-muted-foreground font-normal lowercase tracking-normal">(Optional)</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Dr. Maria Santos (Optional)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ── Description ── */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description<Req /></FormLabel>
                                    <FormControl>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Write a brief description of the organization..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Divider label ── */}
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1 border-t mt-4 mb-2 pt-4">
                            Social Links <span className="text-muted-foreground font-normal lowercase tracking-normal">(Optional)</span>
                        </p>

                        {/* ── Social Links ── */}
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="facebookLink"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                            </svg>
                                            Facebook
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://facebook.com/your-org" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="instagramLink"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                                </svg>
                                                Instagram
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://instagram.com/your-org" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="xLink"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
                                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                                                </svg>
                                                X (Twitter)
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://x.com/your-org" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* ── Submit ── */}
                        <div className="pt-4">
                            <Button type="submit" className="w-full gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Add Organization
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default OrganizationForms
