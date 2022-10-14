import React from 'react';

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider, Skeleton } from '@mui/material';

export default function FileTree(props: {
    filesOrderedAlphabetically: any[];
    selectedFileIndex: number;
    dataFiles: any[];
    handleOpenFile: any;
    handleSelectFile: any;
    getFileIcon: any;
}): JSX.Element {
    if (props.filesOrderedAlphabetically[0].isSkeleton) {
        return (
            <Box sx={{ width: '100%', maxWidth: 360 }}>
                <List component="nav" aria-label="files">
                    <Skeleton
                        variant="rectangular"
                        sx={{ marginLeft: '16px', marginRight: '16px' }}
                        height={48}
                        animation="wave"
                    />
                </List>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 360 }}>
            <List component="nav" aria-label="files">
                {props.filesOrderedAlphabetically.map((file: any, index: number) => (
                    <div>
                        <ListItemButton
                            key={file.path}
                            selected={props.selectedFileIndex === index}
                            onClick={() => {
                                props.handleOpenFile(file);
                                props.handleSelectFile(props.dataFiles.indexOf(file));
                            }}
                            style={{ marginLeft: 16, marginRight: 16, paddingLeft: 24 }}
                        >
                            <ListItemIcon>{props.getFileIcon(file.type)}</ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItemButton>

                        <Divider
                            style={{ marginLeft: 16, marginRight: 16, minWidth: 3 }}
                            sx={{ borderBottomWidth: 2 }}
                        />
                    </div>
                ))}
            </List>
        </Box>
    );
}
