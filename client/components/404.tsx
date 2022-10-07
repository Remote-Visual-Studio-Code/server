import React from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const NotFound: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
                404
            </Typography>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Page Not Found
            </Typography>
            <Button variant="contained" href="/">
                Go back home
            </Button>
        </Box>
    );
};

export default NotFound;