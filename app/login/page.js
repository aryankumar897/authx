"use client"
// components/SignupForm.js
import React, { useState, useEffect } from 'react';
import { Alert, Button, Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link'
import BeatLoader from "react-spinners/BeatLoader";
import { SiAuth0 } from "react-icons/si";
import { signIn } from 'next-auth/react'
import { getCsrfToken } from 'next-auth/react';
import { FaGoogle, FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";

export default function SignInForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [blockedUntil, setBlockedUntil] = useState(null)

    const [timeLeft, setTimeLeft] = useState(0)

    const [csrfToken, setCsrfToken] = useState('')

    //load blockedUntill from localstorage when the component mount

    useEffect(() => {

        const fetchCsrfToken = async () => {

            const token = await getCsrfToken()
            setCsrfToken(token)


        }
    }, [])




    useEffect(() => {

        const savedBlockedUntil = localStorage.getItem('blockedUntil')

        if (savedBlockedUntil) {

            const savedTime = parseInt(savedBlockedUntil, 10)


            if (savedTime > Date.now()) {

                setBlockedUntil(savedTime)

                setTimeLeft((savedTime - Date.now()) / 1000)
                console.log("Loaded blockedUntil from  localstorage", savedTime, "time left", (savedTime - Date.now()) / 1000)

            } else {
                localStorage.removeItem("blockedUntil")
            }


        }



    }, [])//run once on component mount



    //update timeLeft every sec if  the  blockedUntill is set 



    useEffect(() => {

        let timer;
        if (blockedUntil) {


            timer = setInterval(() => {


                const now = Date.now();
                const secondsLeft = Math.max((blockedUntil - now) / 1000, 0)

                setTimeLeft(secondsLeft)

                console.log("timer updaet second  left", secondsLeft)

                if (secondsLeft <= 0) {



                    clearInterval(timer);
                    setBlockedUntil(null)
                    setTimeLeft(0)
                    setServerMessage("")
                    localStorage.removeItem('blockedUntil')

                    console.log(('blocking period ended,  reseting states and localstorage'))
                }




            }, 1000)

        }



        return () => clearInterval(timer)


    }, [blockedUntil])

    console.log("useEffect  hook  to update timeLeft has been setUp")


    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



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


        try {
            setLoading(true)
            const result = await signIn('credentials', {


                redirect: false,
                email,
                password,
            })


            console.log("response", result);
            if (!result.ok) {
                console.log(result.error)

                const errorMessage = result.error;
                setLoading(false)
                const match = errorMessage.match(/Try again in (\d+) seconds/)

                if (match) {


                    const seconds = parseInt(match[1], 10)

                    const unblockTime = Date.now() + seconds * 1000;
                    setBlockedUntil(unblockTime)
                    setTimeLeft(seconds)

                    localStorage.setItem('blockedUntil', unblockTime.toString())


                }



                setIsSuccess(false);
                setServerMessage(result.error);
                setLoading(false)
            } else {

                setLoading(false)
                setIsSuccess(true);
                setServerMessage("successfully login");
            }
        } catch (err) {
            console.log(err)

            setIsSuccess(false);
            setServerMessage("something went wrong");
            setLoading(false)

        }
    };

    return (
        <Box
            sx={{
                backgroundImage: 'url(/image/auth.jpg)',


                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',



            }}


        >


            <Box

                method="post"
                action="/api/auth/callback/credentials"

                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex', flexDirection: 'column',
                    gap: 2, maxWidth: 600, margin: '0 auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    marginTop: "29px",
                    padding: '40px',
                    color: "white"



                }}


            >

                <input

                    name="csrfToken"
                    type="hidden"


                    value={csrfToken}


                />

                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>
                {serverMessage && !timeLeft && (
                    <Alert severity={isSuccess ? 'success' : 'error'}>

                        {serverMessage}



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
                    fullWidth
                    value={password}
                    onChange={handlePasswordChange}
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


                    InputLabelProps={{
                        style: { color: 'white' },
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


                <Button variant="outlined"


                    disabled={!!blockedUntil}

                    color="primary" onClick={handleSubmit} sx={{ marginTop: 1 }}>



                    {loading ? <BeatLoader

                        loading={loading}

                        color="#fff"
                        size={20}


                    /> : "submit"}




                </Button>

                {serverMessage && timeLeft > 0 && (
                    <Alert severity={isSuccess ? 'success' : 'error'}>




                        <Typography variant="body1" component="body1" gutterBottom>
                            Time left  to  reset :{Math.ceil(timeLeft)}
                        </Typography>

                    </Alert>
                )}

                <Link

                    href='/forgot-password'
                    align="right"
                    variant="body2"

                >
                    forgot-password?
                </Link>


                <Link

                    href='/register'
                    align="right"
                    variant="body2"

                >
                    register?
                </Link>


                <Button

                    variant='outlined'
                    startIcon={<FaGoogle


                        style={{

                            color: "red"

                        }}


                    />}


                    onClick={() => signIn('google')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with Google

                </Button>



                <Button

                    variant='outlined'
                    startIcon={<FaGithub


                        style={{

                            color: "red"

                        }}


                    />}


                    onClick={() => signIn('github')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with Github

                </Button>






                <Button

                    variant='outlined'
                    startIcon={<FaDiscord


                        style={{

                            color: "red"

                        }}


                    />}


                    onClick={() => signIn('discord')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with Discord

                </Button>


                <Button

                    variant='outlined'
                    startIcon={<FaTwitter


                        style={{

                            color: "red"

                        }}


                    />}


                    onClick={() => signIn('twitter')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with Twitter

                </Button>

                <Button

                    variant='outlined'
                    startIcon={<FaFacebook


                        style={{

                            color: "red"

                        }}


                    />}


                    onClick={() => signIn('facebook')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with  Facebook

                </Button>


                <Button

                    variant='outlined'
                    startIcon={<SiAuth0


                        style={{

                            color: "white"

                        }}


                    />}


                    onClick={() => signIn('auth0')}

                    sx={{
                        color: 'white',
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
                >

                    Log In with  Auth0

                </Button>


            </Box>
        </Box>
    );
}


