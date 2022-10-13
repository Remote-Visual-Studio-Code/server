import React from 'react';

import { Avatar, Typography, Breadcrumbs, Link, Divider } from '@mui/material';

export default function Header(props: { user: string; userURL: string; project: string }): JSX.Element {
    const data = props;

    const shortenName = (username: string): string => {
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
    };

    const shortenedName = shortenName(data.user);

    return (
        <div>
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
    );
}
