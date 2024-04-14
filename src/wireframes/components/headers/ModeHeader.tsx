/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Segmented } from "antd";
import * as React from "react";
import { setMode, setSidebarSize } from "@app/wireframes/model";
import { AnimationIcon, DesignIcon, IconOutline } from "@app/icons/icon";
import { useDispatch } from "react-redux";
import { SegmentedValue } from "antd/es/segmented";
import { vogues } from "@app/const";

export const ModeHeader = React.memo(() => {
    const dispatch = useDispatch();

    const modeMenu = [
        { value: 'design', icon: <IconOutline icon={DesignIcon} /> },
        { value: 'animation', icon: <IconOutline icon={AnimationIcon} /> },
    ];

    const modeMenuEvt = (key: SegmentedValue) => {
        if (key == 'design') {
            dispatch(setSidebarSize(vogues.common.sidebarClose));
            dispatch(setMode('design'));
        } else {
            dispatch(setSidebarSize(vogues.common.sidebarCode));
            dispatch(setMode('animation'));
        }
    };

    return (
        <Segmented 
            className='menu-segment'
            options={modeMenu}
            onChange={(value) => modeMenuEvt(value)}
        />
    )
});
