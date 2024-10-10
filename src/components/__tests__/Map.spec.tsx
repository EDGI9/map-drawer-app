import { describe, it, expect, afterAll, vi, beforeEach } from "vitest";
import { render, cleanup, RenderResult } from '@testing-library/react';
import React from "react";

import MapComponent from "../Map.js";

import {MapList} from "../../domains/maps/__mocks__/maps.js"
import { ShapeList } from "../../domains/shapes/__mocks__/shapes.js"
import { ShapeDTO } from "../../domains/shapes/core/dtos/shape.dto.js";

describe('Map component', () => {
    let map = MapList;
    let shapes: ShapeDTO = ShapeList;
    let component: RenderResult;
    let mapElement: HTMLElement;
    const props = {
        source: map,
        shapes: shapes,
        onUpdate: vi.fn()
    }

    beforeEach(()=> {
        component = render(<MapComponent {...props} />);
    });

    afterAll(() => {
        cleanup();
    });

    it('Renders Component', () => {
        mapElement = component.getByTestId('qa-map_container');
        expect(mapElement).toBeTruthy();
    });

    it.skip('Component receives correct props', () => {
        //
    });
    it.skip('Component emits update with shape data', () => {
       //
    });
    
});