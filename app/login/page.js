

"use client"; // Ensure this is at the top for Next.js to handle the client-side component
import { FaGoogle, FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import { signIn } from 'next-auth/react';
import BeatLoader from "react-spinners/BeatLoader";
import Link from 'next/link'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import { getCsrfToken } from 'next-auth/react';
export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const [blockedUntil, setBlockedUntil] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const token = await getCsrfToken();
            setCsrfToken(token);
        };

        fetchCsrfToken();
    }, []);






    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

 
 
    useEffect(() => {
        // Load blockedUntil from localStorage if it exists
        const savedBlockedUntil = localStorage.getItem('blockedUntil');
        if (savedBlockedUntil) {
            const savedTime = parseInt(savedBlockedUntil, 10);
            if (savedTime > Date.now()) {
                setBlockedUntil(savedTime);
                setTimeLeft((savedTime - Date.now()) / 1000);
            } else {
                localStorage.removeItem('blockedUntil');
            }
        }
    }, []);

    useEffect(() => {
        let timer;
        if (blockedUntil) {
            timer = setInterval(() => {
                const now = Date.now();
                const secondsLeft = Math.max((blockedUntil - now) / 1000, 0);
                setTimeLeft(secondsLeft);

                if (secondsLeft <= 0) {
                    clearInterval(timer);
                    setBlockedUntil(null);
                    setTimeLeft(0);
                    setServerMessage("")
                    localStorage.removeItem('blockedUntil');
                }
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [blockedUntil]);

    useEffect(() => {
        if (blockedUntil) {
            localStorage.setItem('blockedUntil', blockedUntil);
        } else {
            localStorage.removeItem('blockedUntil');
        }
    }, [blockedUntil]);

    const validateForm = () => {
        const errors = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('');

        if (!validateForm()) return;
        setLoading(true)
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (!result.ok) {
                const errorMessage = result.error;
                console.log(errorMessage);
                setLoading(false)
                const match = errorMessage.match(/Try again in (\d+) seconds/);
                if (match) {
                    const seconds = parseInt(match[1], 10);
                    const unblockTime = Date.now() + seconds * 1000;
                    setBlockedUntil(unblockTime);
                    setTimeLeft(seconds);
                    localStorage.setItem('blockedUntil', unblockTime.toString());
                }

                setServerMessage(errorMessage);
            } else {
                setServerMessage('Signup successful!');
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            setServerMessage('An unexpected error occurred');
        }
    };

    return (
        <Box sx={{ backgroundImage: 'url(/image/auth.jpg)',
        
        
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        
        
        
         }}   >

        <Box
     
           
                method="post"
                action="/api/auth/callback/credentials"


            component="form"
            onSubmit={handleSubmit}
            
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto',
            
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              marginTop:"29px",
                padding: '40px',
                 color:"white"
             }}
    
    
        >
                <input name="csrfToken" type="hidden" value={csrfToken} />
            <Typography variant="h4" component="h1" gutterBottom>
                Sign In
            </Typography>



            {serverMessage && (
                <Alert severity={blockedUntil ? 'error' : 'success'}>
                    {serverMessage} {timeLeft>0 ? Math.ceil(timeLeft) :""  }
                </Alert>
            )}

            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                disabled={!!blockedUntil}

                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    InputProps={{
                        style: {
                            color: '#fff',
                            borderColor: 'white',
                        },
                    }}
                    sx={{
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                    }}

            />
            <TextField
                label="Password"
                    type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth



                
                disabled={!!blockedUntil}
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    InputProps={{
                        style: {
                            color: '#fff',
                            borderColor: 'white',

                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <VisibilityOff
                                        sx={{ color: "white" }}

                                    /> : <Visibility

                                        sx={{ color: "white" }}
                                    />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                    }}

            /><Link href="/forgot-password" variant="body2" align="right">
                Forgot password?
            </Link>
                <Link href="/register" variant="body2" align="right">
         Register?
                </Link>
            <Button type="submit" variant="contained" color="primary" disabled={!!blockedUntil}>
                {loading ? <BeatLoader

                    loading={loading}
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> : "sign in"}
            </Button>


          
                <Button variant="contained"
                startIcon={<FaGoogle />}
                
                 color="primary" onClick={() => signIn('google')}>
                    Log In with Google
                </Button>
            
            
                <Button variant="contained"
                startIcon={<FaGithub />}
                sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}
                 color="primary" onClick={() => signIn('github')}>
                    Log In with GitHub
                </Button>
          
           
                <Button variant="contained"
                startIcon={<FaFacebook />}
                 color="primary" onClick={() => signIn('facebook')}>
                    Log In with Facebook
                </Button>
            
       
                <Button variant="contained"
                startIcon={<FaDiscord />}
                sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}
                 color="primary" onClick={() => signIn('discord')}>
                    Log In with Discord
                </Button>
        
        
                <Button variant="contained"
                startIcon={<FaTwitter />}

            sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}

                 color="primary" onClick={() => signIn('twitter')}>
                    Log In with Twitter
                </Button>
            


        </Box>

        </Box>

    );
}
