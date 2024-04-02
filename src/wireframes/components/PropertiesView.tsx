/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import classNames from 'classnames';
import { texts } from '@app/const';
import { getDiagram, getSelectedItems, useStore } from '@app/wireframes/model';
import { CustomProperties, LayoutProperties, ShapeProperties, TransformProperties } from './properties';
import './styles/PropertiesView.scss';

export const PropertiesView = () => {
    const selectedItems = useStore(getSelectedItems);
    const selectedItem = useStore(getDiagram);
    const isModeDesign = useStore(s => s.ui.selectedMode) == 'design';
    const hasSelection = selectedItems.length > 0;
    const hasDiagram = !!selectedItem;

    const designMenu: CollapseProps['items'] = [
        {
            key: 'properties',
            label: texts.common.properties,
            children: <ShapeProperties />,
        },
        {
            key: 'visual',
            label: texts.common.layout,
            children: <LayoutProperties />,
        },
        {
            key: 'custom',
            label: texts.common.custom,
            children: <CustomProperties />,
        },
    ];

    const animateMenu: CollapseProps['items'] = [
        {
            key: 'properties',
            label: texts.common.properties,
            children: <ShapeProperties />,
        },
        {
            key: 'transform',
            label: texts.common.transform,
            children: <TransformProperties />,
        },
    ];
      
      

    return (
        <>
            <Collapse
                className={`properties-collapse ${classNames({ hidden: !hasSelection })}`}
                bordered={false}
                items={isModeDesign ? designMenu : animateMenu}
                defaultActiveKey={['properties', 'transform', 'visual', 'custom']} />
            <Collapse
                className={`properties-collapse ${classNames({ hidden: hasSelection || !hasDiagram })}`}
                bordered={false}
                defaultActiveKey={['diagram', 'colors']} />
        </>
    );
};