/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Diagram } from '@app/wireframes/model';

export module IDHelper {
    export function nextId(diagram: Diagram, renderer: string) {
        // Set count = 1 if no occurance for this renderer is registered
        let count = 1 + (diagram.nextIds.get(renderer) || 0);

        while (diagram.items.has(`${renderer}${count}`)) {
            count++;
        }
    
        const newDiagram = diagram.updateNextId(renderer, count);
        const id = `${renderer}${count}`;
    
        return { id, count, newDiagram };
    }
}