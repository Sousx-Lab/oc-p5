import { jsonFetchOrFlash } from "../functions/api.js";
import {API} from '../conf.js';
import { Product } from '../entity/product.js';

/**
 * fetch all product and append it in DOM
 * @param {HTMLElement} parentElement
 */
export const ProductsCard = (parentElement) => {
   
    jsonFetchOrFlash(API.PRODUCTS, 
        {method: 'GET'
    })
    .then(function(data) {
        if(Object.keys(data).length === 0){
            return;
        }
        for(let p of data){
            parentElement.insertAdjacentHTML('beforeend', Card(Object.assign(Product, p)))
        }
    })

    /**
     * HTML acrticle element with props
     * @param {Product} product 
     * @returns {string}
     */
    const Card = (product) => {
        return `<a href="${product.url}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt} ">
            <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
            </article>
        </a>`
    
    }
}