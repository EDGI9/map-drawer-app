import { useEffect, useState } from 'react'

import GeoTIFF from 'ol/source/GeoTIFF';
import GeoJSON from 'ol/format/GeoJSON';

import MapComponent from "../components/Map";
import MapService from "../domains/maps/index";
import ShapesService from "../domains/shapes";
import { MapList } from "../domains/maps/__mocks__/maps";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';

function MapPage() {
    let [shapes, setShapes] = useState<ShapeDTO[]>([]);
    let [map, setMap] = useState<MapDTO | {}>({});

    async function getShapes() {
        const shapesData = await ShapesService.getById(MapList[0].id);
        if (!shapesData) {
            console.log('No Shape data found');
            return
        };

        const transformedShapesData = shapesData.map(item => new GeoJSON().readFeature(item));
        //@ts-ignore
        setShapes(transformedShapesData);
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

        setMap(source)
    }

    function updateShapes(featureList: Object[]) {
        //@ts-ignore
        const featureGeoJSON = featureList.map(item => new GeoJSON().writeFeature(item))
        //@ts-ignore
        ShapesService.update(MapList[0].id, featureGeoJSON) 
    }

    useEffect(() => {
        getGeoTiff();
        getShapes();
    }, []);

    return(
        <div className='l-main-page'>
            <h1 className='l-main-page_title'>Map area</h1>
            <div className='l-main-page_main'>
                {/* @ts-ignore */}
                <MapComponent shapes={shapes} mapSource={map} onUpdate={updateShapes}/>
            </div>
        </div>
    )
};

export default MapPage;