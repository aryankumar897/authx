"use client"


import { useState, useEffect } from 'react';

export default function CookieConsent () {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        localStorage.setItem('analytics', 'enabled');
        setShowBanner(false);
        window.location.reload(); // Reload to apply Google Analytics script
    };

    const rejectCookies = () => {
        localStorage.setItem('cookie_consent', 'rejected');
        localStorage.removeItem('analytics');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-banner">
            <p>We use cookies to improve your experience on our site. By accepting, you consent to our use of cookies.</p>
            <button onClick={acceptCookies}>Accept</button>
            <button onClick={rejectCookies}>Reject</button>
        </div>
    );
};


