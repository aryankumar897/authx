"use client"; // Ensure this is at the top for Next.js to handle the client-side component

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import Track from "@/components/track/Track"
export default function ProfileUpdateForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) errors.password = 'Password is required';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('');
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        const response = await fetch(`${process.env.API}/profile`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response?.ok) {
            setIsSuccess(false);
            setServerMessage(data?.err);
        } else {
            setIsSuccess(true);
            setServerMessage(data.msg);
        }
    };

    return (
        <>
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
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' }, // Column layout for xs (extra small) and row layout for sm (small) and above
                        gap: 2,
                        maxWidth: 800,
                        margin: '0 auto',
                        padding: 2, // Add padding for better spacing on smaller screens
                        overflow: 'hidden',


                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        marginTop: "29px",
                        padding: '40px',
                        color: "white"



                        // Prevents image overflow on smaller screens
                    }}
                >
                    <Box
                        sx={{
                            order: { xs: 2, sm: 1 }, // Reverse order for xs and normal order for sm and above
                            flex: { xs: 'none', sm: 1 }, // No flex for xs, 1 for sm and above
                            textAlign: { xs: 'center', sm: 'left' }, // Center align for xs, left align for sm and above
                        }}
                    >
                        {profileImagePreview && (
                            <Box mt={2} textAlign="center">
                                <div className="image-container">
                                    <img src={profileImagePreview} alt="Profile Preview" className="profile-image" />
                                </div>
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            order: { xs: 1, sm: 2 }, // Reverse order for xs and normal order for sm and above
                            flex: { xs: 1, sm: 2 }, // 1 for xs, 2 for sm and above
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Update Profile
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
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
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
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
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
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                        >
                            Upload Profile Image
                            <input
                                type="file"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Button type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Update Profile
                        </Button>
                    </Box>
                    <style jsx>{`
                .image-container {
                    width: 280px;
                    height: 280px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-top:50px;
                    display: inline-block;
                    padding: 5px; /* Space between the image and border */
                    background: linear-gradient(45deg, rgba(238, 130, 238, 1), rgba(255, 192, 203, 1), rgba(255, 165, 0, 1));
                    background-size: 200% 200%;
                    animation: gradientAnimation 2s ease infinite;
                }
                .profile-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
                @keyframes gradientAnimation {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
                </Box>


            </Box>
            <Box sx={{
                backgroundImage: 'url(/image/auth.jpg)',






            }}   >

                <Track />

            </Box>
        </>
    );
}
