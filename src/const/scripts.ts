/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { vogues } from "./vogues"

export const scripts = {
    common: {
        animation: '',
        reveal: JSON.stringify({ 
            hash: true, 
            backgroundTransition: "none",
            width: vogues.common.canvasWidth,
            height: vogues.common.canvasHeight,
        }, null, 4)
    }
}