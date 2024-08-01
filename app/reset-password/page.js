"use client"


import React, { useState, useRef, useEffect, } from 'react';

import BeatLoader from "react-spinners/BeatLoader";


import { TextField, Box, Button, Alert, Divider, Typography } from '@mui/material';
// InputOTP Component
const InputOTP = ({ maxLength }) => {
    const [otp, setOtp] = useState(Array(maxLength).fill(''));
    const inputRefs = useRef([]);
    const [serverMessage, setServerMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < maxLength - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('Sending data to server...');
        setLoading(true);

        // Prepare the data to be sent
        const data = {
            resetCode: otp.join(''), // assuming OTP is an array of characters
            newPassword: password,
        };

        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Assuming backend response is successful
                setIsSuccess(true);
                setServerMessage('Data sent successfully.');
                // Reset OTP and Password fields
                setOtp(Array(maxLength).fill(''));
                setPassword('');
            } else {
                // Handle error response from the backend
                const errorData = await response.json();
                setServerMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            // Handle network or other errors
            setServerMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (

        <Box sx={{
            backgroundImage: 'url(/image/auth.jpg)',


            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',



        }}   >
          
        <Box 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2,
             maxWidth: 600, margin: '0 auto' ,


                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    marginTop: "69px",
                    padding: '40px',
                    color: "white"
             
             }}>
       
           
                <Typography variant="h4" component="h1" gutterBottom>
                    reset password
                </Typography>
                {serverMessage && (
                    <Alert severity={isSuccess ? 'success' : 'error'} sx={{ marginTop: 1 }}>
                        {serverMessage}
                    </Alert>
                )}
           
            <Box >
            {Array.from({ length: maxLength }, (_, index) => (
                <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}


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
                        width: 50,
                        margin: '0 16px',
                        '&:focus': {
                            borderWidth: '20px', // Increase border width on focus
                            borderColor: 'white' 
                          
                        },


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
            ))}

</Box>
                <Divider sx={{  borderColor: 'blue' }} />

            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}

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


            <Button variant="contained" color="primary" onClick={handleFormSubmit} sx={{ marginTop: 1 }}>
               

                    {loading ? <BeatLoader
                       
                        loading={loading}
                        color="#fff"
                        size={20}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />:"submit"}
            </Button>
          

        </Box>

        </Box>
    );
};

// Page Component
export default function InputOTPDemo() {


   



    return ( 
<>
        <InputOTP maxLength={6} />
            

        </>
     )
}
