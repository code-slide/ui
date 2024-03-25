import { changeName, getEditor, useStore } from '@app/wireframes/model';
import { Button, Dropdown, Form, Input } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import { useLoading } from '../actions';
import { texts } from '@app/texts/en';
import { useDispatch } from 'react-redux';
import { ModalForm } from '../overlay/ModalForm';
import type { MenuProps } from 'antd';
import { MenuIcon } from '@app/style/icomoon/icomoon_icon';

export const FileMenu = () => {
    const dispatch = useDispatch();
    const forLoading = useLoading();
    const editor = useStore(getEditor);
    const [label, setLabel] = useState(editor.name);
    const [isRename, setIsRename] = useState(false);

    const handleRenameOk = (values: any) => {
        dispatch(changeName(values.new_name));
        setLabel(values.new_name);
        setIsRename(false);
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
            key: texts.common.rename,
            label: texts.common.rename,
            icon: <MenuIcon icon='icon-file_rename' />,
            className: 'loading-action-item',
            disabled: false,
        },
        {
            key: forLoading.saveDiagram.label,
            label: forLoading.saveDiagram.label,
            icon: <MenuIcon icon={forLoading.saveDiagram.icon} />,
            className: 'loading-action-item',
            disabled: forLoading.saveDiagram.disabled,
        },
        {
            key: forLoading.saveDiagramToFile.label,
            label: forLoading.saveDiagramToFile.label,
            icon: <MenuIcon icon={forLoading.saveDiagramToFile.icon} />,
            className: 'loading-action-item',
            disabled: forLoading.saveDiagramToFile.disabled,
        },
    ];

    const menuEvt: MenuProps['onClick'] = ({key}) => {
        if (key == 'Rename') {
            setIsRename(true);
        } else if (key == forLoading.newDiagram.label) {
            dispatch(forLoading.newDiagram.onAction);
        } else if (key == forLoading.openDiagramAction.label) {
            dispatch(forLoading.openDiagramAction.onAction);
        } else if (key == forLoading.saveDiagram.label) {
            dispatch(forLoading.saveDiagram.onAction);
        } else if (key == forLoading.saveDiagramToFile.label) {
            dispatch(forLoading.saveDiagramToFile.onAction);
        }
    }

    return (
        <>
            <Dropdown
                className='loading-action-button'
                menu={{ items: menu, onClick: menuEvt }}
                trigger={['click']}>
                <Button type="text" size='middle'>
                    <h4>{(label.length < 25) ? label : `${label.substring(0, 25)}...`}</h4>
                </Button>
            </Dropdown>
            <ModalForm
                title={texts.common.renameTooltip}
                open={isRename}
                okText='Rename'
                onCancel={() => setIsRename(false)}
                onCreate={handleRenameOk} 
                formItems={
                    <>
                        <div style={{ height: 20 }} />
                        <Form.Item name="new_name">
                            <Input placeholder="Enter new name..." type="textarea" maxLength={100} />
                        </Form.Item>
                    </>
                }            
            />
        </>
    );
};