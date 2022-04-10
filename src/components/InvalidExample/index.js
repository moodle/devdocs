import React from 'react';
import clsx from 'clsx';

export default function ValidExample(props) {
    return (
        <div
            className={clsx(' alert alert--danger margin-bottom--lg ')}
        >
            <span class="badge badge--danger">An example of incorrect behaviour</span>
            {props.children}
        </div>
    );
}
