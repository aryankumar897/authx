// pages/auth/error.js
import { Box, Typography } from '@mui/material';

export default function Error({ error }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <Typography variant="h4" component="h1">Error</Typography>
            <Typography variant="body1">{error}</Typography>
        </Box>
    );
}
