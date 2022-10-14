/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { Divider, Grid, Box, Snackbar, Alert } from '@mui/material';

import io, { Socket } from 'socket.io-client';

import UploadFileFilled from '@mui/icons-material/UploadFile';

import Navigation from '../components/editor/Navigation';
import Terminal from '../components/editor/Terminal';
import FileTree from '../components/editor/FileTree';
import Header from '../components/editor/Header';
import Editor from '../components/editor/Editor';

// colors:
/* 60: #222831 */
/* 30: #393E46 */
/* 10: #00ADB5 */

export default function MainEditor(): React.ReactElement {
    // document.body.style.backgroundColor = '#222831'; - old background color

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [socket, setSocket] = React.useState<Socket>();

    const SOCK_PORT = 8080;

    const setupSocket = (): Socket => {
        const newSocket = io(`http://localhost:${SOCK_PORT}`);

        console.debug('Socket created');

        return newSocket;
    };

    const sendChangesToBackend = (): void => {
        return;
    };

    // @ts-ignore
    const retrieveBackendData = (): any => {
        return {
            user: 'John Doe',
            project: 'TheNextBigThing',
            userURL: '/user/john-doe',
            terminals: ['zsh', 'bash', 'fish', 'cmd', 'powershell', 'sh'],
            cwd: '',
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
                    source: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n   <path d="M50 0L0 100h100z" fill="#00ADB5"/>\n</svg>',
                    path: '/logo.svg',
                },
                {
                    name: 'package.json',
                    type: 'json',
                    source: '{\n    "name": "TheNextBigThing",\n    "version": "1.0.0",\n    "description": "The Next Big Thing",\n    "main": "index.ts",\n    "scripts": {\n        "start": "node index.ts"\n    },\n    "author": "John Doe",\n    "license": "MIT"\n}',
                    path: '/package.json',
                },
            ],
        };
    };

    const onCtrlS = (): void => {
        sendChangesToBackend();
        setSaveAlert(true);
    };

    const getFileIcon = (_type: string): React.ReactElement => {
        // for now:
        return <UploadFileFilled />;
    };

    // @ts-ignore
    const [data, setData] = React.useState({
        user: 'John Doe',
        project: 'TheNextBigThing',
        userURL: '/user/john-doe',
        terminals: ['zsh', 'bash', 'fish', 'cmd', 'powershell', 'sh'],
        cwd: '',
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
                source: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n   <path d="M50 0L0 100h100z" fill="#00ADB5"/>\n</svg>',
                path: '/logo.svg',
            },
            {
                name: 'package.json',
                type: 'json',
                source: '{\n    "name": "TheNextBigThing",\n    "version": "1.0.0",\n    "description": "The Next Big Thing",\n    "main": "index.ts",\n    "scripts": {\n        "start": "node index.ts"\n    },\n    "author": "John Doe",\n    "license": "MIT"\n}',
                path: '/package.json',
            },
        ],
    });

    data.files.reverse();

    const defaultSelectedFile = data.files[0];

    const [selectedFileIndex, setSelectedFileIndex] = React.useState(
        defaultSelectedFile ? data.files.indexOf(defaultSelectedFile) : 0,
    );
    const [terminalSelectError, setTerminalSelectError] = React.useState(false);
    const [editorNavValue, setEditorNavValue] = React.useState(0);

    const defaultTerminalCommands: { command: string; args: string[]; output: string[] }[] = [];

    // for testing:
    defaultTerminalCommands.push({
        command: 'yarn',
        args: ['install'],
        output: [
            'yarn install v1.22.19',
            '\x1b[90m[1/4]\x1b[00m Resolving packages...',
            '\x1b[92msuccess\x1b[00m Already up-to-date.',
            'Done in 0.041s.',
        ],
    });

    const [terminalCommands, setTerminalCommands] = React.useState(defaultTerminalCommands);

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

        if (!file) return;

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

    const handleTerminalCommand = (command: string, args: string[]): void => {
        setTerminalCommands([...terminalCommands, { command, args, output: [] }]);

        // TODO: send command to backend
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

    React.useEffect(() => {
        const socket = setupSocket();

        setSocket(socket);

        if (socket) {
            socket.on('connected', (payload: string): void => {
                const { message } = JSON.parse(payload);

                const REQUIRED_MESSAGE = 'Connected to socket server';

                console.debug(
                    `Connected to socket with:\n message - ${message}\n required message - ${REQUIRED_MESSAGE}\n ok - ${
                        message === REQUIRED_MESSAGE
                    } \n id - ${socket.id}\n payload - ${payload}`,
                );
            });
        } else {
            console.error('Socket not connected');
        }
    }, []);

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
                                    dataFiles={data.files}
                                    getFileIcon={getFileIcon}
                                    handleSelectFile={handleSelectFile}
                                    handleOpenFile={handleOpenFile}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                {/* Editor */}

                                <div>
                                    <Editor
                                        openFiles={openFiles}
                                        setOpenFiles={setOpenFiles}
                                        openFile={openFile}
                                        setChanges={setChanges}
                                        changes={changes}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <Terminal
                                    cwd={data.cwd}
                                    project={data.project}
                                    terminalCommands={terminalCommands}
                                    handleTerminalCommand={handleTerminalCommand}
                                />
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
