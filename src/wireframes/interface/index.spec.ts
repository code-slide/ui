/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { getPageLink, getPageLinkId, isPageLink } from "@app/wireframes/interface";

describe('Inteface', () => {
    const id = 'test';

    it('should return correct link', () => {
        expect(getPageLink(id)).toBe(`page://${id}`);
    });

    it('should return correct id', () => {
        expect(getPageLinkId(`page://${id}`)).toBe(id);
    });

    it('should check if correct link is correct', () => {
        expect(isPageLink(`page://${id}`)).toBeTruthy();
        expect(isPageLink(`${id}`)).toBeFalsy();
    });
});