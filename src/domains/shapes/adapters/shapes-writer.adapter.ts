import { ShapeDTO } from "../core/dtos/shape.dto";
import { ShapesDrivenWriterPort } from "../ports/driven/shapes-driven-writer.port";

export default function ShapeWriterAdapter(): ShapesDrivenWriterPort {
    /* const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json"); */

    async function update(id:string, dto: ShapeDTO[]): Promise<void> {
        try {
            if (Object.values(dto).length == 0 && !id) {
                throw new Error("Invalid parameters");
            };
            if (Object.values(dto).length == 0) {
                throw new Error("No valid shap data provided");
            };

            /* If API existed  */
            /*  const response = await fetch(ShapesApiPaths.update.replace('{id}',id),  {
                method: "POST",
                headers: myHeaders
                })
                
                if (!response) {
                    return null
            }

            return response.json(); */


            //TODO: Add logic to save data in local storage to simlulate back-end
            
        } catch (error) {
            console.log(error, id, dto)
            return
        }
        
    }

    return {
        update
    }
    
}