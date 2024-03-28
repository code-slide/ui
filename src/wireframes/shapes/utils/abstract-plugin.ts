/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Graphic, Image, Latex, Line, Raster, Shape, Table, Textbox } from '../dependencies';

export function getPlugin(renderer: string) {
    switch (renderer) {
        case new Graphic().identifier():
            return new Graphic();
        case new Image().identifier():
            return new Image();
        case new Latex().identifier():
            return new Latex();
        case new Line().identifier():
            return new Line();
        case new Shape().identifier():
            return new Shape();
        case new Table().identifier():
            return new Table();
        case new Textbox().identifier():
            return new Textbox();
        default:
            return new Raster();
    }
}
