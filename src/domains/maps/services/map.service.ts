import { MapDTO } from '../core/dtos/map.dto';
import { MapDrivenReaderPort } from '../ports/driven/map-driven-reader.ports';
import { MapDriverPort } from '../ports/driver/map-driver.ports';

export default function MapService(reader: MapDrivenReaderPort): MapDriverPort {
    async function getById(id: string): Promise<MapDTO | null> {
        const entity = await reader.getById(id);

        if (!entity) {
            return null
        }

        return <MapDTO>{
            id: entity.id,
            src: entity.src,
        }
    }

    return {
        getById  
    }
}