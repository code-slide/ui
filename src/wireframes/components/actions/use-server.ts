import { Diagram, changeFrames, compileSlides, getEditor, getFilteredDiagrams, parseFrames, useStore } from "@app/wireframes/model";
import { AbstractControl } from "@app/wireframes/shapes/utils/abstract-control";
import { getPlugin } from "@app/wireframes/shapes/utils/abstract-plugin";
import * as svg from '@svgdotjs/svg.js';
import { Color } from "@app/core/utils/color";
import { shapes } from "@app/const";
import { MessageInstance } from "antd/es/message/interface";
import { useAppDispatch } from '@app/store';

export function useServer() {
    const dispatch = useAppDispatch();
    const diagrams = useStore(getFilteredDiagrams);
    const editor = useStore(getEditor);

    const getItem = (diagram: Diagram, str: string) => {
        // Split text using `=` symbol, ignoring those inside curly brackets
        const regex = /=(?![^{]*})/;
        const [id, json] = str.split(regex);
    
        // Get item
        let item = diagram.items.get(id);
        if (!item || !json) return { item: item, id: id };
    
        // Parse str -> json
        let corrected = json.replace(/'/g, '"');
        let jsonObj: {[index: string]: string} = JSON.parse(corrected);      
    
        // Modify appearance if there are valid specifications
        // e.g. Shape1 = {'TEXT': 'Hello, world!'}
        const allKeys = Object.values(shapes.key);
        for (let [key, value] of Object.entries(jsonObj)) {
            if (!allKeys.includes(key)) continue;      // Safe-check
    
            if (key.endsWith('COLOR')) {
                const color = Color.fromValue(value).toNumber();
                item = item.setAppearance(key, color);
            } else {
                item = item.setAppearance(key, value);
            }   
        }
    
        return { item: item, id: id };
    }
    
    const getSlides = () => {
        let frame3D: string[][][] = new Array(diagrams.length);
        
        // Get frames
        diagrams.map((diagram, i) => {
            const frames = diagram.frames ?? [];
            frame3D[i] = [];
    
            frames.map((frame, j) => {
                const usedIDs: string[] = [];
                frame3D[i][j] = [];
    
                for (let k = frame.length; k > 0; k--) {
                    const { item, id } = getItem(diagram, frame[k - 1]);
                    if (!item || usedIDs.includes(id)) continue;
                    usedIDs.push(id);
                    
                    // Get svg
                    const svgControl = new AbstractControl(getPlugin(item.renderer));
                    const svgElement: svg.Element = svgControl.render(item, undefined);
                    const svgCode = svgElement.node.outerHTML;
    
                    // Push object to the head of parent map
                    frame3D[i][j] = [svgCode, ...frame3D[i][j]];
                }
            })
        })
    
        // Reshape from 3D to 2D
        let frame2D = [];
        for (let row of frame3D) for (let e of row) frame2D.push(e);
    
        return {
            fileName: editor.id,
            title: editor.name,
            backgroundColor: editor.color.toString(),
            size: [editor.size.x, editor.size.y],
            config: editor.revealConfig,
            frame: frame2D,
        };
    }
    
    const fetchParser = async () => {
        for (let diagram of diagrams) {
            const script = diagram.script;
            if (!script) continue;
    
            const frames = await parseFrames(script);
            dispatch(changeFrames(diagram.id, frames));
        }
    }
    
    const fetchCompiler = async () => {
        const { fileName, title, size, backgroundColor, config, frame } = getSlides();
    
        const linkPresentation = await compileSlides(fileName, title, size, backgroundColor, config, frame);
            
        return linkPresentation;
    }
    
    const fetchApi = () => {
        // Fetch frames from parser
        fetchParser();
    
        // Fetch presentation from compiler
        const links = fetchCompiler();
        return links;
    }
    
    const fetchPdf = async (messageApi: MessageInstance, messageKey: string) => {
        // Start compiling
        messageApi.open({ key: messageKey, type: 'loading', content: 'Exporting presentation...' });

        try {
            const { linkPdf } = await fetchApi();
            window.open(linkPdf, '_blank');
        } catch (err) {
            messageApi.error(`${err}`);
        } finally {
            messageApi.open({
                key: messageKey,
                type: 'success',
                content: `Preparing completed. Your presentation will be opened in a new tab.`,
                duration: 1,
            });
        }
        return;
    }
    
    const fetchSlide = async (messageApi: MessageInstance, messageKey: string) => {
        messageApi.open({ key: messageKey, type: 'loading', content: 'Preparing presentation...' });
    
        try {
            const { linkSlide } = await fetchApi();
            window.open(linkSlide, '_blank');
        } catch (err) {
            messageApi.error(`${err}`);
            return;
        }

        messageApi.open({
            key: messageKey,
            type: 'success',
            content: `Preparing completed. Your presentation will be opened in a new tab.`,
            duration: 1,
        });
        return;
    }

    return { slide: fetchSlide, pdf: fetchPdf };
}

