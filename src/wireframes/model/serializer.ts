/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { IDHelper, ImmutableList, ImmutableMap, Rotation, Vec2 } from '@app/core/utils';
import { Diagram } from './diagram';
import { DiagramItem } from './diagram-item';
import { DiagramItemSet } from './diagram-item-set';
import { EditorState } from './editor-state';
import { RendererService } from './renderer.service';
import { Transform } from './transform';

type IdMap = { [id: string]: string };

export module Serializer {
    export function tryGenerateNewIds(diagram: Diagram, json: string): string {
        try {
            return generateNewIds(diagram, json);
        } catch {
            return json;
        }
    }

    export function generateNewIds(diagram: Diagram, json: string): string {
        const input = JSON.parse(json);

        const idMap: IdMap = {};

        for (const jsonShape of input.visuals) {
            const oldId = jsonShape.id;
            const renderer = jsonShape.renderer;
            jsonShape.id = IDHelper.nextId(diagram, renderer).id;
            idMap[oldId] = jsonShape.id;
        }

        for (const jsonGroup of input.groups) {
            const oldId = jsonGroup.id;
            jsonGroup.id = IDHelper.nextId(diagram, 'Group').id;

            idMap[oldId] = jsonGroup.id;
        }

        for (const jsonGroup of input.groups) {
            jsonGroup.childIds = jsonGroup.childIds.map((id: string) => idMap[id]);
        }

        return JSON.stringify(input);
    }

    export function deserializeSet(input: any): DiagramItemSet {
        const allItems: DiagramItem[] = [];

        for (const inputVisual of input.visuals) {
            const item = readDiagramItem(inputVisual, 'Shape');

            if (item) {
                allItems.push(item);
            }
        }

        for (const inputGroup of input.groups) {
            const item = readDiagramItem(inputGroup, 'Group');

            if (item) {
                allItems.push(item);
            }
        }

        return new DiagramItemSet(allItems);
    }

    export function serializeSet(set: DiagramItemSet) {
        const output: any = { visuals: [], groups: [] };

        for (const item of Object.values(set.allItems)) {
            const serialized = writeDiagramItem(item);

            if (item.type === 'Shape') {
                output.visuals.push(serialized);
            } else {
                output.groups.push(serialized);
            }
        }

        return output;
    }

    export function deserializeEditor(input: any) {
        return readEditor(input);
    }

    export function serializeEditor(editor: EditorState) {
        const output = writeEditor(editor);

        return output;
    }
}

function writeEditor(source: EditorState) {
    return writeObject(source.unsafeValues(), EDITOR_SERIALIZERS);
}

function writeDiagram(source: Diagram) {
    return writeObject(source.unsafeValues(), DIAGRAM_SERIALIZERS);
}

function writeDiagramItem(source: DiagramItem) {
    return writeObject(source.unsafeValues(), DIAGRAM_ITEM_SERIALIZERS);
}

function writeObject(source: object, serializers: PropertySerializers) {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(source)) {
        const serializer = serializers[key];

        if (serializer) {
            result[key] = serializer.get(value);
        }
    }

    return result;
}

function readEditor(source: Record<string, any>) {
    const raw: any = readObject(source, EDITOR_SERIALIZERS);

    return EditorState.create(raw);
}

function readDiagram(source: Record<string, any>) {
    const raw: any = readObject(source, DIAGRAM_SERIALIZERS);

    if (!raw.rootIds) {
        raw.rootIds = source['itemIds'];
    }

    return Diagram.create(raw);
}

function readDiagramItem(source: object, type?: any) {
    const raw: any = readObject(source, DIAGRAM_ITEM_SERIALIZERS);

    if ((raw.type || type) === 'Shape') {
        const defaults = RendererService.get(raw.renderer!)?.createDefaultShape();

        if (!defaults) {
            return null;
        }

        return DiagramItem.createShape({ ...defaults, ...raw });
    } else {
        return DiagramItem.createGroup(raw);
    }
}

function readObject(source: Record<string, any>, serializers: PropertySerializers) {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(source)) {
        const serializer = serializers[key];

        if (serializer) {
            result[key] = serializer.set(value);
        }
    }

    return result;
}

interface PropertySerializer {
    get(source: any): any;
    
    set(source: any): any;
}

type PropertySerializers = { [key: string]: PropertySerializer };

const EDITOR_SERIALIZERS: PropertySerializers = {
    'id': {
        get: (source) => source,
        set: (source) => source,
    },
    'diagrams': {
        get: (source: ImmutableMap<Diagram>) => source.values.map(writeDiagram),
        set: (source: any[]) => buildObject(source.map(readDiagram), x => x.id),
    },
    'diagramIds': {
        get: (source: ImmutableList<string>) => source.values,
        set: (source) => source,
    },
    'size': {
        get: (source: Vec2) => ({ x: source.x, y: source.y }),
        set: (source: any) => new Vec2(source.x, source.y),
    },
};

const DIAGRAM_SERIALIZERS: PropertySerializers = {
    'id': {
        get: (source) => source,
        set: (source) => source,
    },
    'master': {
        get: (source) => source,
        set: (source) => source,
    },
    'items': {
        get: (source: ImmutableMap<DiagramItem>) => source.values.map(writeDiagramItem),
        set: (source: any[]) => buildObject(source.map(readDiagramItem), x => x.id),
    },
    'rootIds': {
        get: (source: ImmutableList<string>) => source.values,
        set: (source) => source,
    },
    'title': {
        get: (source) => source,
        set: (source) => source,
    },
};

const DIAGRAM_ITEM_SERIALIZERS: PropertySerializers = {
    'appearance': {
        get: (source: ImmutableMap<any>) => source.raw,
        set: (source: any) => source,
    },
    'childIds': {
        get: (source: ImmutableList<string>) => source.values,
        set: (source) => source,
    },
    'id': {
        get: (source) => source,
        set: (source) => source,
    },
    'isLocked': {
        get: (source) => source,
        set: (source) => source,
    },
    'name': {
        get: (source) => source,
        set: (source) => source,
    },
    'renderer': {
        get: (source) => source,
        set: (source) => source,
    },
    'rotation': {
        get: (source: Rotation) => source.degree,
        set: (source: any) => Rotation.fromDegree(source),
    },
    'type': {
        get: (source) => source,
        set: (source) => source,
    },
    'transform': {
        get: (source: Transform) => source.toJS(),
        set: (source: any) => Transform.fromJS(source),
    },
};

function buildObject<V>(source: ReadonlyArray<V | undefined | null>, selector: (source: V) => string) {
    const result: { [key: string]: V } = {};

    for (const item of source) {
        if (item) {
            result[selector(item)] = item;
        }
    }

    return result;
}