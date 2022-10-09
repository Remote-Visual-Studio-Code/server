import React from 'react';

import { Paper, Divider, TextField, InputAdornment } from '@mui/material';

import Convert from 'ansi-to-html';

const convert = new Convert();

export default function Terminal(props: {
    project: string;
    terminalCommands: { command: string; args: string[]; output: string[] }[];
    handleTerminalCommand: (command: string, args: string[]) => void;
    cwd: string;
}): JSX.Element {
    // @ts-ignore
    const args: { arg: string; dash: boolean }[] = props.terminalCommands[props.terminalCommands.length - 1].args.map(
        (arg: string) => {
            return { arg, dash: arg.startsWith('-') };
        },
    );

    return (
        <Paper elevation={17} style={{ marginRight: 16, marginBottom: 16, minHeight: '80vh' }}>
            <div>
                <div className="terminal-out" style={{ height: '72vh', overflow: 'scroll' }}>
                    <br />

                    {props.terminalCommands.map((command, index) => (
                        <div key={index} className="terminal-command" style={{ color: '#CCCCCC' }}>
                            <span className="terminal-command-cmd" style={{ paddingLeft: '16px' }}>
                                <span className="terminal-command-prefix" style={{ color: '#00ADB5' }}>
                                    ~/{props.project}
                                    {props.cwd}{' '}
                                </span>
                                <span className="terminal-command-name" style={{ color: '#CCCCCC' }}>
                                    {command.command}
                                    {args.map((arg, index) => (
                                        <span
                                            key={index}
                                            className="terminal-command-arg"
                                            style={{ color: arg.dash ? '#7A7C80' : '#CCCCCC' }}
                                        >
                                            {' '}
                                            {arg.arg}
                                        </span>
                                    ))}
                                </span>
                            </span>

                            <br />

                            <span className="terminal-command-output">
                                {command.output.map((output: string): any => (
                                    <div>
                                        <td
                                            dangerouslySetInnerHTML={{ __html: convert.toHtml(output) }}
                                            style={{ paddingLeft: '16px' }}
                                        />
                                    </div>
                                ))}
                            </span>
                        </div>
                    ))}

                    <span className="terminal-command-prefix" style={{ color: '#00ADB5', paddingLeft: '16px' }}>
                        ~/{props.project}
                        {props.cwd}{' '}
                    </span>
                </div>

                <div className="terminal-in" style={{ marginLeft: '16px', marginRight: '16px' }}>
                    <Divider />

                    <TextField
                        label="Enter a command"
                        id="terminal-input"
                        sx={{ marginTop: 1.5, width: '100%' }}
                        variant="standard"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="terminal-command-prefix" style={{ color: '#00ADB5' }}>
                                        ~/{props.project}
                                        {props.cwd}{' '}
                                    </span>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </div>
        </Paper>
    );
}
