import React from 'react';
import clsx from 'clsx';

export default function ValidExample(props) {
    return (
        <div
            className={clsx(' alert alert--success margin-bottom--lg ')}
        >
            <span class="badge badge--success">An example of correct behaviour</span>
            {props.children}
        </div>
    );
}
