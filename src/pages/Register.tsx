import { useState } from 'react';
import api from '@/services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [isRestricted, setIsRestricted] = useState(false);
    const [countryCode, setCountryCode] = useState('+91');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [otps, setOtps] = useState({ email: '', mobile: '' });
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/auth/register', {
                ...formData,
                mobile: `${countryCode}${formData.mobile}`
            });

            // const data = await response.json(); // Axios returns data in response.data, but response variable here is the axios response object
            // The interceptor doesn't unwrap response.data, wait.
            // My interceptor: "api.interceptors.response.use((response) => response, ...)"
            // So response is the full axios response. data is in response.data.
            // But wait, UserService: "return response.data;".
            // Here in Register.tsx, I should access `response.data`.

            // if (!response.ok) ... handled by interceptor (throws if status not 2xx)

            const data = response.data; // Assign for consistent usage below

            toast.success('OTPs sent to Email and Mobile!');
            setStep(2);
        } catch (error: any) {
            // Check for specific backend trial restriction error or common SMS trial errors
            const errorMessage = error.response?.data?.message || error.message || '';
            if (
                errorMessage.includes('Cloud Mode Restriction') ||
                errorMessage.includes('verified') ||
                errorMessage.includes('trial') ||
                errorMessage.includes('validation_error')
            ) {
                setIsRestricted(true);
                setStep(2); // Advance to step 2 but show restricted UI
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/auth/verify-otp', {
                identifier: formData.email,
                emailOtp: otps.email,
                mobileOtp: otps.mobile
            });

            const data = response.data;
            // if (!response.ok) throw new Error(data.message || 'Verification failed'); handled by interceptor

            // Store token and user data
            const userData = { ...data.user, token: data.token };
            useAuthStore.getState().login(userData);

            toast.success(`Welcome, ${data.user.name}! 🎉`);
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh] py-10">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{step === 1 ? 'Create an Account' : 'Verify Account'}</CardTitle>
                        <CardDescription>
                            {step === 1
                                ? 'Enter your details to get started'
                                : `Enter the codes sent to your Email and Mobile`}
                        </CardDescription>
                    </CardHeader>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <div className="flex gap-2">
                                        <Select value={countryCode} onValueChange={setCountryCode}>
                                            <SelectTrigger className="w-[80px]">
                                                <SelectValue placeholder="+91" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="+91">+91 (IN)</SelectItem>
                                                <SelectItem value="+1">+1 (US)</SelectItem>
                                                <SelectItem value="+44">+44 (UK)</SelectItem>
                                                <SelectItem value="+81">+81 (JP)</SelectItem>
                                                <SelectItem value="+86">+86 (CN)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            placeholder="1234567890"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            required
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending OTPs...' : 'Next'}
                                </Button>
                                <div className="text-sm text-center text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    ) : (
                        isRestricted ? (
                            <CardContent className="space-y-6 pt-4">
                                <div className="text-center space-y-4">
                                    <h3 className="text-lg font-semibold text-primary">Thank you for trying ShopKart 😊</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        This is currently a testing version of our application.
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        At the moment, verification codes can only be sent to limited test accounts while our email and SMS services are being finalized.
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        You can still continue using the app by signing in directly or by using Google authentication below.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button
                                        className="w-full"
                                        variant="default"
                                        onClick={() => navigate('/login')}
                                    >
                                        Continue to Login
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}
                                    >
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </Button>
                                </div>
                            </CardContent>
                        ) : (
                            <form onSubmit={handleVerifyOtp}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="emailOtp">Email Verification Code</Label>
                                        <Input
                                            id="emailOtp"
                                            type="text"
                                            placeholder="123456"
                                            value={otps.email}
                                            onChange={(e) => setOtps({ ...otps, email: e.target.value })}
                                            required
                                            maxLength={6}
                                            className="text-center text-xl tracking-widest"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mobileOtp">Mobile Verification Code</Label>
                                        <Input
                                            id="mobileOtp"
                                            type="text"
                                            placeholder="654321"
                                            value={otps.mobile}
                                            onChange={(e) => setOtps({ ...otps, mobile: e.target.value })}
                                            required
                                            maxLength={6}
                                            className="text-center text-xl tracking-widest"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify Codes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => setStep(1)}
                                    >
                                        Back to Details
                                    </Button>
                                </CardFooter>
                            </form>
                        )
                    )}
                </Card>
            </div>
        </Layout>
    );
}
