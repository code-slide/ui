/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ColorConfigurable, NumberConfigurable, SelectionConfigurable, SliderConfigurable, TextConfigurable, ToggleConfigurable } from '@app/wireframes/model';

describe('TextConfigurable', () => {
    it('should instantiate', () => {
        const configurable = new TextConfigurable('MyName', 'MyLabel');

        expect(configurable).toBeDefined();
    });
});


describe('ToggleConfigurable', () => {
    it('should instantiate', () => {
        const configurable = new ToggleConfigurable('MyName', 'MyLabel');

        expect(configurable).toBeDefined();
    });
});


describe('SelectionConfigurable', () => {
    it('should instantiate', () => {
        const options = ['Option1', 'Option2'];

        const configurable = new SelectionConfigurable('MyName', 'MyLabel', options);

        expect(configurable).toBeDefined();
        expect(configurable.options).toBe(options);
    });
});

describe('SliderConfigurable', () => {
    it('should instantiate', () => {
        const configurable = new SliderConfigurable('MyName', 'MyLabel', 10, 20);

        expect(configurable).toBeDefined();
        expect(configurable.min).toBe(10);
        expect(configurable.max).toBe(20);
    });

    it('should instantiate default', () => {
        const configurable = new SliderConfigurable('MyName', 'MyLabel');

        expect(configurable).toBeDefined();
        expect(configurable.min).toBe(0);
        expect(configurable.max).toBe(100);
    });
});

describe('NumberConfigurable', () => {
    it('should instantiate', () => {
        const configurable = new NumberConfigurable('MyName', 'MyLabel', 10, 20);

        expect(configurable).toBeDefined();
        expect(configurable.min).toBe(10);
        expect(configurable.max).toBe(20);
    });

    it('should instantiate default', () => {
        const configurable = new NumberConfigurable('MyName', 'MyLabel');

        expect(configurable).toBeDefined();
        expect(configurable.min).toBe(0);
        expect(configurable.max).toBe(100);
    });
});

describe('ColorConfigurable', () => {
    it('should instantiate', () => {
        const configurable = new ColorConfigurable('MyName', 'MyLabel');

        expect(configurable).toBeDefined();
    });
});
