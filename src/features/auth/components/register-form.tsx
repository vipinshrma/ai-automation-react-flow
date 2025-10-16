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
import Image from 'next/image';

const registerSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        const { email, password } = data;
        await authClient.signUp.email(
            {
                email,
                password,
                name: email.split('@')[0], // fallback display name
                callbackURL: '/',
            },
            {
                onRequest: () => {
                    // show loading state is already handled by form.formState.isSubmitting
                },
                onSuccess: () => {
                    // redirect is handled by callbackURL
                },
                onError: (ctx) => {
                    const { message, field } = ctx.error;
                    if (field === 'email') {
                        form.setError('email', { message });
                    } else if (field === 'password') {
                        form.setError('password', { message });
                    } else {
                        form.setError('root', { message: message || 'Registration failed' });
                    }
                },
            }
        );
    };

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>
                       Get started with your free account
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
                                        alt='Continue with Github'
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
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='password'
                                                    placeholder='Confirm your password'
                                                    disabled={form.formState.isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button
                                    type='submit'
                                    className='w-full'
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? 'Registering...' : 'Register'}
                                </Button>
                                <div className='text-center text-sm'>
                                    <span className='text-sm'>
                                        Already have an account?{' '}
                                        <Link href='/login' className='underline underline-offset-4'> 
                                            Login
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
