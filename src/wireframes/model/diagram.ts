/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ImmutableList, ImmutableMap, ImmutableSet, MathHelper, Record, Types } from '@app/core/utils';
import { DiagramItem } from './diagram-item';
import { DiagramItemSet } from './diagram-item-set';
import { scripts } from '@app/const';

type Items = ImmutableMap<DiagramItem>;
type ItemIds = ImmutableList<string>;
type NextIds = Map<string, number>;

type UpdateProps = {
    // The list of items.
    items: Items;

    // The item ids.
    itemIds: ItemIds;

    // The selected ids.
    selectedIds: ImmutableSet<string>;

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
    selectedIds: ImmutableSet<string>;

    // The animation script
    script: string;

    // Set the master diagram.
    master?: string;

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

    // The animation frames
    frames?: string[][];
};

export class Diagram extends Record<Props> {
    private cachedParents?: { [id: string]: DiagramItem };

    private cachedRootItems?: DiagramItem[];

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
        return this.cachedRootItems ||= this.findItems(this.rootIds.values);
    }

    public static create(setup: InitialDiagramProps = {}) {
        const { id, items, rootIds, master, title } = setup;

        const props: Props = {
            id: id || MathHelper.nextId(),
            items: ImmutableMap.of(items),
            master,
            nextIds: new Map<string, number>,
            rootIds: ImmutableList.of(rootIds),
            selectedIds: ImmutableSet.empty(),
            title,
            script: scripts.common.animation
        };

        return new Diagram(props);
    }

    public children(item: DiagramItem): ReadonlyArray<DiagramItem> {
        return this.findItems(item.childIds.values);
    }

    public findItems(ids: ReadonlyArray<string>) {
        const result: DiagramItem[] = [];

        for (const id of ids) {
            const item = this.items.get(id);

            if (item) {
                result.push(item);
            }
        }

        return result;
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

        if (!this.cachedParents) {
            this.cachedParents = {};

            for (const key of this.items.keys) {
                const item = this.items.get(key);

                if (item?.type === 'Group') {
                    for (const childId of item.childIds.values) {
                        this.cachedParents[childId] = item;
                    }
                }
            }
        }

        return this.cachedParents[id];
    }

    public addShape(shape: DiagramItem) {
        if (!shape || this.items.get(shape.id)) {
            return this;
        }

        return this.arrange(EMPTY_SELECTION, update => {
            update.items = update.items.set(shape.id, shape);

            if (update.items !== this.items) {
                update.itemIds = update.itemIds.add(shape.id);
            }
        });
    }

    public updateNextId(renderer: string, newCount: number) {
        return this.arrange(EMPTY_SELECTION, update => {
            update.nextIds.set(renderer, newCount);
        });
    }

    public updateItems(ids: ReadonlyArray<string>, updater: (value: DiagramItem) => DiagramItem) {
        return this.arrange(EMPTY_SELECTION, update => {
            update.items = update.items.mutate(mutator => {
                for (const id of ids) {
                    mutator.update(id, updater);
                }
            });
        });
    }

    public selectItems(ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.selectedIds = ImmutableSet.of(...ids);
        });
    }

    public moveItems(ids: ReadonlyArray<string>, index: number) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.moveTo(ids, index);
        }, 'SameParent');
    }

    public bringToFront(ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.bringToFront(ids);
        }, 'SameParent');
    }

    public bringForwards(ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.bringForwards(ids);
        }, 'SameParent');
    }

    public sendToBack(ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.sendToBack(ids);
        }, 'SameParent');
    }

    public sendBackwards(ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.sendBackwards(ids);
        }, 'SameParent');
    }

    public group(groupId: string, ids: ReadonlyArray<string>) {
        return this.arrange(ids, update => {
            update.itemIds = update.itemIds.add(groupId).remove(...ids);
            update.items = update.items.set(groupId, DiagramItem.createGroup({ id: groupId, childIds: ids }));
        }, 'SameParent');
    }

    public ungroup(groupId: string) {
        return this.arrange([groupId], update => {
            const group = this.items.get(groupId)!;

            update.itemIds = update.itemIds.add(...group.childIds.values).remove(groupId);
            update.items = update.items.remove(groupId);
        });
    }

    public addItems(set: DiagramItemSet): Diagram {
        if (!set.canAdd(this)) {
            return this;
        }

        return this.arrange(EMPTY_SELECTION, update => {
            update.items = update.items.mutate(mutator => {
                for (const item of set.nested.values()) {
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

        return this.arrange(EMPTY_SELECTION, update => {
            update.items = update.items.mutate(m => {
                for (const item of set.nested.values()) {
                    m.remove(item.id);
                }
            });

            update.selectedIds = update.selectedIds.mutate(m => {
                for (const id of set.nested.keys()) {
                    m.remove(id);
                }
            });

            update.itemIds = update.itemIds.remove(...set.rootIds);
        });
    }

    public setFrames(frames: string[][]) {
        return this.set('frames', frames);
    }

    public setScript(script: string) {
        return this.set('script', script);
    }

    private arrange(targetIds: Iterable<string>, updater: (diagram: UpdateProps) => void, condition?: 'NoCondition' | 'SameParent'): Diagram {
        if (!targetIds) {
            return this;
        }

        let resultParent: DiagramItem | undefined = undefined;
        let index = 0;

        // All items must have the same parent for the update.
        for (const itemId of targetIds) {
            const item = this.items.get(itemId);

            if (!item) {
                return this;
            }

            const parent = this.parent(itemId);

            if (index === 0) {
                resultParent = parent;
            } else if (parent !== resultParent && condition === 'SameParent') {
                return this;
            }

            index++;
        }

        if (resultParent) {
            const update = {
                items: this.items,
                itemIds: resultParent.childIds,
                selectedIds: this.selectedIds, 
                nextIds: this.nextIds,
            };

            updater(update);

            if (update.itemIds !== resultParent.childIds) {
                update.items = update.items || this.items;
                update.items = update.items.update(resultParent.id, p => p.set('childIds', update.itemIds));
            }

            return this.merge({ items: update.items, selectedIds: update.selectedIds });
        } else {
            const update = {
                items: this.items,
                itemIds: this.rootIds,
                selectedIds: this.selectedIds, 
                nextIds: this.nextIds,
            };

            updater(update);

            return this.merge({ items: update.items, selectedIds: update.selectedIds, rootIds: update.itemIds });
        }
    }
}

const EMPTY_SELECTION: ReadonlyArray<string> = [];