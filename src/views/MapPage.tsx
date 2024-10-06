import { useEffect, useState } from "react";
import MapService from "../domains/maps/index";
import { MapList } from "../domains/maps/__mocks__/maps";
import ShapesService from "../domains/shapes";


function MapPage() {
    
    async function getMap() {
        const map = await MapService.getById(MapList[0].id);

        if (!map) {
            console.log('Map not found');
            return  
        }
        
        const shapes = await ShapesService.getById(map.id)
        console.log(map, shapes);
    }

    useEffect(() => {
        getMap()
    }, [])

    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button>Add Rect</button>
                <button>Add Polygon</button>
            </div>
            <div>
                {/* map location */}
            </div>
        </div>
    )
};

export default MapPage;