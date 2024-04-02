/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Color, ImmutableList, ImmutableMap, MathHelper, Record, Vec2 } from '@app/core/utils';
import { scripts } from '@app/const';
import { Diagram } from './diagram';
import { UndoableState } from './undoable-state';

type Diagrams = ImmutableMap<Diagram>;
type DiagramIds = ImmutableList<string>;

type Props = {
    // The id of the selected diagram.
    selectedDiagramId?: string | null;

    // The actual diagrams.
    diagrams: Diagrams;

    // The list of ordered diagram ids.
    diagramIds: DiagramIds;

    // The name of this presentation.
    name: string;

    // The size of all diagrams.
    size: Vec2;

    // The id of the state.
    id: string;

    // The color for all diagrams.
    color: Color;

    // The reveal.js' configuration
    revealConfig: string;
};

export type InitialEditorProps = {
    // The actual diagrams.
    diagrams?: { [id: string]: Diagram } | ImmutableMap<Diagram>;

    // The list of ordered diagram ids.
    diagramIds?: ReadonlyArray<string> | DiagramIds;

    // The name of this presentation.
    name?: string;

    // The size of all diagrams.
    size?: Vec2;

    // The color for all diagrams.
    color?: Color;
};

export class EditorState extends Record<Props> {
    public get id() {
        return this.get('id');
    }

    public get selectedDiagramId() {
        return this.get('selectedDiagramId');
    }

    public get diagrams() {
        return this.get('diagrams');
    }

    public get diagramIds() {
        return this.get('diagramIds');
    }

    public get name() {
        return this.get('name');
    }

    public get color() {
        return this.get('color');
    }

    public get size() {
        return this.get('size');
    }

    public get revealConfig() {
        return this.get('revealConfig');
    }

    public get orderedDiagrams(): ReadonlyArray<Diagram> {
        return this.diagramIds.values.map(x => this.diagrams.get(x)).filter(x => !!x) as Diagram[];
    }

    public static create(setup: InitialEditorProps = {}): EditorState {
        const { name, color, diagrams, diagramIds, size } = setup;

        const props: Props = {
            color: color || Color.WHITE,
            diagrams: ImmutableMap.of(diagrams),
            diagramIds: ImmutableList.of(diagramIds),
            id: MathHelper.guid(),
            size: size || new Vec2(1280, 720),
            name: name || 'Untitled Presentation',
            revealConfig: scripts.common.reveal,
        };

        return new EditorState(props);
    }

    public changeName(name: string) {
        return this.set('name', name);
    }

    public changeSize(size: Vec2) {
        return this.set('size', size);
    }

    public changeColor(color: Color) {
        return this.set('color', color);
    }

    public changeReveal(config: string) {
        return this.set('revealConfig', config);
    }

    public moveDiagram(diagramId: string, index: number) {
        return this.set('diagramIds', this.diagramIds.moveTo([diagramId], index));
    }

    public updateDiagram(diagramId: string, updater: (value: Diagram) => Diagram) {
        return this.set('diagrams', this.diagrams.update(diagramId, updater));
    }

    public updateAllDiagrams(updater: (value: Diagram) => Diagram) {
        return this.set('diagrams', this.diagrams.updateAll(updater));
    }

    public selectDiagram(diagramId: string | null | undefined) {
        if (!this.diagrams.get(diagramId!)) {
            return this;
        }

        return this.set('selectedDiagramId', diagramId);
    }

    public removeDiagram(diagramId: string) {
        return this.merge({
            diagrams: this.diagrams.remove(diagramId),
            diagramIds: this.diagramIds.remove(diagramId),
            selectedDiagramId: this.selectedDiagramId ? null : this.selectedDiagramId,
        });
    }

    public addDiagram(diagram: Diagram) {
        if (!diagram || this.diagrams.get(diagram.id)) {
            return this;
        }

        return this.merge({
            diagrams: this.diagrams.set(diagram.id, diagram),
            diagramIds: this.diagramIds.add(diagram.id),
        });
    }
}

export interface EditorStateInStore {
    editor: UndoableState<EditorState>;
}
