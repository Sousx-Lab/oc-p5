import { FRONT_LOCATION } from "../conf.js"

/**
 * @typedef Product
 * @property {string} _id
 * @property {string} name
 * @property {string} price
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} altTxt
 * @property {array} colors
 * @property {function} url
 */
export const Product = {
    _id: "",
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    altTxt: "",
    colors: [],
    get url(){
        return FRONT_LOCATION.PRODUCT_URL + this._id

    },
}
