/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { shapes } from '@app/const';
import { IDHelper } from '@app/core/utils';
import { Diagram, DiagramItem } from '@app/wireframes/model';

describe('IDHelper', () => {
    it('should instantiate', () => {
        Object.values(shapes.id).map((renderer) => {
            const diagram = Diagram.create();
            const { id, count, newDiagram } = IDHelper.nextId(diagram, renderer);

            expect(id).toBe(`${renderer}1`);
            expect(count).toBe(1);
            expect(newDiagram.nextIds.get(renderer)).toBe(1);
        })
    });

    it('should generate next id', () => {
        Object.values(shapes.id).map((renderer) => {
            let diagram = Diagram.create();
            diagram = diagram.addShape(DiagramItem.createShape({ renderer: renderer }, diagram));
            const { id, count, newDiagram } = IDHelper.nextId(diagram, renderer);

            expect(id).toBe(`${renderer}2`);
            expect(count).toBe(2);
            expect(newDiagram.nextIds.get(renderer)).toBe(2);
        })
    });

    it('should adjust next id if existed', () => {
        Object.values(shapes.id).map((renderer) => {
            let diagram = Diagram.create();
            diagram = diagram.addShape(DiagramItem.createShape({ id: `${renderer}1`,renderer: renderer }, diagram));
            diagram = diagram.addShape(DiagramItem.createShape({ renderer: renderer }, diagram));

            const { id, count, newDiagram } = IDHelper.nextId(diagram, renderer);

            expect(id).toBe(`${renderer}3`);
            expect(count).toBe(3);
            expect(newDiagram.nextIds.get(renderer)).toBe(3);
        })
    });
});
