/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Button, Tooltip } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import * as React from 'react';
import { isMac, Shortcut, Types } from '@app/core';
import { UIAction } from './shared';

type ActionDisplayMode = 'Icon' | 'IconLabel' | 'Label';

type ActionProps = {
    // The action to show.
    action: UIAction;

    // The display mdoe.
    displayMode?: ActionDisplayMode;
    
    // True to hide the element when disabled.
    hideWhenDisabled?: boolean;
};

export const ActionMenuButton = React.memo((props: ActionProps & ButtonProps) => {
    const { action, displayMode, hideWhenDisabled, type, ...other } = props;
    const {
        disabled,
        label,
        onAction,
        icon,
        shortcut,
        tooltip,
    } = action;

    if (disabled && hideWhenDisabled) {
        return null;
    }

    const title = buildTitle(shortcut, tooltip);

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={title}>
                <Button {...other} type={type} className={'tool-menu-item'} disabled={disabled} onClick={onAction}>
                    <ButtonContent icon={icon} label={label} displayMode={displayMode || 'Icon'} />
                </Button>
            </Tooltip>

            {shortcut &&
                <Shortcut disabled={disabled} onPressed={onAction} keys={shortcut} />
            }
        </>
    );
});

export const ActionButton = React.memo((props: ActionProps & ButtonProps) => {
    const { action, displayMode, hideWhenDisabled, ...other } = props;
    const {
        disabled,
        label,
        onAction,
        icon,
        shortcut,
        tooltip,
    } = action;

    if (disabled && hideWhenDisabled) {
        return null;
    }

    const title = buildTitle(shortcut, tooltip);

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={title}>
                <Button {...other} disabled={disabled} onClick={onAction}>
                    <ButtonContent icon={icon} label={label} displayMode={displayMode || 'Icon'} />
                </Button>
            </Tooltip>
        </>
    );
});

const ButtonContent = ({ displayMode, label, icon }: { icon?: string | JSX.Element; label: string; displayMode: ActionDisplayMode }) => {
    return (
        <>
            {(displayMode === 'Icon' || displayMode === 'IconLabel') &&
                <>
                    {Types.isString(icon) ? (
                        <i className={icon} />
                    ) : icon}
                </>
            }

            {(displayMode === 'Label' || displayMode === 'IconLabel') &&
                <>&nbsp;{label}</>
            }
        </>
    );
};

function buildTitle(shortcut: string | undefined, tooltip: string) {
    function getModKey(): string {
        // Mac users expect to use the command key for shortcuts rather than the control key
        return isMac() ? 'COMMAND' : 'CTRL';
    }

    return shortcut ? `${tooltip} (${shortcut.replace('MOD', getModKey())})` : tooltip;
}
