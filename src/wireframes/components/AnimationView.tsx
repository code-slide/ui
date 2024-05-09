/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import Prism from 'prismjs';
import { useEffect, useState } from 'react';
import { getDiagram, useStore, changeScript } from "@app/wireframes/model";
import { default as CodeEditor } from 'react-simple-code-editor';
import { vogues, texts } from '@app/const';
import { useAppDispatch } from '@app/store';

import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import './styles/AnimationView.scss';

export const AnimationView = () => {
    const dispatch = useAppDispatch();
    const diagram = useStore(getDiagram);
    const animation = useStore(s => s.ui.selectedAnimation);
    const isFooter = useStore(s => s.ui.footerSize) == vogues.common.previewHeight ? 1 : 0;

    const viewPadd = vogues.common.editorMargin * 2 + 10 * 3 + vogues.common.headerHeight + vogues.common.shapeWidth + isFooter *  (vogues.common.previewHeight + vogues.common.editorMargin + vogues.common.previewPadBot) + vogues.common.selectionThickness * 4;
    const [viewHeight, setViewHeight] = useState(window.innerHeight - viewPadd);

    useEffect(() => {
        window.addEventListener('resize', () => setViewHeight(window.innerHeight - viewPadd));
    }, []);

    useEffect(() => {
        setViewHeight(window.innerHeight - viewPadd);
    }, [isFooter]);

    if (!diagram) {
        return null;
    }

    const AnimationInputMenu = () => {
        const selectedScript = diagram.script ?? new Array(10).join('\n');
        const prefix = `${texts.common.prefix}:`;

        const pasteHandler = (event: React.ClipboardEvent<HTMLDivElement>) => {
            const text = event.clipboardData.getData('text');
            if (!text || text.indexOf(prefix) !== 0) return; 

            // Paste drawing objects by their id
            const textJson = JSON.parse(text.substring(prefix.length));
            const pasteText: string = textJson['visuals'].map(
                (e: {[id: string]: string}) => { return e['id'] as string; }
            )
            const modifiedText = selectedScript + pasteText;
            dispatch(changeScript(diagram.id, modifiedText))
            event.preventDefault();
        };

        return (
            <div className='code-editor' style={{ maxHeight: viewHeight }}>
                <CodeEditor
                    placeholder='Write animation scripts here...'
                    value={selectedScript}
                    onValueChange={code => dispatch(changeScript(diagram.id, code))}
                    highlight={code => Prism.highlight(code, Prism.languages.py, 'python')}
                    padding={16}
                    onPaste={pasteHandler}
                />
            </div>
        );
    };

    const AnimationOutputMenu = () => {
        const selectedFrames = diagram.frames ?? [];

        return (
            <div className="code-output">
                <div>
                    {
                        selectedFrames.map((frame, i) => {
                            return <p key={i} style={{ color: 'blue' }}>&lt;{i + 1}&gt;&emsp;{frame.join(', ')}</p>;
                        })
                    }
                </div>
            </div>
        );
    };

    return animation == 'script' ? AnimationInputMenu() : AnimationOutputMenu();
};