/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Button, Popover, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import * as React from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { texts } from '@app/texts';
import { Color } from './../utils/color';
import { ColorPalette } from './../utils/color-palette';
import './ColorPicker.scss';
import { ColorList } from './ColorList';
import { useEventCallback } from './hooks';

type ColorTab = 'palette' | 'custom';

interface ColorPickerProps {
    // The selected color.
    value?: Color | string | null;

    // The color palette.
    palette?: ColorPalette;

    // The color palette.
    recentColors?: ColorPalette;

    // The active color tab.
    activeColorTab?: ColorTab;

    // The icon to show
    icon?: React.JSX.Element;

    // Where to place the popover
    popoverPlacement?: TooltipPlacement;

    // If disabled or not.
    disabled?: boolean;

    // Triggered when the color has changed.
    onChange?: (color: Color) => void;

    // Triggered when the active color tab has changed.
    onActiveColorTabChanged?: (key: ColorTab) => void;
}

export const ColorPicker = React.memo((props: ColorPickerProps) => {
    const {
        activeColorTab,
        disabled,
        onActiveColorTabChanged,
        onChange,
        palette,
        popoverPlacement,
        recentColors,
        value,
        icon,
    } = props;

    const [color, setColor] = React.useState(Color.BLACK);
    const [colorHex, setColorHex] = React.useState(color.toString());
    const [visible, setVisible] = React.useState<boolean>(false);

    const selectedPalette = React.useMemo(() => {
        return palette || ColorPalette.colors();
    }, [palette]);

    React.useEffect(() => {
        setColorHex(color.toString());
    }, [color]);

    React.useEffect(() => {
        setColor(value ? Color.fromValue(value) : Color.BLACK);
    }, [value]);

    const doSelectColorResult = useEventCallback((result: ColorResult) => {
        setColorHex(result.hex);
    });

    const doSelectTab = useEventCallback((key: string) => {
        onActiveColorTabChanged && onActiveColorTabChanged(key as ColorTab);
    });

    const doSelectColor = useEventCallback((result: Color) => {
        onChange && onChange(result);
        setVisible(false);
        setColorHex(result.toString());
    });

    const doConfirmColor = useEventCallback(() => {
        onChange && onChange(Color.fromValue(colorHex));
        setVisible(false);
        setColorHex(colorHex);
    });

    const menu: TabsProps['items'] = [
        {
            key: 'palette', 
            label: texts.common.palette, 
            children: <>
                <ColorList color={color} colors={selectedPalette} onClick={doSelectColor} />
                {recentColors &&
                    <div>
                        <h4>{texts.common.recent}</h4>
                        <ColorList color={color} colors={recentColors} onClick={doSelectColor} />
                    </div>
                }
            </>, 
        },
        {
            key: 'custom', 
            label: texts.common.custom, 
            children: <>
                <SketchPicker color={colorHex} onChange={doSelectColorResult} disableAlpha={true} width='210px' />
                <Button onClick={doConfirmColor}>
                    {texts.common.apply}
                </Button>
            </>, 
        }
    ];

    const content = (
        <Tabs 
            size='small' 
            items={menu} 
            className='color-picker-tabs' 
            animated={false} 
            activeKey={activeColorTab} 
            onChange={doSelectTab} />
    );

    const placement = popoverPlacement || 'left';

    return (
        <Popover content={content} open={visible && !disabled} placement={placement} trigger='click' onOpenChange={setVisible}>
            { (!icon)
                ? <Button disabled={disabled} className='color-picker-circle' type='text'>
                    <div className='color-picker-color'>
                        <div className='color-picker-color-inner' style={{ background: colorHex }}></div>
                    </div>
                </Button>
                : <Button disabled={disabled} className='color-picker-button' type='text' icon={icon} style={{ fill: colorHex }} />
            }
        </Popover>
    );
});
