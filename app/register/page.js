"use client"
// components/SignupForm.js
import React, { useState } from 'react';
import { Alert , Button, Box, TextField, Stepper, Step, StepLabel, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link'
import BeatLoader from "react-spinners/BeatLoader";

import ReCAPTCHA from 'react-google-recaptcha';
import zxcvbn from 'zxcvbn';




const CaptchaProtectionPopup = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
           
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                backgroundColor: 'rgb(33, 179, 255)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                zIndex: 9999, // Ensure it's on top
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzHPIg1vi9om7i-Uo1drOVBBytptqaXrqtZWr8Q_PGyWsmTy2QSUSrOGd9S27Ma3fNroA&usqp=CAU" alt="reCAPTCHA logo" style={{ height: '60px', padding: '10px 10px', }} />
         protected by Google reCAPTCHA.
            {hovered && (
                <Typography variant="body2" sx={{ marginTop: 1,  }}
                  
                >
                    <a href="https://policies.google.com/privacy?hl=en" style={{ color: '#fff',
                     }} target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                    </a>
                </Typography>
            )}
        </Box>
    );
};
export default function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [score, setScore] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        const evaluation = zxcvbn(newPassword);
        setScore(evaluation.score);
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getColor = (score) => {
        switch (score) {
            case 0:
                return 'white';
            case 1:
                return 'orange';
            case 2:
                return 'yellow';
            case 3:
                return 'lightgreen';
            case 4:
                return 'green';
            default:
                return 'gray';
        }
    };


    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) errors.password = 'Password is required';
        if (!recaptchaToken) errors.recaptcha = 'Please complete the reCAPTCHA';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('');
        if (!validateForm()) return;
        setLoading(true)
        const response = await fetch(`${process.env.API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, recaptchaToken }),
        });

        const data = await response.json();
        console.log(response);
        if (!response?.ok) {
            setIsSuccess(false);
            setServerMessage(data?.err);
            setLoading(false)
        } else {
         
            setLoading(false)
            setIsSuccess(true);
            setServerMessage(data.msg);
        }
    };

    return (
<Box   
            sx={{
                backgroundImage: 'url(/image/auth.jpg)',


                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',



            }} 


   >


        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column',
             gap: 2, maxWidth: 600, margin: '0 auto' ,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                marginTop: "29px",
                padding: '40px',
                color: "white"
             
             
             
             }}
      
      
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Sign Up
            </Typography>
            {serverMessage && (
                <Alert severity={isSuccess ? 'success' : 'error'}>{serverMessage}</Alert>
            )}
            <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
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
                                 sx={{color:"white"}}
                                
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
            <Box mt={2} mb={2}>
                <Stepper activeStep={score} alternativeLabel>
                    {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'].map((label, index) => (
                        <Step key={label}>
                            <StepLabel StepIconProps={{ style: { color: score >= index ? getColor(score) : 'gray' } }}>
                           

                                <Typography variant="body3" component="body3" sx={{
                                    color:"white"
                                }}>
                                    {label}
                                </Typography>

                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            
            <ReCAPTCHA
                sitekey="6LevkGgbAAAAAAisYTVPCnpe_pZNn_6KQrn0OFHi"
                onChange={setRecaptchaToken}
            />
            {errors.recaptcha && <p style={{ color: 'red' }}>{errors.recaptcha}</p>}
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 1 }}>


                {loading ? <BeatLoader

                    loading={loading}
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                /> : "submit"}
            </Button>
            <Link href="/login" variant="body2" align="right">
               Login?
            </Link>
            {recaptchaToken && <CaptchaProtectionPopup />}
        </Box>
        </Box>
    );
}
