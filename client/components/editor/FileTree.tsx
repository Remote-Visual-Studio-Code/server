import React from 'react';

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';

export default function FileTree(props: {
    filesOrderedAlphabetically: any[];
    selectedFileIndex: number;
    handleOpenFile: any;
    handleSelectFile: any;
    getFileIcon: any;
}): JSX.Element {
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
                                props.handleSelectFile(file.path);
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
