/*
 * Notifo.io
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
 */

import { Meta, StoryObj } from '@storybook/react';
import { Shortcut } from './Shortcut';

const meta: Meta<typeof Shortcut> = {
    component: Shortcut,
    render: (args) => {
        return (
            <>
                {args.keys}

                <Shortcut {...args} />
            </>
        );
    },
};
export default meta;

type Story = StoryObj<typeof Shortcut>;
export const Default: Story = {
    args: {
        keys: 'ctrl+s',
    },
};

export const ReadableKeys: Story = {
    args: {
        keys: 'CTRL + S',
    },
};