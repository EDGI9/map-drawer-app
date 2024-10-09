import { useEffect, useRef, useState } from 'react'

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import Feature from 'ol/Feature';  
import Draw, { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {Style, Stroke, Fill} from 'ol/style';
import { Polygon } from 'ol/geom'; 
import { fromLonLat, transform } from 'ol/proj'; 
import 'ol/ol.css';

import MapService from "../domains/maps/index";
import ShapesService from "../domains/shapes";
import { MapList } from "../domains/maps/__mocks__/maps";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';


function MapPage() {
    let [geoTiffSource, setGeoTiffSource] = useState();
    let [draw, setDraw] = useState();
    let [shapes, setShapes] = useState<ShapeDTO[]>([]);
    let [vectorSource, setVectorSource] = useState([]);
    let mapRef = useRef({});
    const shapesTypes = {
        SQUARE: 'Circle', //Circle is the value to set for square in OpenLibrary
        POLYGON: 'Polygon'
    };

    async function getShapes() {
        const shapesData = await ShapesService.getById(MapList[0].id);
        if (!shapesData) {
            console.log('No Shape data found');
            return
        };

        setShapes(shapesData);
    }

    async function getGeoTiff() {
        const mapData: MapDTO | null = await MapService.getById(MapList[0].id) ;
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

        const mapObject = new Map({
            target: 'map',
            layers: [
                tileLayer,
            ],
            view: geoTiffSource.getView(),
        });

        mapRef.current = mapObject;
    }

    function loadShapes() {
        if (!shapes.length) {
            console.log('No Shape data to load');
            return
        };

        shapes.forEach((shape) => {
            const transformedCoords = shape.map(coord =>
                fromLonLat(coord)
            );

            const rectangleGeometry = new Polygon([transformedCoords]);
    
            const rectangleFeature = new Feature({
                geometry: rectangleGeometry,
            });
        
            const vectorSource = new VectorSource({
                features: [rectangleFeature],
            });
        
            const rectangleStyle = new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
                }),
            });
        
            rectangleFeature.setStyle(rectangleStyle);
        
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            mapRef.current.addLayer(vectorLayer);
            setVectorSource(vectorSource)
        });
    }

   
    function addSquare() {
        mapRef.current.removeInteraction(draw);

        let geometryFunction = createRegularPolygon(4);
        let drawData = new Draw({
            source: vectorSource,
            type: shapesTypes.SQUARE,
            geometryFunction: geometryFunction
        });

        setDraw(drawData);
        mapRef.current.addInteraction(drawData);

        drawData.on("drawend", (e) => {
            saveShape(e);
        })
    }

    function saveShape(event) {
        const feature = event.feature;  
        const geometry = feature.getGeometry();  
        
        const coordinates = geometry.getCoordinates();
        
        const geographicCoords = coordinates[0].map((coord) =>
            transform(coord, 'EPSG:3857', 'EPSG:4326')
        );
        
        let updatedShapeList = shapes.push(geographicCoords);
        setShapes(updatedShapeList);
        update();
    }

    function update() {
        ShapesService.update(MapList[0].id, shapes) 
    }

    function addPolygon() {
        mapRef.current.removeInteraction(draw);

        let drawData = new Draw({
            source: vectorSource,
            type: shapesTypes.POLYGON
        });

        setDraw(drawData);
        mapRef.current.addInteraction(drawData);  

        drawData.on("drawend", (e) => {
            saveShape(e);
        })
    }

    useEffect(() => {
        getGeoTiff();
        getShapes();
    }, []);

    useEffect(() => {
        loadMap();
        loadShapes();
    }, [geoTiffSource]);

    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button onClick={() => addSquare()}>Add rectangle</button>
                <button onClick={() => addPolygon()}>Add Polygon</button>
            </div>
            <div ref={mapRef} id="map" className='c-drawing-container' style={{ width: '100%', height: '700px' }}>

            </div>
        </div>
    )
};

export default MapPage;