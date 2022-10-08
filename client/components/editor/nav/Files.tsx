import React from 'react';

import { SpeedDial, Box, SpeedDialIcon, SpeedDialAction } from '@mui/material';

import { styled } from '@mui/material/styles';

import UploadFileFilled from '@mui/icons-material/UploadFile';
import FolderFilled from '@mui/icons-material/Folder';
import CloudFilled from '@mui/icons-material/Cloud';

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
    '& .MuiSpeedDial-fab': {
        width: 40,
        height: 40,
    },
}));

const filesSpeedDialActions = [
    { icon: <UploadFileFilled />, name: 'Upload' },
    { icon: <FolderFilled />, name: 'Add folder' },
    { icon: <CloudFilled />, name: 'Add file' },
];

export default function Files(): JSX.Element {
    return (
        <div>
            <p style={{ marginLeft: 16, marginTop: 5, paddingTop: 10 }}>Files</p>

            {/* Speed dial */}
            <Box sx={{ position: 'relative', mt: 4, paddingTop: 0 }}>
                <StyledSpeedDial
                    ariaLabel="Actions"
                    hidden={false}
                    icon={<SpeedDialIcon />}
                    direction={window.innerWidth < 600 ? 'down' : 'left'}
                >
                    {filesSpeedDialActions.map((action) => (
                        <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
                    ))}
                </StyledSpeedDial>
            </Box>
        </div>
    );
}
