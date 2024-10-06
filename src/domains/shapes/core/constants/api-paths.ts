import {EventTypes} from './event-types';

export const ShapesApiPaths = {
    [EventTypes.GET_BY_ID]: "http://localhost/random-url/{id}",
    [EventTypes.UPDATE]: "http://localhost/random-url/{id}"
}