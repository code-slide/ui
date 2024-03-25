/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
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