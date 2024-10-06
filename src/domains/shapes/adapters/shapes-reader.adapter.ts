import { ShapeList } from "../__mocks__/shapes";
// import { ShapesApiPaths } from "../core/constants/api-paths";
import { ShapeEntity } from "../core/entities/shape.entity";
import { ShapesDrivenReaderPort } from "../ports/driven/shapes-driven-reader.port";


export default function ShapeReaderAdapter(): ShapesDrivenReaderPort {
    /* const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json"); */

    async function getById(id:string): Promise<ShapeEntity[] | null> {
        try {
            
            if (!id) {
                throw new Error("No Id provided");
            };

            /* If API existed  */
            /*  const response = await fetch(ShapesApiPaths.getById.replace('{id}',id),  {
                method: "GET",
                headers: myHeaders
                })
                
                if (!response) {
                    return null
            }

            return response.json(); */



            /* Simulate response from back-end by local storage or promise*/

            try {
                const value = localStorage.getItem(id);
                return JSON.parse(value);
            } catch (error) {
               const response = await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            //@ts-ignore
                            ok: true, 
                            status: 200,
                            json: () => Promise.resolve(ShapeList)
                        });
                    }, 300);
                });
                //@ts-ignore
                return response.json()
            }
            
        } catch (error) {
            console.log(error)
            return null
        }
    }

    return {
        getById
    }
    
}