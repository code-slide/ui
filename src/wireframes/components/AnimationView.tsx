import * as React from "react";
import { getDiagram, useStore, changeScript } from "@app/wireframes/model";
import { useDispatch } from "react-redux";
import './styles/AnimationView.scss';

export const AnimationView = () => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const animation = useStore(s => s.ui.selectedAnimation);

    if (!diagram) {
        return null;
    }

    const AnimationInputMenu = () => {
        const selectedScript = diagram.script ?? '';
        const changeTextbox = (event: any) => {
            const newCode = event.target.value;
            dispatch(changeScript(diagram.id, newCode));
        };
    
        return (
            <div className="code-editor">
                <textarea value={selectedScript} onChange={changeTextbox} />
            </div>
        );
    };

    const AnimationOutputMenu = () => {
        const selectedFrames = diagram.frames ?? [];

        return (
            <div className="code-editor">
                <div>
                    {
                        selectedFrames.map((frame, i) => {
                            return <p key={i} style={{color: 'blue'}}>&lt;{i+1}&gt;&emsp;{frame.join(', ')}</p>;
                        })
                    }
                </div>
            </div>
        );
    };

    return animation == 'script' ? AnimationInputMenu() : AnimationOutputMenu();
};