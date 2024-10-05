import { MapList } from "../__mocks__/maps";
// import { MapApiPaths } from "../core/constants/api-paths";
import { MapEntity } from "../core/entities/map.entity";
import { MapDrivenPort } from "../ports/driven/map-driven-reader.ports";

export function MapReaderAdapter(): MapDrivenPort {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    async function getById(id: string): Promise<MapEntity | null> {
        try {
            /* If API existed  */
           /*  const response = await fetch(MapApiPaths.getById.replace('{id}',id),  {
                method: "GET",
                headers: myHeaders
            })

            if (!response) {
                return null
            }

            return response.json(); */

            if (!id) {
                throw new Error("No Id provided");
            }
            /* Simulate response from back-end */
           const response = await new Promise((resolve) => {
                setTimeout(() => {
                    const map = MapList.find((item) => item.id == id);
                    
                    resolve({
                        //@ts-ignore
                        ok: true, 
                        status: 200,
                        json: () => Promise.resolve(map)
                    });
                }, 300);
            });
            //@ts-ignore
            return response.json()
        } catch (error) {
            console.log(error);
            return null 
        }
    }

    return {
        getById 
    }
}