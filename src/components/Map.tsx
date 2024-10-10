import { useEffect, useRef, useState } from 'react'

import olMap from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { Draw, Snap, Modify, Select} from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {Style, Stroke, Fill} from 'ol/style';
import 'ol/ol.css';

import Button from "../components/Button";

export default function Map(props) {
    let [vectorSource, setVectorSource] = useState();
    let [selectedShape, setSelectedShape] = useState(null);
    let [shapes, setShapes] = useState([]);
    let mapRef = useRef({});
    const shapesTypes = {
        SQUARE: 'Circle', //Circle is the value to set for square in OpenLibrary
        POLYGON: 'Polygon'
    };

    async function loadMap() {
        if (!props.mapSource || !Object.entries(props.mapSource).length) {
            console.log('No Geo Tiff source');
           return
        }

        const tileLayer = new TileLayer({
            source: props.mapSource,
        });

        const mapObject = new olMap({
            target: 'map',
            layers: [
                tileLayer,
            ],
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
            const rectangleStyle = new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            });
        
            item.setStyle(rectangleStyle)
            return item
        });

        setShapes(shapeFeatures)
        
        const innerVectorSource = new VectorSource({
            features: shapeFeatures,
        });
        
        const vectorLayer = new VectorLayer({
            source: innerVectorSource,
        });

        setVectorSource(innerVectorSource);
        mapRef.current.addLayer(vectorLayer);
    }

    function saveShape(features: []) {
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
            type: type
        };

        switch (type) {
            case shapesTypes.SQUARE:
                drawOptions = {...drawOptions, geometryFunction: geometryFunction }
                break;
            default:
                break;
        }
        let drawData = new Draw(drawOptions);
        const snap = new Snap({source: vectorSource});

        mapRef.current.addInteraction(drawData);  
        mapRef.current.addInteraction(snap);

        drawData.on("drawend", (event) => { 
            const feature = event.feature;
            const newShapesList = shapes;  
            newShapesList.push(feature);        
            saveShape(newShapesList);
            mapRef.current.removeInteraction(drawData);
        })
    }

    function addModifiers() {
        const modify = new Modify({source: vectorSource});
        const select = new Select();
        
        mapRef.current.addInteraction(modify);
        mapRef.current.addInteraction(select);

        modify.on("modifyend", async (event) => {
            const feature = await event.features.getArray()[0];
            const filteredShapeList = shapes.filter(item => item.ol_uid !== feature.ol_uid);
            filteredShapeList.push(feature);
            saveShape(filteredShapeList);
        });

        select.on('select', (event) => {
            const features = event.selected;
            if (features.length > 0) {
                setSelectedShape(features[0])
            } else {
                setSelectedShape(null)
            }
        });
    }

    function removeShape() {
        if (selectedShape) {
            vectorSource.removeFeature(selectedShape);
            setSelectedShape(null)
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
            <div data-testid="qa-map" ref={mapRef} id="map" className='c-map_map' style={{ width: '100%', height: '700px' }}></div>   
        </div>
    )
}