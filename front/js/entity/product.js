import { FRONT_LOCATION } from "../conf.js"

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
