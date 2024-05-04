/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Tooltip } from "antd";
import * as React from "react";
import { setFooterSize, setMode, setSidebarSize, useStore } from "@app/wireframes/model";
import { AnimationIcon, PageIcon, IconOutline } from "@app/icons/icon";
import { useAppDispatch } from '@app/store';
import { vogues } from "@app/const";

export const ModeHeader = React.memo(() => {
    const dispatch = useAppDispatch();
    const isAnimationOn = useStore(s => s.ui.sidebarSize) !== vogues.common.close;
    const isPageOn = useStore(s => s.ui.footerSize) !== vogues.common.close;

    const togglePagePanel = () => {
        if (isPageOn) {
            dispatch(setFooterSize(vogues.common.close));
        } else {
            dispatch(setFooterSize(vogues.common.previewHeight));
        }
    }

    const toggleAnimationPanel = () => {
        if (isAnimationOn) {
            dispatch(setSidebarSize(vogues.common.close));
            dispatch(setMode('design'));
        } else {
            dispatch(setSidebarSize(vogues.common.sidebarCode));
            dispatch(setMode('animation'));
        }
    }

    return (
        <>
            <div className="menu-segment">
                <Tooltip title={`${isPageOn ? 'Hide' : 'Show'} Pages Panel`} >
                    <Button
                        type="text" shape="circle"
                        aria-label={`${isPageOn ? 'Hide' : 'Show'} Pages Panel`}
                        icon={<IconOutline icon={PageIcon} />}
                        style={{ backgroundColor: isPageOn ? vogues.color.white : ''}}
                        onClick={togglePagePanel}
                    />
                </Tooltip>
                <Tooltip title={`Open ${isAnimationOn ? 'Animation' : 'Design'} Mode`}>
                    <Button
                        type="text" shape="circle"
                        icon={<IconOutline icon={AnimationIcon} />}
                        aria-label={`Open ${isAnimationOn ? 'Animation' : 'Design'} Mode`}
                        style={{ backgroundColor: isAnimationOn ? vogues.color.white : ''}}
                        onClick={toggleAnimationPanel}
                    />
                </Tooltip>
            </div>
        </>
    )
});
