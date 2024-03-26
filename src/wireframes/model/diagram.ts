/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { ImmutableList, ImmutableMap, ImmutableSet, MathHelper, Record, Types } from '@app/core/utils';
import { DiagramItem } from './diagram-item';
import { DiagramItemSet } from './diagram-item-set';

type Items = ImmutableMap<DiagramItem>;
type ItemIds = ImmutableList<string>;
type NextIds = Map<string, number>;

type UpdateProps = {
    // The list of items.
    items: Items;

    // The item ids.
    itemIds: ItemIds;

    // The selected ids.
    selectedIds: ImmutableSet;

    // The map of renderers' next id.
    nextIds: NextIds;
};

type Props = {
    // The unique id of the diagram.
    id: string;

    // The optional title.
    title?: string;

    // The list of items.
    items: Items;

    // The map of renderers' next id.
    nextIds: NextIds;

    // The root ids.
    rootIds: ItemIds;

    // The selected ids.
    selectedIds: ImmutableSet;

    // Set the master diagram.
    master?: string;

    // The animation script
    script?: string;

    // The animation script
    frames?: string[][];
};

export type InitialDiagramProps = {
    // The unique id of the diagram.
    id?: string;

    // The optional title.
    title?: string;

    // The list of items.
    items?: { [id: string]: DiagramItem } | Items;

    // The map of renderers' next id.
    nextIds?: { [renderer: string]: number } | NextIds;

    // The rootIds ids.
    rootIds?: ReadonlyArray<string> | ItemIds;

    // Set the master diagram.
    master?: string;

    // The animation script
    script?: string;

    // The animation frames
    frames?: string[][];
};

export class Diagram extends Record<Props> {
    private parents: { [id: string]: DiagramItem } = {};

    public get id() {
        return this.get('id');
    }

    public get title() {
        return this.get('title');
    }

    public get items() {
        return this.get('items');
    }

    public get rootIds() {
        return this.get('rootIds');
    }

    public get nextIds() {
        return this.get('nextIds');
    }

    public get selectedIds() {
        return this.get('selectedIds');
    }

    public get master() {
        return this.get('master');
    }

    public get script() {
        return this.get('script');
    }

    public get frames() {
        return this.get('frames');
    }

    public get rootItems(): ReadonlyArray<DiagramItem> {
        return this.rootIds.values.map(x => this.items.get(x)).filter(x => !!x) as DiagramItem[];
    }

    public static create(setup: InitialDiagramProps = {}) {
        const { id, items, rootIds, master, title, script } = setup;

        const props: Props = {
            id: id || MathHelper.nextId(),
            items: ImmutableMap.of(items),
            master,
            nextIds: new Map<string, number>,
            rootIds: ImmutableList.of(rootIds),
            selectedIds: ImmutableSet.empty(),
            title,
            script,
        };

        return new Diagram(props);
    }

    public children(item: DiagramItem): ReadonlyArray<DiagramItem> {
        return item.childIds.values.map(x => this.items.get(x)!).filter(x => !!x)!;
    }

    public rename(title: string | undefined) {
        return this.set('title', title);
    }

    public setMaster(master: string | undefined) {
        return this.set('master', master);
    }

    public updateAllItems(updater: (value: DiagramItem) => DiagramItem) {
        return this.set('items', this.items.updateAll(updater));
    }

    public clone() {
        return this.set('id', MathHelper.guid());
    }

    public parent(id: string | DiagramItem) {
        if (!id) {
            return undefined;
        }

        if (Types.is(id, DiagramItem)) {
            id = id.id;
        }

        if (!this.parents) {
            this.parents = {};

            for (const key of this.items.keys) {
                const item = this.items.get(key);

                if (item?.type === 'Group') {
                    for (const childId of item.childIds.values) {
                        this.parents[childId] = item;
                    }
                }
            }
        }

        return this.parents[id];
    }

    public addShape(shape: DiagramItem) {
        if (!shape || this.items.get(shape.id)) {
            return this;
        }

        return this.mutate([], update => {
            update.items = update.items.set(shape.id, shape);

            if (update.items !== this.items) {
                update.itemIds = update.itemIds.add(shape.id);
            }
        });
    }

    public updateNextId(renderer: string, newCount: number) {
        return this.mutate([], update => {
            update.nextIds.set(renderer, newCount);
        });
    }

    public updateItems(ids: ReadonlyArray<string>, updater: (value: DiagramItem) => DiagramItem) {
        return this.mutate(ids, update => {
            update.items = update.items.mutate(mutator => {
                for (const id of ids) {
                    mutator.update(id, updater);
                }
            });
        });
    }

    public selectItems(ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.selectedIds = ImmutableSet.of(...ids);
        });
    }

    public moveItems(ids: ReadonlyArray<string>, index: number) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.moveTo(ids, index);
        });
    }

    public bringToFront(ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.bringToFront(ids);
        });
    }

    public bringForwards(ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.bringForwards(ids);
        });
    }

    public sendToBack(ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.sendToBack(ids);
        });
    }

    public sendBackwards(ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.sendBackwards(ids);
        });
    }

    public group(groupId: string, ids: ReadonlyArray<string>) {
        return this.mutate(ids, update => {
            update.itemIds = update.itemIds.add(groupId).remove(...ids);
            update.items = update.items.set(groupId, DiagramItem.createGroup({ id: groupId, childIds: ids }));
        });
    }

    public ungroup(groupId: string) {
        return this.mutate([groupId], (update, targetItems) => {
            update.itemIds = update.itemIds.add(...targetItems[0].childIds?.values).remove(groupId);
            update.items = update.items.remove(groupId);
        });
    }

    public addItems(set: DiagramItemSet): Diagram {
        if (!set.canAdd(this)) {
            return this;
        }

        return this.mutate([], update => {
            update.items = update.items.mutate(mutator => {
                for (const item of set.allItems) {
                    mutator.set(item.id, item);
                }
            });

            update.itemIds = update.itemIds.add(...set.rootIds);
        });
    }

    public removeItems(set: DiagramItemSet): Diagram {
        if (!set.canRemove(this)) {
            return this;
        }

        return this.mutate([], update => {
            update.items = update.items.mutate(m => {
                for (const item of set.allItems) {
                    m.remove(item.id);
                }
            });

            update.selectedIds = update.selectedIds.mutate(m => {
                for (const item of set.allItems) {
                    m.remove(item.id);
                }
            });

            update.itemIds = update.itemIds.remove(...set.rootIds);
        });
    }

    public setScript(script: string) {
        return this.set('script', script);
    }

    public setFrames(frames: string[][]) {
        return this.set('frames', frames);
    }

    private mutate(targetIds: ReadonlyArray<string>, updater: (diagram: UpdateProps, targetItems: DiagramItem[]) => void): Diagram {
        if (!targetIds) {
            return this;
        }

        const resultItems: DiagramItem[] = [];
        const resultParent = this.parent(targetIds[0]);

        // All items must have the same parent for the update.
        for (const itemId of targetIds) {
            const item = this.items.get(itemId);

            if (!item) {
                return this;
            }

            if (this.parent(itemId) !== resultParent) {
                return this;
            }

            resultItems.push(item);
        }

        let update: UpdateProps;

        if (resultParent) {
            update = {
                items: this.items,
                itemIds: resultParent.childIds,
                selectedIds: this.selectedIds, 
                nextIds: this.nextIds,
            };

            updater(update, resultItems);

            if (update.itemIds !== resultParent.childIds) {
                update.items = update.items || this.items;
                update.items = update.items.update(resultParent.id, p => p.set('childIds', update.itemIds));
            }

        } else {
            update = {
                items: this.items,
                itemIds: this.rootIds,
                selectedIds: this.selectedIds, 
                nextIds: this.nextIds,
            };

            updater(update, resultItems);

            (update as any)['rootIds'] = update.itemIds;
        }

        delete (update as any).itemIds;

        return this.merge(update);
    }
}
