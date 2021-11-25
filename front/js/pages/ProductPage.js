import { jsonFetchOrFlash } from "../functions/api.js";
import { API } from "../conf.js";
import {Product} from '../entity/product.js'
/**
 * 
 */
export const ProductDetails = () =>{

    let query = window.location.search
    const searchParams = new URLSearchParams(query);
    
    let id = searchParams.get('id')
    if(!id){
        return
    }
    
    jsonFetchOrFlash(API.PRODUCT(id), {method: 'GET'})
    .then(function(data) {
        Object.assign(Product, data)
        console.log(Product)
    })
}