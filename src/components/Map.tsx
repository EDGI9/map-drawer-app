import React, { useEffect, useRef, useState } from 'react'

import olMap from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { Draw, Snap, Modify, Select} from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {Style, Stroke, Fill} from 'ol/style';
import 'ol/ol.css';

import Button from "../components/Button";
import { MapInterface } from "../interfaces/components";
import { Feature } from 'ol';

const Map: React.FC<MapInterface> = (props) => {
    let [vectorSource, setVectorSource] = useState<VectorSource>();
    let [selectedShape, setSelectedShape] = useState<Feature | {}>();
    let [shapes, setShapes] = useState<Object[]>([]);
    let mapRef = useRef<olMap | {}>({});
    const shapesTypes = {
        SQUARE: 'Circle', //Circle is the value to set for square in OpenLibrary
        POLYGON: 'Polygon'
    };
    const shapeStyle = new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(0, 0, 255, 0.1)',
        }),
    });

    async function loadMap() {
        if (!props.mapSource || !Object.entries(props.mapSource).length) {
            console.log('No Geo Tiff source');
           return
        }

        const tileLayer = new TileLayer({
            //@ts-ignore
            source: props.mapSource,
        });

        const mapObject = new olMap({
            target: 'map',
            layers: [
                tileLayer,
            ],
            //@ts-ignore
            view: props.mapSource.getView(),
        });

        mapObject.on('pointermove', function (evt) {
            mapObject.getTargetElement().style.cursor = '';
          
            mapObject.forEachFeatureAtPixel(evt.pixel, function (feature) {
              if (feature) {
                mapObject.getTargetElement().style.cursor = 'pointer';
              }
            });
        });

        mapRef.current = mapObject;
        loadShapes();
    }

    function loadShapes() {
        const shapeFeatures = props.shapes.map((item) => {
            const rectangleStyle = shapeStyle;
            //@ts-ignore
            item.setStyle(rectangleStyle)
            return item
        });

        setShapes(shapeFeatures)
        
        const innerVectorSource = new VectorSource({
            //@ts-ignore
            features: shapeFeatures,
        });
        
        const vectorLayer = new VectorLayer({
            source: innerVectorSource,
        });
        //@ts-ignore
        setVectorSource(innerVectorSource);
        //@ts-ignore
        mapRef.current.addLayer(vectorLayer);
    }

    function saveShape(features: Object[]) {
        setShapes(features)
        props.onUpdate(features)
    }


    function addShape(type:string) {
        if (!mapRef.current) {
            return  
        }

        let geometryFunction = createRegularPolygon(4);

        let drawOptions= {
            source: vectorSource,
            type: type,
            style: shapeStyle,
        };

        switch (type) {
            case shapesTypes.SQUARE:
                //@ts-ignore
                drawOptions = {...drawOptions, geometryFunction: geometryFunction }
                break;
            default:
                break;
        }
        //@ts-ignore
        let drawData = new Draw(drawOptions);
        const snap = new Snap({source: vectorSource});
        //@ts-ignore
        mapRef.current.addInteraction(drawData);  
        //@ts-ignore
        mapRef.current.addInteraction(snap);

        drawData.on("drawend", (event) => { 
            const feature = event.feature;
            const newShapesList = shapes; 
            feature.setStyle(shapeStyle) 
            newShapesList.push(feature);        
            saveShape(newShapesList);
            //@ts-ignore
            mapRef.current.removeInteraction(drawData);
        })
    }

    function addModifiers() {
        const modify = new Modify({source: vectorSource});
        const select = new Select();
        //@ts-ignore
        mapRef.current.addInteraction(modify);
        //@ts-ignore
        mapRef.current.addInteraction(select);

        modify.on("modifyend", async (event) => {
            const feature = await event.features.getArray()[0];
            //@ts-ignore
            const filteredShapeList = shapes.filter(item => item.ol_uid !== feature.ol_uid);
            filteredShapeList.push(feature);
            saveShape(filteredShapeList);
        });

        select.on('select', (event) => {
            const features = event.selected;
            if (features.length > 0) {
                setSelectedShape(features[0])
            } else {
                setSelectedShape({})
            }
        });
    }

    function removeShape() {
        if (selectedShape) {
            //@ts-ignore
            vectorSource.removeFeature(selectedShape);
            setSelectedShape({})
            //@ts-ignore
            const features = vectorSource.getFeatures()
            saveShape(features);
        }
    }

    useEffect(() => {
        loadMap();
    }, [props.mapSource]);

    useEffect(() => {
        if (!vectorSource) {
            return
        }
        addModifiers();
    }, [vectorSource]);

    return (
        <div data-testid="qa-map_container" className='c-map'>
            <div className='c-map_actions'>
                <Button text="Add rectangle"  onClick={() =>addShape(shapesTypes.SQUARE)}/>
                <Button text="Add Polygon"  onClick={() =>addShape(shapesTypes.POLYGON)}/>
                <Button text="Delete selected shape"  onClick={() =>removeShape()}/>
            </div>
            {/* @ts-ignore */}
            <div data-testid="qa-map" ref={mapRef} id="map" className='c-map_map' style={{ width: '100%', height: '700px' }}></div>   
        </div>
    )
}

export default Map;