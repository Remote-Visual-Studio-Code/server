import React from 'react';

// colors:
/* 60: #222831 */
/* 30: #393E46 */
/* 10: #00ADB5 */

export default function Editor(): React.ReactElement {
    document.body.style.backgroundColor = '#222831';

    return (
        <div className="wrapper">
            <div className="text-yellow-200">
                header
            </div>
            <p>editor</p>
        </div>
    );
}