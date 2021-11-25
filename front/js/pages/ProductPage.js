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
         insertHtmlProduct(Product)
    })

   
}

/**
 * Inject HTML Product in DOM
 * @param {object} product
 */
function insertHtmlProduct(product){{

    /**Insert Image */
    let divImg = document.getElementsByClassName('item__img')[0]
    let img = document.createElement('img')
    img.src = Product.imageUrl
    img.alt = Product.altTxt
    divImg.append(img)

    /**Insert title */
    document.getElementById('title').innerText = Product.name

    /** Insert Price */
    document.getElementById('price').innerText = Product.price

    document.getElementById('description').innerText = Product.description

    const selectColor = document.getElementById('colors')
    Product.colors.forEach((color) => {
        let option = document.createElement("option");
        option.value = color
        option.text = color
        selectColor.add(option, null)
    })
}}