import { jsonFetchOrFlash } from "../functions/api.js";
import {API} from '../conf.js';
import {Card} from '../components/Card.js';
import { Product } from '../entity/product.js';

/**
 * @param {HTMLElement} items
 */
export const ProductsCard = (items) => {
   
    jsonFetchOrFlash(API.PRODUCTS, {method: 'GET'})
    .then(function(data) {
        if(!data){
            return;
        }
        data.forEach((p) =>{
            items.insertAdjacentHTML('beforeend', Card(Object.assign(Product, p)))
        })
    })
}