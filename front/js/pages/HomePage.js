import { jsonFetchOrFlash } from "../functions/api.js";
import {API} from '../conf.js';
import {Card} from '../components/Card.js';
import { Product } from '../entity/product.js';

/**
 * @param {HTMLElement} parentElement
 */
export const ProductsCard = (parentElement) => {
   
    jsonFetchOrFlash(API.PRODUCTS, {method: 'GET'})
    .then(function(data) {
        if(Object.keys(data).length === 0){
            return;
        }
        data.forEach((p) =>{
            parentElement.insertAdjacentHTML('beforeend', Card(Object.assign(Product, p)))
        })
    })
}