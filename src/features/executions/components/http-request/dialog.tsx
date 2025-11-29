import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
    endPoint: z.url({ message: "Invalid URL" }),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional()
})

export type HttpRequestFormValues = z.infer<typeof formSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void
    onSubmit: (values: HttpRequestFormValues) => void;
    defaultValues?: Partial<HttpRequestFormValues>

}

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endPoint: defaultValues.endPoint,
            method: defaultValues.method,
            body: defaultValues.body
        }
    })

    const watchMethod = form.watch('method')
    const showBodyField = ['POST', 'PUT', 'PATCH'].includes(watchMethod)

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)
    }
    useEffect(() => {
        if (open) {
            form.reset({
                endPoint: defaultValues.endPoint,
                method: defaultValues.method,
                body: defaultValues.body
            })
        }
    }, [open, defaultValues])
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        HTTP Request
                    </DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Method</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                                <SelectItem value="DELETE">DELETE</SelectItem>
                                                <SelectItem value="PATCH">PATCH</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The HTTP method to use for this request
                                        </FormDescription>
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="endPoint"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Endpoint URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="http://api.example.com/users/"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Static URL or use {"{{variables}}"} for simple values or {"{{ JSON variables}}"} to stringify objects
                                        </FormDescription>
                                    </FormItem>
                                )
                            }}
                        />
                        {
                            showBodyField && <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Request Body</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="http://api.example.com/users/"
                                                    className="min-h-[120px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                JSON with template variables. Use {"{{variables}}"} for simple values or {"{{ JSON variables}}"} to stringify objects
                                            </FormDescription>
                                        </FormItem>
                                    )
                                }}
                            />
                        }
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>

        </Dialog>
    )
}