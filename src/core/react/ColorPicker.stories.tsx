/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import type { Meta } from '@storybook/react';
import * as React from 'react';
import { ColorPalette } from './../utils/color-palette';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
};
export default meta;

const Template = ({ palette: _, ...rest }: any) => {
    const palette = ColorPalette.colors();

    return (
        <ColorPicker palette={palette} {...rest} />
    );
};

export const Default = Template.bind({});

// @ts-ignore
Default['argTypes'] = {
    palette: {
        table: {
            disable: true,
        },
    },
};
