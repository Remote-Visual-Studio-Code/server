import React from 'react';

import Button from '@mui/material/Button';

const Home: React.FC = () => {
    return (
        <Button variant="contained" onClick={() => (window.location.href = '/editor')}>
            Editor
        </Button>
    );
};

export default Home;
