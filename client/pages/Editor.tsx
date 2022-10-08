import React from 'react';

import { Divider, Grid, Box, Snackbar, Alert } from '@mui/material';

import UploadFileFilled from '@mui/icons-material/UploadFile';

import Navigation from '../components/editor/Navigation';
import FileTree from '../components/editor/FileTree';
import Header from '../components/editor/Header';
import Editor from '../components/editor/Editor';

// colors:
/* 60: #222831 */
/* 30: #393E46 */
/* 10: #00ADB5 */

export default function MainEditor(): React.ReactElement {
    document.body.style.backgroundColor = '#222831';

    function sendChangesToBackend(): void {
        return;
    }

    function retrieveBackendData(): any {
        return {
            user: 'John Doe',
            project: 'TheNextBigThing',
            userURL: '/user/john-doe',
            terminals: ['zsh', 'bash', 'fish', 'cmd', 'powershell', 'sh'],
            files: [
                {
                    name: 'index.ts',
                    type: 'typescript',
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

    function onCtrlS(): void {
        sendChangesToBackend();
        setSaveAlert(true);
    }

    function getFileIcon(_type: string): React.ReactElement {
        // for now:
        return <UploadFileFilled />;
    }

    const data = retrieveBackendData();

    data.files.reverse();

    const [selectedFileIndex, setSelectedFileIndex] = React.useState(data.files[0].path);
    const [terminalSelectError, setTerminalSelectError] = React.useState(false);
    const [editorNavValue, setEditorNavValue] = React.useState(0);

    const defaultOpenFiles: { name: string; type: string; path: string }[] = [];
    const [openFiles, setOpenFiles] = React.useState(defaultOpenFiles);
    const defaultOpenFile: { name: string | null; type: string | null; path: string | null } = {
        name: null,
        type: null,
        path: null,
    };
    const [openFile, setOpenFile] = React.useState(defaultOpenFile);
    const [saveAlert, setSaveAlert] = React.useState(false);
    const [changes, setChanges] = React.useState([]);

    const handleSaveAlertClose = (_event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSaveAlert(false);
    };

    const handleOpenFile = (file: { name: string; type: string; path: string }) => {
        if (openFiles.find((f) => f.path === file.path)) return;

        setOpenFiles([...openFiles, file]);
        setOpenFile(file);
    };

    const handleEditorNavChange = (_event: React.SyntheticEvent, newValue: number) => {
        setEditorNavValue(newValue);

        const file = data.files[newValue];

        setOpenFile(file);
    };

    const handleSelectFile = (index: number): void => {
        setSelectedFileIndex(index);
    };

    const handleSelectTerminal = (_event: React.SyntheticEvent, value: string | null): void => {
        if (value === null) {
            setTerminalSelectError(true);
        } else {
            setTerminalSelectError(false);
        }
    };

    const handleTerminalSelectErrorClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setTerminalSelectError(false);
    };

    React.useEffect(() => {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                onCtrlS();
            }
        });
    }, []);

    const filesOrderedAlphabetically = data.files.sort((a: any, b: any) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    return (
        <div>
            <Header user={data.user} userURL={data.userURL} project={data.project} />

            <div>
                <Navigation
                    terminals={data.terminals}
                    handleSelectTerminal={handleSelectTerminal}
                    terminalSelectError={terminalSelectError}
                    handleTerminalSelectErrorClose={handleTerminalSelectErrorClose}
                    getFileIcon={getFileIcon}
                    openFiles={openFiles}
                    editorNavValue={editorNavValue}
                    handleEditorNavChange={handleEditorNavChange}
                />

                <Divider />

                <div>
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
                                <FileTree
                                    filesOrderedAlphabetically={filesOrderedAlphabetically}
                                    selectedFileIndex={selectedFileIndex}
                                    getFileIcon={getFileIcon}
                                    handleSelectFile={handleSelectFile}
                                    handleOpenFile={handleOpenFile}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {/* Editor */}

                                <div>
                                    <Editor openFiles={openFiles} setOpenFiles={setOpenFiles} openFile={openFile} setChanges={setChanges} changes={changes} />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                {/* Terminal */}
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>

            <div>
                <Snackbar open={saveAlert} autoHideDuration={2000}>
                    <Alert onClose={handleSaveAlertClose} severity="success" variant="outlined" sx={{ width: '100%' }}>
                        Successfully saved all changes!
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}
