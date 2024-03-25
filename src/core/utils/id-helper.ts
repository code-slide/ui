/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

export module IDHelper {
    let CURRENT_ID: { [renderer: string]: any } = {};
    
    export function nextId(renderer: string) {
        CURRENT_ID[renderer] = (renderer in CURRENT_ID) ? CURRENT_ID[renderer] + 1 : 1;
        
        return `${renderer}${CURRENT_ID[renderer]}`;
    }
}