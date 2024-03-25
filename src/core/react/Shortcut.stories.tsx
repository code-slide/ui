/*
 * Notifo.io
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import { Meta } from '@storybook/react';
import * as React from 'react';
import { Shortcut } from './Shortcut';

export default {
    component: Shortcut,
} as Meta<typeof Shortcut>;

const Template = (args: any) => {
    return (
        <>
            {args.keys}

            <Shortcut {...args} />
        </>
    );
};

export const Default = Template.bind({});

// @ts-ignore
Default['args'] = {
    keys: 'ctrl+s',
};

export const ReadableKeys = Template.bind({});

// @ts-ignore
ReadableKeys['args'] = {
    keys: 'CTRL + S',
};
