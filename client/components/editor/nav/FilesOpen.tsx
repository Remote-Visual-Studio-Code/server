import React from 'react';

import { Tabs, Tab } from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTab-root': {
        minWidth: 0,
        padding: theme.spacing(1),
    },
}));

export default function FilesOpen(props: {
    getFileIcon: any;
    openFiles: any;
    editorNavValue: any;
    handleEditorNavChange: any;
}): JSX.Element {
    return (
        <StyledTabs
            value={props.editorNavValue}
            onChange={props.handleEditorNavChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Open Files"
        >
            {props.openFiles.map((file: any) => (
                <Tab
                    key={file.path}
                    label={file.name}
                    icon={props.getFileIcon(file.type)}
                    iconPosition="start"
                    style={{ minHeight: 50, textTransform: 'none' }}
                />
            ))}
        </StyledTabs>
    );
}
