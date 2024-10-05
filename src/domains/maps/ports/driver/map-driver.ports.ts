import { MapDTO } from "../../core/dtos/map.dto";

export interface MapDriverPort {
    getById(id: string): Promise<MapDTO | null>
}