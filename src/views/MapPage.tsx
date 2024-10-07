import { useEffect, useRef, useState } from 'react'

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw.js';
import Polygon from 'ol/geom/Polygon.js';
import View from 'ol/View.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';

import MapService from "../domains/maps/index";
import { MapList } from "../domains/maps/__mocks__/maps";
import ShapesService from "../domains/shapes";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';


function MapPage() {
    let [geoTiffSource, setGeoTiffSource] = useState();
    let [geoTiffLayer, setGeoTiffLayer] = useState();
    let [draw, setDraw] = useState();
    let mapRef = useRef({});

    const source = new VectorSource({wrapX: false});
    const vector = new VectorLayer({
        source: source,
    });

    async function loadGeoTiff() {
        const mapData = await MapService.getById(MapList[0].id);
        if (!mapData) {
            console.log('No Map data');
            return
        }

        const source = new GeoTIFF({
            sources: [
                {
                    url: mapData.src,
                },
            ],
        });

        setGeoTiffSource(source)
    }

    async function loadMap() {
        if (!geoTiffSource) {
            console.log('No Geo Tiff source');
           return
        }

        const tileLayer = new TileLayer({
            source: geoTiffSource,
        });


        setGeoTiffLayer(tileLayer)

        const mapObject = new Map({
            target: 'map-area',
            layers: [
                tileLayer,
                vector
            ],
            view: geoTiffSource.getView(),
        });

        mapRef.current = mapObject;
    }


    function addRectangle() {

        let geometryFunction = createRegularPolygon(4);
        let drawData = new Draw({
            source: source,
            //source: geoTiffSource,
            type: 'Circle',
            geometryFunction: geometryFunction,
        });
        setDraw(drawData)
        mapRef.current.addInteraction(drawData);
    }

    useEffect(() => {
        loadGeoTiff();
    }, []);

    useEffect(() => {
        loadMap();
    }, [geoTiffSource]);

    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button onClick={() => addRectangle()}>Add rectangle</button>
            </div>
            <div ref={mapRef} id="map-area" className='c-drawing-container' style={{ width: '100%', height: '400px' }}>

            </div>
        </div>
    )
};

export default MapPage;