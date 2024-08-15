// components/DeviceDetails.js


"use client"

// components/DeviceDetails.js

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box
} from '@mui/material';

const DeviceDetails = () => {
    const [deviceDetails, setDeviceDetails] = useState({
        screenWidth: '',
        screenHeight: '',
        deviceType: '',
        browserName: '',
        browserVersion: '',
        os: '',
        timezone: '',
    });

    const navigator = navigator

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            try {
                // Collect client-side data
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Detect browser and OS
                const userAgent = navigator.userAgent;
                console.log(userAgent);
                let browserName = 'Unknown';
                let browserVersion = 'Unknown';
                let os = 'Unknown';
                let deviceType = 'Unknown';

                if (/Android/.test(userAgent)) os = 'Android';
                else if (/iPhone|iPad|iPod/.test(userAgent)) os = 'iOS';
                else if (/Windows NT/.test(userAgent)) os = 'Windows';
                else if (/Mac OS X/.test(userAgent)) os = 'MacOS';

                if (/Chrome/.test(userAgent)) {
                    browserName = 'Chrome';
                    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1];
                } else if (/Safari/.test(userAgent)) {
                    browserName = 'Safari';
                    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)?.[1];
                } else if (/Firefox/.test(userAgent)) {
                    browserName = 'Firefox';
                    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1];
                } else if (/MSIE|Trident/.test(userAgent)) {
                    browserName = 'Internet Explorer';
                    browserVersion = userAgent.match(/(MSIE \d+\.\d+|rv:\d+\.\d+)/)?.[1];
                } else if (/Edge/.test(userAgent)) {
                    browserName = 'Edge';
                    browserVersion = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1];
                } else if (/Brave/.test(userAgent)) {
                    browserName = 'Brave';
                    browserVersion = userAgent.match(/Brave\/(\d+\.\d+)/)?.[1];
                }

                if (screenWidth <= 768) deviceType = 'Mobile';
                else if (screenWidth <= 1024) deviceType = 'Tablet';
                else deviceType = 'Desktop';

                setDeviceDetails({
                    screenWidth,
                    screenHeight,
                    timezone,
                    browserName,
                    browserVersion,
                    os,
                    deviceType,
                });
            } catch (error) {
                console.error('Error fetching device details:', error);
            }
        };

        fetchDeviceDetails();
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" >
            <Box width="100%" maxWidth="lg" p={3} boxShadow={3} borderRadius={8}>
                <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: 20,color:"white" }}>
                    Device Details
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="Device details table">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Attribute</strong></TableCell>
                                <TableCell><strong>Value</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow hover>
                                <TableCell><strong>User Agent</strong></TableCell>
                                <TableCell>{navigator.userAgent}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Platform</strong></TableCell>
                                <TableCell>{navigator.platform}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Language</strong></TableCell>
                                <TableCell>{navigator.language}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Screen Width</strong></TableCell>
                                <TableCell>{deviceDetails.screenWidth}px</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Screen Height</strong></TableCell>
                                <TableCell>{deviceDetails.screenHeight}px</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Device Type</strong></TableCell>
                                <TableCell>{deviceDetails.deviceType}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Browser Name</strong></TableCell>
                                <TableCell>{deviceDetails.browserName}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Browser Version</strong></TableCell>
                                <TableCell>{deviceDetails.browserVersion}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Operating System</strong></TableCell>
                                <TableCell>{deviceDetails.os}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell><strong>Timezone</strong></TableCell>
                                <TableCell>{deviceDetails.timezone}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default DeviceDetails;
