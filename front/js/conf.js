/**
 * API Endpoint
 */
export const API = {
    
    BASE_URL: "http://localhost:3000/api",

    /**
     * @returns {string}
     */
    get PRODUCTS (){
        return this.BASE_URL + "/products"
    },
    
    /**
     * @param {string} id
     * @return {string}
     */
    PRODUCT(id){
        return this.BASE_URL + "/products" +'/'+  id
    },
    /**
     * @returns {string}
     */
    get ORDER(){
        return this.PRODUCTS + '/order'
    }
}

/** Front route */
export const FRONT_LOCATION = {

    BASE_ROUTE : './',

    /**
     * @param {string|number} id
     *@returns {string}
     */
    PRODUCT_ROUTE(id){
        return this.BASE_ROUTE + `product.html?id=${id}`
    },

    /**
     * @param {string} orderId
     * @returns {string}
     */
    ORDER_CONFIRMATION_ROUTE(orderId){
        return this.BASE_ROUTE + `confirmation.html?orderId=${orderId}`
    }
}
