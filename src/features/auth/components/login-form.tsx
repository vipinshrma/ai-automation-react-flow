'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import  Image  from 'next/image'

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        const { email, password } = data;
        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/"
        }, {
            onRequest: () => {
                // show loading handled by form state
            },
            onSuccess: () => {
                // redirect handled by callbackURL
            },
            onError: (ctx) => {
                // display the error message
                const { error } = ctx;
                if (error.field === 'email') {
                    form.setError('email', { message: error.message });
                } else if (error.field === 'password') {
                    form.setError('password', { message: error.message });
                } else {
                    form.setError('root', { message: error.message || 'Login failed' });
                }
            },
        });
    };
    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Login to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='flex flex-col gap-4'>
                                <Button
                                    variant='outline'
                                    className='w-full'
                                    type='button'
                                    disabled={form.formState.isSubmitting}
                                >
                                    <Image
                                        width={24}
                                        height={24}
                                        src='/google.svg'
                                        alt='Continue with Google'
                                        className='w-5 h-5 mr-2'
                                    />
                                    Continue with Google
                                </Button>
                                  <Button
                                    variant='outline'
                                    className='w-full'
                                    type='button'
                                    disabled={form.formState.isSubmitting}
                                >
                                    <Image
                                        width={24}
                                        height={24}
                                        src='/github.svg'
                                        alt='Continue with Github'
                                        className='w-5 h-5 mr-2'
                                    />
                                    Continue with Github
                                </Button>
                            </div>
                            
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <span className='w-full border-t' />
                                </div>
                                <div className='relative flex justify-center text-xs uppercase'>
                                    <span className='bg-background px-2 text-muted-foreground'>
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='email'
                                                    placeholder='Enter your email'
                                                    disabled={form.formState.isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='password'
                                                    placeholder='Enter your password'
                                                    disabled={form.formState.isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                {form.formState.errors.root && (
                                    <div className='text-sm text-destructive'>{form.formState.errors.root.message}</div>
                                )}
                                
                                <Button
                                    type='submit'
                                    className='w-full'
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                                </Button>
                                <div className='text-center text-sm'>
                                    <span className='text-sm'>
                                        Don&apos;t have an account?{' '}
                                        <Link href='/signup' className='underline underline-offset-4'> 
                                            Signup
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
};
