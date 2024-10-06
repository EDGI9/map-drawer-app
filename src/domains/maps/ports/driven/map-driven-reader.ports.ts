import { MapEntity } from "../../core/entities/map.entity";

export interface MapDrivenReaderPort {
    getById(id: string): Promise<MapEntity | null>
}