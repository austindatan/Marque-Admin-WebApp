import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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

const TYPE_OPTIONS = [
    'Mother Organization',
    'Unit Organization',
]

const DEPARTMENT_OPTIONS = [
    'Department of Information Technology',
    'Department of Technology Communication Management',
    'Department of Data Science',
    'Department of Computer Science',
]

function ViewOrganizationForms({ open, onOpenChange, initialData }) {
    const [logoPreview, setLogoPreview] = useState(null)

    const form = useForm({
        defaultValues: {
            logo: null,
            name: '',
            type: '',
            department: '',
            moderator: '',
            description: '',
            facebookLink: '',
            instagramLink: '',
            xLink: '',
        },
    })

    useEffect(() => {
        if (open && initialData) {
            form.reset({
                logo: null,
                name: initialData.org_name || '',
                type: initialData.org_type || '',
                department: initialData.department_id?.department_name || '',
                moderator: initialData.moderator_name || '',
                description: initialData.description || '',
                facebookLink: initialData.facebook_link || '',
                instagramLink: initialData.instagram_link || '',
                xLink: initialData.x_link || '',
            })
            setLogoPreview(initialData.pfp || null)
        } else if (!open) {
            form.reset()
            setLogoPreview(null)
        }
    }, [open, initialData, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">View Organization</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Below are the read-only details for this organization.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <div className="space-y-5 pt-2">
                        {/* ── Logo ── */}
                        <FormField
                            control={form.control}
                            name="logo"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Organization Logo</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center w-full">
                                            <div className="relative h-32 w-32 shrink-0">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo Preview" className="h-32 w-32 object-cover rounded-full shadow-md border" />
                                                ) : (
                                                    <div className="h-32 w-32 bg-muted border rounded-full flex items-center justify-center shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
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
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ── Department & Moderator ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="moderator"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Moderator Name</FormLabel>
                                        <FormControl>
                                            <Input readOnly {...field} />
                                        </FormControl>
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <textarea
                                            readOnly
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background cursor-default focus-visible:outline-none"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* ── Divider label ── */}
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1 border-t mt-4 mb-2 pt-4">
                            Social Links
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
                                            <Input readOnly {...field} />
                                        </FormControl>
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
                                                <Input readOnly {...field} />
                                            </FormControl>
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
                                                <Input readOnly {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* ── Close Button ── */}
                        <div className="pt-4 flex justify-end">
                            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ViewOrganizationForms
