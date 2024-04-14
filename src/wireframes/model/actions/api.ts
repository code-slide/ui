/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const strToList = (str: string) => {
    // Remove the outer brackets and split the string into separate items
    let items = str.slice(2, -2).split('], [');

    // Process each item to remove the quotes and split it into a list
    let result = items.map(item => {
        // Split into sub-items using `,` symbol, ignoring those inside curly brackets
        const regex = /,(?![^{]*})/;
        let subItems = item.split(regex);
        
        // Process each sub-item to remove the quotes
        let listItem = subItems.map(subItem => subItem.trim().slice(1, -1));
        
        return listItem;
    });
    
    return result;
}

export async function fetchDiagram(readToken: string) {
    const response = await fetch(`${SERVER_URL}/store/${readToken}`);

    if (!response.ok) {
        throw Error('Failed to load diagram');
    }

    const stored = await response.json();

    return stored;
}

export const parseFrames = async (script: string) => {
    const response = await fetch(`${SERVER_URL}/parser`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            script: script
        })
    });

    if (!response.ok) throw Error(response.statusText);

    const data = await response.json();
    const frames = strToList(data.frames);
    return frames;
}

export const compileSlides = async (fileName: string, title: string, size: number[], backgroundColor: string, config: string, frame: string[][]) => {
    const response = await fetch(`${SERVER_URL}/compiler`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            fileName: fileName,
            title: title,
            size: size,
            backgroundColor: backgroundColor,
            config: config,
            frame: frame,
        })
    })

    if (!response.ok) throw Error(response.statusText);

    const data = await response.json();
    const link = `${SERVER_URL}/${data.link}`;
    return link;
}