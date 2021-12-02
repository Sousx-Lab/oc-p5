import { Cart, CartItem } from "../functions/cart.js"
import { jsonFetchOrFlash } from "../functions/api.js"
import { API } from "../conf.js";
import { Product } from "../entity/product.js";
import { CartArticle } from "../components/CartArticle.js";

/**
 * 
 * @param {HTMLElement} containerCartItems
 */
export const CartPage = (containerCartItems) => {

     /**@type {array} */
    const cart = Cart.getItems('cart')
    let totalPrice = 0
    cart.map(item => {
        jsonFetchOrFlash(API.PRODUCT(item.id),{
            method: 'GET'
        }).then((product) =>{
            if(Object.keys(product).length === 0){
                return;
            }
            totalPrice += product.price * item.quantities 
            containerCartItems.insertAdjacentHTML('beforeend', CartArticle(product, item))

            document.getElementById('totalQuantity').innerText = Cart.getQuantitiesItems(cart)
            document.getElementById('totalPrice').innerText = totalPrice
        })
        
    })   
}