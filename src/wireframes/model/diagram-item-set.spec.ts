/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Diagram, DiagramItem, DiagramItemSet } from '@app/wireframes/model';

describe('Diagram Item Set', () => {
    const groupId = 'group-1';
    const root1 = DiagramItem.createShape({ id: '1', renderer: 'Button' });
    const root2 = DiagramItem.createShape({ id: '2', renderer: 'Button' });
    const child1 = DiagramItem.createShape({ id: '3', renderer: 'Button' });
    const child2 = DiagramItem.createShape({ id: '4', renderer: 'Button' });

    const diagram =
        Diagram.create()
            .addShape(root1)
            .addShape(root2)
            .addShape(child1)
            .addShape(child2)
            .group(groupId, [child1.id, child2.id]);

    it('should create from root items', () => {
        const set = DiagramItemSet.createFromDiagram([groupId], diagram);

        expect(set.allItems.map(x => x.id)).toEqual([groupId, child1.id, child2.id]);
    });

    it('should create from child items', () => {
        const set = DiagramItemSet.createFromDiagram([child1.id], diagram);

        expect(set.allItems.map(x => x.id)).toEqual([child1.id]);
    });

    it('should keep the order in children intact', () => {
        const set = DiagramItemSet.createFromDiagram([child2.id, child1.id], diagram);

        expect(set.allItems.map(x => x.id)).toEqual([child1.id, child2.id]);
    });

    it('should keep the order in root intact', () => {
        const set = DiagramItemSet.createFromDiagram([root2.id, root2.id], diagram);

        expect(set.allItems.map(x => x.id)).toEqual([root2.id, root2.id]);
    });

    it('should keep the order in mixed items intact', () => {
        const set = DiagramItemSet.createFromDiagram([root2.id, child2.id, root2.id, child1.id], diagram);

        expect(set.allItems.map(x => x.id)).toEqual([root2.id, root2.id, child1.id, child2.id]);
    });
});