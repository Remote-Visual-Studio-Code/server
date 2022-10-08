import React from 'react';

import {
    Avatar,
    Divider,
    Typography,
    Grid,
    Breadcrumbs,
    Link,
    SpeedDialAction,
    SpeedDialIcon,
    SpeedDial,
    Box,
    Tabs,
    Tab,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    List
} from '@mui/material';

import { styled } from '@mui/material/styles';

import UploadFileFilled from '@mui/icons-material/UploadFile';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderFilled from '@mui/icons-material/Folder';
import CloudFilled from '@mui/icons-material/Cloud';

// colors:
/* 60: #222831 */
/* 30: #393E46 */
/* 10: #00ADB5 */

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

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        minWidth: 0,
        padding: theme.spacing(1),
    },
}));

const filesSpeedDialActions = [
    { icon: <UploadFileFilled />, name: 'Upload' },
    { icon: <FolderFilled />, name: 'Add folder' },
    { icon: <CloudFilled />, name: 'Add file' },
];

export default function Editor(): React.ReactElement {
    document.body.style.backgroundColor = '#222831';

    function retrieveBackendData(): any {
        return {
            user: 'John Doe',
            project: 'TheNextBigThing',
            userURL: '/user/john-doe',
            files: [
                {
                    name: 'index.ts',
                    type: 'ts',
                    source: 'console.log("Hello World!")',
                    path: '/index.ts',
                },
                {
                    name: 'logo.svg',
                    type: 'svg',
                    source: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0L0 100h100z" fill="#00ADB5"/></svg>',
                    path: '/logo.svg',
                },
                {
                    name: 'package.json',
                    type: 'json',
                    source: '{ "name": "TheNextBigThing", "version": "1.0.0", "description": "The Next Big Thing", "main": "index.ts", "scripts": { "start": "node index.ts" }, "author": "John Doe", "license": "MIT" }',
                    path: '/package.json',
                },
                
            ],
        };
    }

    function shortenName(username: string): string {
        const split = username.split(' ');

        if (split.length > 2) {
            return split[0] + ' ' + split[split.length - 1];
        } else {
            let shortened = '';

            for (let i = 0; i < split.length; i++) {
                const str = split[i];

                if (!str) continue;

                shortened += str.charAt(0);
            }

            return shortened;
        }
    }

    function getFileIcon(type: string): React.ReactElement {
        // for now:
        return <UploadFileFilled />;
    }

    const data = retrieveBackendData();

    data.files.reverse();

    const shortenedName = shortenName(data.user);

    const [editorNavValue, setEditorNavValue] = React.useState(0);
    const [selectedFileIndex, setSelectedFileIndex] = React.useState(data.files[0].path);

    const defaultOpenFiles: { name: string; type: string; path: string; }[] = [];
    const [openFiles, setOpenFiles] = React.useState(defaultOpenFiles);

    const handleEditorNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setEditorNavValue(newValue);
    };

    const handleOpenFile = (file: { name: string; type: string; path: string; }) => {
        if (openFiles.find((f) => f.path === file.path)) return;

        setOpenFiles([...openFiles, file]);
    };

    const handleSelectFile = (index: number): void => {
        setSelectedFileIndex(index);
    };

    return (
        <div className="wrapper">
            <div className="header">
                <div
                    style={{
                        height: '64px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingLeft: 39,
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link underline="hover" color="inherit" href={data.userURL}>
                                {data.user}
                            </Link>
                            <Typography color="text.primary">{data.project}</Typography>
                        </Breadcrumbs>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 39,
                        }}
                    >
                        <Avatar>{shortenedName}</Avatar>
                    </div>
                </div>

                <Divider />
            </div>

            <div className="main">
                <div className="nav">
                    {/* Navigation */}
                    <Box sx={{ flexGrow: 1, pt: 2 }}>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                '--Grid-borderWidth': '3px',
                                borderTop: 'var(--Grid-borderWidth) solid',
                                borderLeft: 'var(--Grid-borderWidth) solid',
                                borderColor: 'divider',
                                '& > div': {
                                    borderRight: 'var(--Grid-borderWidth) solid',
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            <Grid item xs={2}>
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
                                            <SpeedDialAction
                                                key={action.name}
                                                icon={action.icon}
                                                tooltipTitle={action.name}
                                            />
                                        ))}
                                    </StyledSpeedDial>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <StyledTabs
                                    value={editorNavValue}
                                    onChange={handleEditorNavChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="Open Files"
                                >
                                    {openFiles.map((file) => (
                                        <Tab
                                            key={file.path}
                                            label={file.name}
                                            icon={getFileIcon(file.type)}
                                            iconPosition="start"
                                            style={{ minHeight: 50 }}
                                        />
                                    ))}
                                </StyledTabs>
                            </Grid>

                            <Grid item xs={4}>
                                <StyledTabs
                                    value={0}
                                    onChange={() => { return; }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="Terminal"
                                >
                                    <Tab
                                        key="terminal"
                                        label={'Terminal'}
                                        icon={<TerminalIcon />}
                                        iconPosition="start"
                                        style={{ minHeight: 50 }}
                                    />
                                </StyledTabs>
                            </Grid>
                        </Grid>
                    </Box>
                </div>

                <Divider />

                <div className="content">
                    {/* Content */}
                    <Box sx={{ flexGrow: 1, pt: 2 }}>
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                '--Grid-borderWidth': '3px',
                                borderTop: 'var(--Grid-borderWidth) solid',
                                borderLeft: 'var(--Grid-borderWidth) solid',
                                borderColor: 'divider',
                                '& > div': {
                                    borderRight: 'var(--Grid-borderWidth) solid',
                                    borderColor: 'divider',
                                },
                            }}
                        >
                            <Grid item xs={2}>
                                {/* File tree */}

                                <Box sx={{ width: '100%', maxWidth: 360 }}>
                                    <List component="nav" aria-label="files">
                                        {data.files.map((file: any, index: number) => (
                                            <ListItemButton
                                                key={file.path}
                                                selected={selectedFileIndex === index}
                                                onClick={() => {
                                                    handleOpenFile(file);
                                                    handleSelectFile(file.path);
                                                }}
                                            >
                                                <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
                                                <ListItemText primary={file.name} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                {/* Editor */}
                            </Grid>
                            <Grid item xs={4}>
                                {/* Terminal */}
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
        </div>
    );
}
