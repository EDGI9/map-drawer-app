import { MapEntity } from "../../core/entities/map.entity";

export interface MapDrivenPort {
    getById(id: string): Promise<MapEntity | null>
}