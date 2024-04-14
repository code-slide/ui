/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/


import { Modal, Layout, Segmented, Divider } from 'antd';
import { ColorSetting, DiagramSetting, PresentSetting } from '../settings';
import { texts } from '@app/const';
import { SegmentedOptions } from 'antd/es/segmented';
import { useState } from 'react';

type SettingMode = 'diagram' | 'palette' | 'presentation';
type SettingModalProps = {
    // Modal title
    title: string;

    // Modal state
    open: boolean;

    // Action onCancel
    onCancel: () => void;
}

export const SettingModal: React.FC<SettingModalProps> = (props: SettingModalProps) => {
    const { title, open, onCancel } = props;
    const [value, setValue] = useState<SettingMode>('diagram');

    const settings: SegmentedOptions<SettingMode> = [
        {
            value: 'diagram',
            label: texts.common.diagram,
        },
        {
            value: 'palette',
            label: texts.common.palette,
        },
        {
            value: 'presentation',
            label: texts.common.presentation,
        },
    ];

    const SettingMenu = () => {
        switch (value) {
            default:
            case 'diagram':
                return <DiagramSetting />;
            case 'palette':
                return <ColorSetting />;
            case 'presentation':
                return <PresentSetting />;
        }     
    }

    return (
        <Modal
            open={open}
            title={title}
            centered={true}
            width={600}
            onCancel={onCancel}
            footer={null}
        >
            <Layout style={{ backgroundColor: '#ffffff' }}>
                <Segmented 
                    className='menu-segment' block
                    options={settings}
                    value={value} onChange={setValue}
                />
                <Divider style={{ marginTop: 10 }} />
                <SettingMenu />
            </Layout>
        </Modal>
    )
}