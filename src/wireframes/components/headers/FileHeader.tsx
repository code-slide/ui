/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { changeName, getEditor, setIsTourOpen, useStore } from '@app/wireframes/model';
import { Button, Dropdown, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { useLoading, useServer } from '../actions';
import { texts } from '@app/const/texts';
import { useAppDispatch } from '@app/store';
import { FormModal, SettingModal } from '../modal';
import type { MenuProps } from 'antd';
import { MenuIcon } from '@app/style/icomoon/icomoon_icon';

export const FileHeader = () => {
    const dispatch = useAppDispatch();
    const forLoading = useLoading();
    const forServer = useServer();
    const editor = useStore(getEditor);
    const [messageApi, contextHolder] = message.useMessage();
    const [isRename, setIsRename] = useState(false);
    const [isSettings, setIsSettings] = useState(false);
    const messageKey = 'GENERATE';

    // Get editor's name
    let name = editor.name;
    useEffect(() => {
        name = editor.name;
    }, [editor.name])

    // Change name onClick
    const handleRenameOk = (values: any) => {
        dispatch(changeName(values.new_name));
        setIsRename(false);
    };

    // Change setting modal appearance
    const handleSettingClose = () => {
        setIsSettings(false);
    };

    const menu: MenuProps['items'] = [
        {
            key: forLoading.newDiagram.label,
            label: forLoading.newDiagram.label,
            icon: <MenuIcon icon={forLoading.newDiagram.icon} />,
            className: 'loading-action-item',
            disabled: forLoading.newDiagram.disabled,
        },
        {
            key: forLoading.openDiagramAction.label,
            label: forLoading.openDiagramAction.label,
            icon: <MenuIcon icon={forLoading.openDiagramAction.icon} />,
            className: 'loading-action-item',
            disabled: forLoading.openDiagramAction.disabled,
        },
        {
            type: 'divider',
        },
        {
            key: texts.common.rename,
            label: texts.common.rename,
            icon: <MenuIcon icon='icon-file_rename' />,
            className: 'loading-action-item',
            disabled: false,
        },
        {
            key: texts.common.settings,
            label: texts.common.settings,
            icon: <MenuIcon icon='icon-cog' />,
            className: 'loading-action-item',
        },
        {
            type: 'divider',
        },
        {
            key: forLoading.downloadDiagram.label,
            label: forLoading.downloadDiagram.label,
            icon: <MenuIcon icon={forLoading.downloadDiagram.icon} />,
            className: 'loading-action-item',
            disabled: forLoading.downloadDiagram.disabled,
        },
        {
            key: texts.common.saveDiagramToFileTooltip,
            label: texts.common.saveDiagramToFileTooltip,
            icon: <MenuIcon icon='icon-save' />,
            className: 'loading-action-item',
            disabled: forLoading.downloadDiagram.disabled,
        },
        {
            type: 'divider',
        },
        {
            key: texts.common.walkthrough,
            label: texts.common.walkthrough,
            icon: <MenuIcon icon='icon-graduation-cap' />,
            className: 'loading-action-item',
        },
        {
            key: texts.common.documentation,
            label: texts.common.documentation,
            icon: <MenuIcon icon='icon-help_outline' />,
            className: 'loading-action-item',
        },
    ];

    const menuEvt: MenuProps['onClick'] = ({key}) => {
        if (key == texts.common.rename) {
            setIsRename(true);
        } else if (key == texts.common.settings) {
            setIsSettings(true);
        } else if (key == forLoading.newDiagram.label) {
            dispatch(forLoading.newDiagram.onAction);
        } else if (key == forLoading.openDiagramAction.label) {
            dispatch(forLoading.openDiagramAction.onAction);
        } else if (key == forLoading.downloadDiagram.label) {
            dispatch(forLoading.downloadDiagram.onAction);
        } else if (key == texts.common.saveDiagramToFileTooltip) {
            forServer.pdf(messageApi, messageKey);
        } else if (key == texts.common.documentation) {
            window.open('https://github.com/code-slide/ui/wiki');
        } else if (key == texts.common.walkthrough) {
            dispatch(setIsTourOpen(true));
        }
    }

    return (
        <>
            {contextHolder}
            <Dropdown
                className='loading-action-button'
                menu={{ items: menu, onClick: menuEvt }}
                trigger={['click']}>
                <Button type="text" size='middle' shape='round'>
                    <h4>{(name.length < 25) ? name : `${name.substring(0, 25)}...`}</h4>
                </Button>
            </Dropdown>
            
            <FormModal
                title={texts.common.renameTooltip}
                open={isRename}
                okText='Rename'
                onCancel={() => setIsRename(false)}
                onCreate={handleRenameOk} 
                initValue={['new_name', name]}
                formItems={
                    <>
                        <div style={{ height: 20 }} />
                        <Form.Item name="new_name">
                            <Input placeholder="Enter new name..." type="textarea" maxLength={100} />
                        </Form.Item>
                    </>
                }            
            />

            <SettingModal title={texts.common.settings} open={isSettings} onCancel={handleSettingClose} />
        </>
    );
};