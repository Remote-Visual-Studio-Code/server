import React from 'react';

import { Tabs, Tab, Autocomplete, TextField, Snackbar, Alert, Grid } from '@mui/material';

import { styled } from '@mui/material';

import TerminalIcon from '@mui/icons-material/Terminal';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        minWidth: 0,
        padding: theme.spacing(1),
    },
}));

export default function Terminal(props: {
    terminals: any;
    terminalSelectError: any;
    handleSelectTerminal: any;
    handleTerminalSelectErrorClose: any;
}): JSX.Element {
    return (
        <Grid item xs={4} style={{ display: 'flex' }}>
            <StyledTabs
                value={1}
                onChange={() => {
                    return;
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Terminal"
                style={{ flex: 1 }}
            >
                <Tab
                    key="terminal"
                    label={'Terminal'}
                    icon={<TerminalIcon />}
                    iconPosition="start"
                    style={{ minHeight: 50, textTransform: 'none' }}
                />
            </StyledTabs>

            <Autocomplete
                id="terminal-select"
                size="small"
                options={props.terminals}
                getOptionLabel={(option) => option}
                defaultValue={props.terminals[0]}
                style={{ maxWidth: '175px', flex: 1, marginRight: 16 }}
                renderInput={(params: any): any => (
                    <TextField
                        error={props.terminalSelectError}
                        id="terminal-select-field"
                        {...params}
                        variant="standard"
                        label="Terminal"
                        placeholder="Select Terminal"
                    />
                )}
                onChange={(event, value) => {
                    props.handleSelectTerminal(event, value);

                    if (value !== null) {
                        props.handleTerminalSelectErrorClose();
                    }
                }}
            />

            <Snackbar open={props.terminalSelectError} onClose={props.handleTerminalSelectErrorClose}>
                <Alert severity="error" variant="outlined" sx={{ width: '100%' }}>
                    Please select a valid terminal.
                </Alert>
            </Snackbar>
        </Grid>
    );
}
