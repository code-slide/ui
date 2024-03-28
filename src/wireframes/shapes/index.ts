/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { RendererService } from '@app/wireframes/model/renderer.service';

import { Graphic, Image, Latex, Line, Shape, Table, Textbox } from './dependencies';

import { AbstractControl } from './utils/abstract-control';

export function registerRenderers() {
    RendererService.addRenderer(new AbstractControl(new Graphic()));
    RendererService.addRenderer(new AbstractControl(new Image()));
    RendererService.addRenderer(new AbstractControl(new Latex()));
    RendererService.addRenderer(new AbstractControl(new Line()));
    RendererService.addRenderer(new AbstractControl(new Shape())); 
    RendererService.addRenderer(new AbstractControl(new Table()));
    RendererService.addRenderer(new AbstractControl(new Textbox()));
}
