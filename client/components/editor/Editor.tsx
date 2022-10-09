import React, { useRef } from 'react';

import { Typography, Paper } from '@mui/material';

import MonacoEditor, { Monaco } from '@monaco-editor/react';

export default function Editor(props: {
    openFiles: any;
    setOpenFiles: any;
    openFile: any;
    setChanges: any;
    changes: any;
}): JSX.Element {
    const monacoRef = useRef(null);

    function handleEditorWillMount(monaco: Monaco) {
        return;
    }

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        // @ts-ignore
        monacoRef.current = monaco;
    }

    if (props.openFiles.length < 1) {
        return (
            <div>
                <Typography variant="h2" align="center" sx={{ mt: 10 }}>
                    No files open
                </Typography>

                <Typography variant="h5" align="center">
                    Open a file to get started
                </Typography>
            </div>
        );
    } else {
        return (
            <Paper elevation={17} style={{ marginRight: 16, marginBottom: 16, minHeight: '80vh' }}>
                <MonacoEditor
                    height="80vh"
                    width="100%"
                    language={props.openFile.type}
                    theme="vs-dark"
                    value={props.openFile.source}
                    beforeMount={handleEditorWillMount}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                    }}
                />
            </Paper>
        );
    }
}
