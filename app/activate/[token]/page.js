// pages/activate/[token].js

"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';

const Activate = ({ params }) => {
    const { token } = params;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const hasActivatedRef = useRef(false); // Ref to prevent multiple executions

    useEffect(() => {
        if (token && !hasActivatedRef.current) {
            hasActivatedRef.current = true; // Set ref to true to prevent further executions
            activateAccount();
        }
    }, [token]);

    const activateAccount = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/activate/${token}`);
            const data = await response.json();

            if (!response.ok) {
                setMessage(data?.err || 'Error activating account');
            } else {
                setMessage(data?.msg);
            }
        } catch (error) {
            console.log(error);
            setMessage('Error activating account');
        } finally {
            setLoading(false);
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
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 600,
                    margin: '0 auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    marginTop: '29px',
                    padding: '40px',
                    color: 'white',
                }}
            >
                {loading ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}
                    >
                        <CircularProgress />
                        <Typography variant="h6" style={{ marginLeft: '10px' }}>
                            Activating your account...
                        </Typography>
                    </div>
                ) : (
                    <Typography variant="h4" sx={{ color: 'white' }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Activate;
