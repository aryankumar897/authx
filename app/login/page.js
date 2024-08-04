

// "use client"; // Ensure this is at the top for Next.js to handle the client-side component
// import { FaGoogle, FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";
// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
// import { signIn } from 'next-auth/react';
// import BeatLoader from "react-spinners/BeatLoader";
// import Link from 'next/link'
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import Grid from "@mui/material/Grid";
// import { getCsrfToken } from 'next-auth/react';
// export default function SignupForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errors, setErrors] = useState({});
//     const [serverMessage, setServerMessage] = useState('');
//     const [blockedUntil, setBlockedUntil] = useState(null);
//     const [timeLeft, setTimeLeft] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const [csrfToken, setCsrfToken] = useState('');

//     useEffect(() => {
//         const fetchCsrfToken = async () => {
//             const token = await getCsrfToken();
//             setCsrfToken(token);
//         };

//         fetchCsrfToken();
//     }, []);






//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

 
 
//     useEffect(() => {
//         // Load blockedUntil from localStorage if it exists
//         const savedBlockedUntil = localStorage.getItem('blockedUntil');
//         if (savedBlockedUntil) {
//             const savedTime = parseInt(savedBlockedUntil, 10);
//             if (savedTime > Date.now()) {
//                 setBlockedUntil(savedTime);
//                 setTimeLeft((savedTime - Date.now()) / 1000);
//             } else {
//                 localStorage.removeItem('blockedUntil');
//             }
//         }
//     }, []);

//     useEffect(() => {
//         let timer;
//         if (blockedUntil) {
//             timer = setInterval(() => {
//                 const now = Date.now();
//                 const secondsLeft = Math.max((blockedUntil - now) / 1000, 0);
//                 setTimeLeft(secondsLeft);

//                 if (secondsLeft <= 0) {
//                     clearInterval(timer);
//                     setBlockedUntil(null);
//                     setTimeLeft(0);
//                     setServerMessage("")
//                     localStorage.removeItem('blockedUntil');
//                 }
//             }, 1000);
//         }

//         return () => clearInterval(timer);
//     }, [blockedUntil]);

//     useEffect(() => {
//         if (blockedUntil) {
//             localStorage.setItem('blockedUntil', blockedUntil);
//         } else {
//             localStorage.removeItem('blockedUntil');
//         }
//     }, [blockedUntil]);

//     const validateForm = () => {
//         const errors = {};

//         if (!email) {
//             errors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(email)) {
//             errors.email = 'Email is invalid';
//         }
//         if (!password) errors.password = 'Password is required';
//         setErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setServerMessage('');

//         if (!validateForm()) return;
//         setLoading(true)
//         try {
//             const result = await signIn('credentials', {
//                 redirect: false,
//                 email,
//                 password,
//             });

//             if (!result.ok) {
//                 const errorMessage = result.error;
//                 console.log(errorMessage);
//                 setLoading(false)
//                 const match = errorMessage.match(/Try again in (\d+) seconds/);
//                 if (match) {
//                     const seconds = parseInt(match[1], 10);
//                     const unblockTime = Date.now() + seconds * 1000;
//                     setBlockedUntil(unblockTime);
//                     setTimeLeft(seconds);
//                     localStorage.setItem('blockedUntil', unblockTime.toString());
//                 }

//                 setServerMessage(errorMessage);
//             } else {
//                 setServerMessage('Signup successful!');
//                 setLoading(false)
//             }
//         } catch (error) {
//             setLoading(false)
//             setServerMessage('An unexpected error occurred');
//         }
//     };

//     return (
//         <Box sx={{ backgroundImage: 'url(/image/auth.jpg)',
        
        
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             width: '100%',
//             height: '100vh',
//             justifyContent: 'center',
//             alignItems: 'center',
//             padding: '20px',
        
        
        
//          }}   >

//         <Box
     
           
//                 method="post"
//                 action="/api/auth/callback/credentials"


//             component="form"
//             onSubmit={handleSubmit}
            
//             sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto',
            
//                 backgroundColor: 'rgba(0, 0, 0, 0.6)',
//               marginTop:"29px",
//                 padding: '40px',
//                  color:"white"
//              }}
    
    
//         >
//                 <input name="csrfToken" type="hidden" value={csrfToken} />
//             <Typography variant="h4" component="h1" gutterBottom>
//                 Sign In
//             </Typography>



//             {serverMessage && (
//                 <Alert severity={blockedUntil ? 'error' : 'success'}>
//                     {serverMessage} {timeLeft>0 ? Math.ceil(timeLeft) :""  }
//                 </Alert>
//             )}

//             <TextField
//                 label="Email"
//                 variant="outlined"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 error={!!errors.email}
//                 helperText={errors.email}
//                 fullWidth
//                 disabled={!!blockedUntil}

//                     InputLabelProps={{
//                         style: { color: 'white' },
//                     }}
//                     InputProps={{
//                         style: {
//                             color: '#fff',
//                             borderColor: 'white',
//                         },
//                     }}
//                     sx={{
//                         input: { color: 'white' },
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': {
//                                 borderColor: 'white',
//                             },
//                             '&:hover fieldset': {
//                                 borderColor: 'white',
//                             },
//                             '&.Mui-focused fieldset': {
//                                 borderColor: 'white',
//                             },
//                         },
//                     }}

//             />
//             <TextField
//                 label="Password"
//                     type={showPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={!!errors.password}
//                 helperText={errors.password}
//                 fullWidth



                
//                 disabled={!!blockedUntil}
//                     InputLabelProps={{
//                         style: { color: 'white' },
//                     }}
//                     InputProps={{
//                         style: {
//                             color: '#fff',
//                             borderColor: 'white',

//                         },
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <IconButton onClick={togglePasswordVisibility} edge="end">
//                                     {showPassword ? <VisibilityOff
//                                         sx={{ color: "white" }}

//                                     /> : <Visibility

//                                         sx={{ color: "white" }}
//                                     />}
//                                 </IconButton>
//                             </InputAdornment>
//                         ),
//                     }}
//                     sx={{
//                         input: { color: 'white' },
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': {
//                                 borderColor: 'white',
//                             },
//                             '&:hover fieldset': {
//                                 borderColor: 'white',
//                             },
//                             '&.Mui-focused fieldset': {
//                                 borderColor: 'white',
//                             },
//                         },
//                     }}

//             /><Link href="/forgot-password" variant="body2" align="right">
//                 Forgot password?
//             </Link>
//                 <Link href="/register" variant="body2" align="right">
//          Register?
//                 </Link>
//             <Button type="submit" variant="contained" color="primary" disabled={!!blockedUntil}>
//                 {loading ? <BeatLoader

//                     loading={loading}
//                     color="#fff"
//                     size={20}
//                     aria-label="Loading Spinner"
//                     data-testid="loader"
//                 /> : "sign in"}
//             </Button>


          
//                 <Button variant="contained"
//                 startIcon={<FaGoogle />}
                
//                  color="primary" onClick={() => signIn('google')}>
//                     Log In with Google
//                 </Button>
            
            
//                 <Button variant="contained"
//                 startIcon={<FaGithub />}
//                 sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}
//                  color="primary" onClick={() => signIn('github')}>
//                     Log In with GitHub
//                 </Button>
          
           
//                 <Button variant="contained"
//                 startIcon={<FaFacebook />}
//                  color="primary" onClick={() => signIn('facebook')}>
//                     Log In with Facebook
//                 </Button>
            
       
//                 <Button variant="contained"
//                 startIcon={<FaDiscord />}
//                 sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}
//                  color="primary" onClick={() => signIn('discord')}>
//                     Log In with Discord
//                 </Button>
        
        
//                 <Button variant="contained"
//                 startIcon={<FaTwitter />}

//             sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }}

//                  color="primary" onClick={() => signIn('twitter')}>
//                     Log In with Twitter
//                 </Button>
            


//         </Box>

//         </Box>

//     );
// }








"use client"; // Ensure this is at the top for Next.js to handle the client-side component
console.log("The 'use client' directive is used to ensure this component is rendered on the client side, not on the server.");

// Import necessary modules and components
import { FaGoogle, FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";
console.log("Imported icon components for Google, GitHub, Facebook, Discord, and Twitter from react-icons/fa.");

import React, { useState, useEffect } from 'react';
console.log("Imported React and its hooks: useState and useEffect for managing state and side effects.");

import { TextField, Button, Box, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
console.log("Imported MUI components for building the UI: TextField (input fields), Button (buttons), Box (layout container), Typography (text), Alert (notification), InputAdornment (input adornments), and IconButton (button with icons).");

import { signIn } from 'next-auth/react';
console.log("Imported signIn function from next-auth/react to handle authentication with different providers.");

import BeatLoader from "react-spinners/BeatLoader";
console.log("Imported BeatLoader from react-spinners for displaying a loading spinner while authentication is in progress.");

import Link from 'next/link';
console.log("Imported Link component from next/link for client-side navigation between pages.");

import { Visibility, VisibilityOff } from '@mui/icons-material';
console.log("Imported Visibility and VisibilityOff icons from @mui/icons-material to toggle password visibility.");

import Grid from "@mui/material/Grid";
console.log("Imported Grid component from MUI for layout purposes.");

import { getCsrfToken } from 'next-auth/react';
console.log("Imported getCsrfToken function from next-auth/react to fetch a CSRF token for security.");

export default function SignupForm() {
    console.log("SignupForm component function declared.");

    // State variables
    const [email, setEmail] = useState('');
    console.log("Initialized email state variable with an empty string.");

    const [password, setPassword] = useState('');
    console.log("Initialized password state variable with an empty string.");

    const [errors, setErrors] = useState({});
    console.log("Initialized errors state variable as an empty object to store validation errors.");

    const [serverMessage, setServerMessage] = useState('');
    console.log("Initialized serverMessage state variable with an empty string to store messages from the server.");

    const [blockedUntil, setBlockedUntil] = useState(null);
    console.log("Initialized blockedUntil state variable as null to track if the user is blocked from submitting.");

    const [timeLeft, setTimeLeft] = useState(0);
    console.log("Initialized timeLeft state variable to 0 for tracking the remaining block time.");

    const [loading, setLoading] = useState(false);
    console.log("Initialized loading state variable as false to indicate whether the form is being submitted.");

    const [showPassword, setShowPassword] = useState(false);
    console.log("Initialized showPassword state variable as false to control the visibility of the password.");

    const [csrfToken, setCsrfToken] = useState('');
    console.log("Initialized csrfToken state variable with an empty string to store the CSRF token.");

    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            console.log("Fetching CSRF token from server...");
            const token = await getCsrfToken();
            console.log("Received CSRF token:", token);
            setCsrfToken(token);
        };

        fetchCsrfToken();
    }, []); // Empty dependency array means this runs once on component mount
    console.log("useEffect hook to fetch CSRF token has been set up.");

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        console.log("Password visibility toggled. Now showPassword is:", !showPassword);
    };

    // Load blockedUntil from localStorage when the component mounts
    useEffect(() => {
        const savedBlockedUntil = localStorage.getItem('blockedUntil');
        if (savedBlockedUntil) {
            const savedTime = parseInt(savedBlockedUntil, 10);
            if (savedTime > Date.now()) {
                setBlockedUntil(savedTime);
                setTimeLeft((savedTime - Date.now()) / 1000);
                console.log("Loaded blockedUntil from localStorage:", savedTime, "Time left:", (savedTime - Date.now()) / 1000);
            } else {
                localStorage.removeItem('blockedUntil');
                console.log("BlockedUntil time has expired. Removed from localStorage.");
            }
        }
    }, []); // Runs once on component mount
    console.log("useEffect hook to load blockedUntil from localStorage has been set up.");

    // Update timeLeft every second if blockedUntil is set
    useEffect(() => {
        let timer;
        if (blockedUntil) {
            timer = setInterval(() => {
                const now = Date.now();
                const secondsLeft = Math.max((blockedUntil - now) / 1000, 0);
                setTimeLeft(secondsLeft);
                console.log("Timer updated. Seconds left:", secondsLeft);

                if (secondsLeft <= 0) {
                    clearInterval(timer);
                    setBlockedUntil(null);
                    setTimeLeft(0);
                    setServerMessage("");
                    localStorage.removeItem('blockedUntil');
                    console.log("Blocking period ended. Resetting states and localStorage.");
                }
            }, 1000);
        }

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [blockedUntil]);
    console.log("useEffect hook to update timeLeft has been set up.");

    // Save blockedUntil to localStorage whenever it changes
    useEffect(() => {
        if (blockedUntil) {
            localStorage.setItem('blockedUntil', blockedUntil);
            console.log("Saved blockedUntil to localStorage:", blockedUntil);
        } else {
            localStorage.removeItem('blockedUntil');
            console.log("Removed blockedUntil from localStorage.");
        }
    }, [blockedUntil]);
    console.log("useEffect hook to save blockedUntil to localStorage has been set up.");

    // Validate form inputs
    const validateForm = () => {
        const errors = {};

        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
        }
        if (!password) errors.password = 'Password is required';
        setErrors(errors);
        console.log("Form validation errors:", errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submit event triggered.");
        setServerMessage('');

        if (!validateForm()) return;
        setLoading(true);
        console.log("Form is valid. Setting loading to true.");

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });
            console.log("signIn result:", result);

            if (!result.ok) {
                const errorMessage = result.error;
                console.log("Error during signIn:", errorMessage);
                setLoading(false);
                const match = errorMessage.match(/Try again in (\d+) seconds/);
                if (match) {
                    const seconds = parseInt(match[1], 10);
                    const unblockTime = Date.now() + seconds * 1000;
                    setBlockedUntil(unblockTime);
                    setTimeLeft(seconds);
                    localStorage.setItem('blockedUntil', unblockTime.toString());
                    console.log("User is blocked for", seconds, "seconds. Updated state and localStorage.");
                }

                setServerMessage(errorMessage);
            } else {
                setServerMessage('Signup successful!');
                setLoading(false);
                console.log("Signup successful! Updated state to reflect success.");
            }
        } catch (error) {
            setLoading(false);
            setServerMessage('An unexpected error occurred');
            console.log("Unexpected error during signIn:", error);
        }
    };

    // JSX for rendering the form
    return (

<h1>gi</h1>

        // <Box sx={{ backgroundImage: 'url(/image/auth.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        //     <Box method="post" action="/api/auth/callback/credentials" component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto', backgroundColor: 'rgba(0, 0, 0, 0.6)', marginTop: "29px", padding: '40px', color: "white" }}>
        //         <input name="csrfToken" type="hidden" value={csrfToken} />
        //         <Typography variant="h4" component="h1" gutterBottom>
        //             Sign In
        //         </Typography>

        //         {serverMessage && (
        //             <Alert severity={blockedUntil ? 'error' : 'success'}>
        //                 {serverMessage} {timeLeft > 0 ? Math.ceil(timeLeft) : ""}
        //             </Alert>
        //         )}

        //         <TextField
        //             label="Email"
        //             variant="outlined"
        //             value={email}
        //             onChange={(e) => setEmail(e.target.value)}
        //             error={!!errors.email}
        //             helperText={errors.email}
        //             fullWidth
        //             disabled={!!blockedUntil}
        //             InputLabelProps={{ style: { color: 'white' } }}
        //             InputProps={{ style: { color: '#fff', borderColor: 'white' }, }}
        //             sx={{ input: { color: 'white' }, 
        //             '& .MuiOutlinedInput-root': 
        //             { '& fieldset': { borderColor: 'white' },
                    
        //              '&:hover fieldset': { borderColor: 'white' },
        //               '&.Mui-focused fieldset': { borderColor: 'white' },
        //                } }
        //      />
               
               
               
        //                 <TextField
        //                     label="Password"
        //                     type={showPassword ? 'text' : 'password'}
        //                     variant="outlined"
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                     error={!!errors.password}
        //                     helperText={errors.password}
        //                     fullWidth
        //                     disabled={!!blockedUntil}
        //                     InputLabelProps={{ style: { color: 'white' } }}
        //                     InputProps={{
        //                         style: { color: '#fff', borderColor: 'white' }, endAdornment: (
        //                             <InputAdornment position="end">
        //                                 <IconButton onClick={togglePasswordVisibility} edge="end">
        //                                     {showPassword ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
        //                                 </IconButton>
        //                             </InputAdornment>
        //                         ),
        //                     }}
        //                     sx={{ input: { color: 'white' }, 
        //                     '& .MuiOutlinedInput-root': 
        //                     { '& fieldset': { borderColor: 'white' },
        //                      '&:hover fieldset': { borderColor: 'white' },
        //                       '&.Mui-focused fieldset': { borderColor: 'white' },
        //                        } }
        //          />
        //         <Link href="/forgot-password" variant="body2" align="right">
        //             Forgot password?
        //         </Link>
        //         <Link href="/register" variant="body2" align="right">
        //             Register?
        //         </Link>


        //         <Button type="submit" variant="contained" color="primary" disabled={!!blockedUntil}>
        //             {loading ? <BeatLoader loading={loading} color="#fff" size={20} aria-label="Loading Spinner" data-testid="loader" /> : "Sign in"}
        //         </Button>

        //         <Button variant="contained" startIcon={<FaGoogle />} color="primary" onClick={() => signIn('google')}>
        //             Log In with Google
        //         </Button>
        //         <Button variant="contained" startIcon={<FaGithub />} sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }} color="primary" onClick={() => signIn('github')}>
        //             Log In with GitHub
        //         </Button>
        //         <Button variant="contained" startIcon={<FaFacebook />} color="primary" onClick={() => signIn('facebook')}>
        //             Log In with Facebook
        //         </Button>
        //         <Button variant="contained" startIcon={<FaDiscord />} sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }} color="primary" onClick={() => signIn('discord')}>
        //             Log In with Discord
        //         </Button>
        //         <Button variant="contained" startIcon={<FaTwitter />} sx={{ backgroundColor: '#db4437', color: 'white', '&:hover': { backgroundColor: '#c33d2f' } }} color="primary" onClick={() => signIn('twitter')}>
        //             Log In with Twitter
        //         </Button>
        //     </Box>
        // </Box>
    );
}
console.log("Rendered SignupForm component with MUI form elements and authentication buttons.");
