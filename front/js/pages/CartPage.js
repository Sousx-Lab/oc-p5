import { Cart, CartItem } from "../functions/cart.js"
import { jsonFetchOrFlash } from "../functions/api.js"
import { API } from "../conf.js";
import { Product } from "../entity/product.js";

/**
 * @param {HTMLElement} containerCartItems
 */
export const CartPage = (containerCartItems) => {

     /**@type {array} */
    const cart = Cart.getItems('cart')
    
    fetchCartItems(cart, containerCartItems)
        .then((deleteItems) => {
        deleteItems.forEach(item => {
            item.addEventListener('click', function(el){
                let article = el.target.closest('article')
                //* gerer la supprission de l'item dans le localStorage
                console.log(article.dataset.id)
            })
        })
    })
   
}

/**
 * @param {[CartItem]} cart 
 * @param {HTMLElement} containerCartItems 
 * @returns {NodeList | null}
 */
async function fetchCartItems(cart, containerCartItems){

    let totalPrice = 0
    
    return await Promise.all(cart.map(async(item) => {
        
        await jsonFetchOrFlash(API.PRODUCT(item.id), {method: 'GET'})
        .then((product) =>{
            if(Object.keys(product).length === 0){
                return
            }

                totalPrice += product.price * item.quantities 
                containerCartItems.insertAdjacentHTML('beforeend', CartArticle(product, item))

                document.getElementById('totalQuantity').innerText = Cart.getQuantitiesItems(cart)
                document.getElementById('totalPrice').innerText = totalPrice
                
            })
        }
        
    )).then(() => {
        return document.querySelectorAll('.deleteItem') ?
        document.querySelectorAll('.deleteItem') : null
    })
}

/**
 * @param {Product} product
 * @param {CartItem} cart
 */
const CartArticle = (product, cart) => {

    return `<article class="cart__item" data-id="${cart.id}" data-color="${cart.color}">
            <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
              <p>${cart.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart.quantities}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
}
// console.log(document.querySelector(`[data-id="${item.id}"]`))
// [deleteItems].forEach(e => {console.log("lol")})
// document.querySelectorAll("[data-foo]")
// document.querySelectorAll("[data-foo]")