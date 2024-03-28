/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { DiagramItem } from '@app/wireframes/model';

export type PreviewStart = {
    type: 'Start';
};

export type PreviewEnd = {
    type: 'End';
};

export type PrevieUpdate = {
    type: 'Update';

    items: { [id: string]: DiagramItem };
};

export type PreviewEvent = PreviewStart | PreviewEnd | PrevieUpdate;