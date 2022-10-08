import React from 'react';

import { Box, Grid } from '@mui/material';

import TerminalNav from './nav/Terminal';
import FilesOpen from './nav/FilesOpen';
import FilesNav from './nav/Files';

export default function Navigation(props: {
    terminals: any;
    getFileIcon: any;
    openFiles: any;
    handleSelectTerminal: any;
    terminalSelectError: any;
    handleTerminalSelectErrorClose: any;
    editorNavValue: any;
    handleEditorNavChange: any;
}): JSX.Element {
    return (
        <div>
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
                        <FilesNav />
                    </Grid>

                    <Grid item xs={6}>
                        <FilesOpen
                            getFileIcon={props.getFileIcon}
                            openFiles={props.openFiles}
                            editorNavValue={props.editorNavValue}
                            handleEditorNavChange={props.handleEditorNavChange}
                        />
                    </Grid>

                    <TerminalNav
                        terminals={props.terminals}
                        handleSelectTerminal={props.handleSelectTerminal}
                        terminalSelectError={props.terminalSelectError}
                        handleTerminalSelectErrorClose={props.handleTerminalSelectErrorClose}
                    />
                </Grid>
            </Box>
        </div>
    );
}
