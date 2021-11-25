/**
 * API Endpoint
 */
export const API = {
    BASE_URL: "http://localhost:3000/api",
    get PRODUCTS (){
        return this.BASE_URL + "/products"
    },
    /**
     * @param {string} id
     * @return {string}
     */
    PRODUCT(id){
        return this.BASE_URL + "/products" +'/'+  id
    }
}

/** Front URL */
export const FRONT_LOCATION = {
    BASE_URL : './',
    get PRODUCT_URL(){
        return this.BASE_URL + "product.html?id="
    }
}
