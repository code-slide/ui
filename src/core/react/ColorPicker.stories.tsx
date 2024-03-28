/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from '@app/core/utils';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
    render: ({ palette: _, ...args }) => {
        const palette = ColorPalette.colors();

        return (
            <ColorPicker palette={palette} {...args} />
        );
    },
    argTypes: {
        palette: {
            table: {
                disable: true,
            },
        },
    }
};
export default meta;

type Story = StoryObj<typeof ColorPicker>;
export const Default: Story = {};