/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { changeItemsAppearance, getDiagram, getSelectedShape, useStore } from '@app/wireframes/model';
import { useEffect, useState } from 'react';
import { AspectRatioIcon, IconOutline } from '@app/icons/icon';
import { theme } from '@app/const';

export const GraphicTool = React.memo(() => {
    const dispatch = useDispatch();
    const selectedItem = useStore(getSelectedShape);
    const selectedDiagram = useStore(getDiagram);

    const [isKeepAspect, setIsKeepAspect] = useState(!selectedItem ? true : selectedItem.getAppearance(theme.key.aspectRatio));

    useEffect(() => {
        setIsKeepAspect(!selectedItem ? true : selectedItem.getAppearance(theme.key.aspectRatio));
    }, [selectedItem])
    
    const toggleAspectRatio = () => {
        if (selectedItem && selectedDiagram) {
            dispatch(changeItemsAppearance(selectedDiagram, [selectedItem.id], theme.key.aspectRatio, !isKeepAspect));
        }
    };

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ 'Preserve aspect ratio' }>
                <Button
                    className={`tool-menu-item ${isKeepAspect ? 'active' : ''}`}
                    type='text'
                    icon={<IconOutline icon={AspectRatioIcon} />}
                    onClick={toggleAspectRatio}
                />
            </Tooltip>
        </>
    );
});