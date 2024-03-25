/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { Title } from '@app/core';
import { texts } from '@app/texts';
import { getEditor, useStore } from '@app/wireframes/model';
import { useLoading } from './actions';
import { ArrangeMenu, FileMenu, PresentMenu } from './menu';
import './styles/HeaderView.scss'

export const HeaderView = React.memo(() => {
    const forLoading = useLoading();
    const editor = useStore(s => s.editor);
    const tokenToRead = useStore(s => s.loading.tokenToRead);
    const tokenToWrite = useStore(s => s.loading.tokenToWrite);
    const saveTimer = React.useRef<any>();
    const saveAction = React.useRef(forLoading.saveDiagram);

    saveAction.current = forLoading.saveDiagram;

    React.useEffect(() => {
        function clearTimer() {
            if (saveTimer.current) {
                clearInterval(saveTimer.current);
                saveTimer.current = null;
            }
        }

        if (tokenToWrite) {
            if (!saveTimer.current) {
                saveTimer.current = setInterval(() => {
                    if (!saveAction.current.disabled) {
                        saveAction.current.onAction();
                    }
                }, 30000);
            }

            const stopTimer = setTimeout(() => {
                clearTimer();
            }, 40000);

            return () => {
                clearTimeout(stopTimer);
            };
        } else {
            clearTimer();

            return undefined;
        }
    }, [tokenToWrite, editor]);

    return (
        <>
            <div className='header-left'>
                <CustomTitle token={tokenToRead} />
                <ArrangeMenu />

                <FileMenu />
                <span className='menu-separator' />
                <p style={{ display: 'inline-block', width: '80px'}}>{tokenToWrite ?? 'Unsaved'}</p>
            </div>

            <span style={{ float: 'right' }}>
                <PresentMenu />
            </span>
        </>
    );
});

const CustomTitle = React.memo(({ token }: { token?: string | null }) => {
    const editor = useStore(getEditor);
    const title = token && token.length > 0 ?
        `${editor.name}` :
        `${editor.name} (${texts.common.unsaved})`;

    return (
        <Title text={title} />
    );
});
