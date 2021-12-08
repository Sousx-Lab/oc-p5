import { Cart, CartItem } from "../functions/cart.js"
import { jsonFetchOrFlash } from "../functions/api.js"
import { API } from "../conf.js";
import { Product } from "../entity/product.js";
import { Flash } from "../functions/flash.js";


let totalPrice = 0
let productPrice = []
/**
 * @param {HTMLElement} containerCartItems
 */
export const CartPage = (containerCartItems) => {

    /**@type {array} */
    const cartItems = Cart.getItems()
    if (null === cartItems) {
        document.querySelector('h1').innerText += " est vide"
        return
    }
    fetchCartItems(cartItems, containerCartItems)
        .then(() => {
            handleDeleteItem()
            handleQuantityItem()
        })

}

/**
 * Await fetching each product from Api and append it to DOM
 * @param {[CartItem]} cart 
 * @param {HTMLElement} containerCartItems 
 * @returns {Promise}
 */
async function fetchCartItems(cart, containerCartItems) {

    return await Promise.all(cart.map(async (item) => {

         await jsonFetchOrFlash(API.PRODUCT(item.id), {
                method: 'GET'
                })
                .then((product) => {
                    if (Object.keys(product).length === 0) {
                        return
                    }
                    totalPrice += product.price * item.quantities
                    if(!productPrice.find(e => e.id === item.id && e.color === item.color)){
                        productPrice = [...productPrice, {id: item.id, color: item.color, price: product.price}]
                    }
                    containerCartItems.insertAdjacentHTML('beforeend', CartArticle(product, item))

                    document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                    document.getElementById('totalPrice').innerText = totalPrice

                })
        }

    ))
}

/**
 * Delete item to cart and update total item & total price
 * @returns {void}
 */
function handleDeleteItem() {
    let deleteButtons = document.querySelectorAll('.deleteItem')
    deleteButtons.forEach(button => {
        button.addEventListener('click', function (el) {
            let article = el.target.closest('article')
            let deletedItem =  Cart.deleteItem(article.dataset.id, article.dataset.color)
            if (deletedItem) {
                let price =  productPrice.find(e => e.id === article.dataset.id && e.color === article.dataset.color)
                if(!price){
                    return
                }
                totalPrice -= price.price * deletedItem.quantities
                article.remove()
                let productIndex = productPrice.findIndex(e => e.id === article.dataset.id && e.color === article.dataset.color)
                productPrice.splice(productIndex,1)
                document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                document.getElementById('totalPrice').innerText = totalPrice = totalPrice
                return;
            }
            Flash.error(null, "Le produit que vous essayez de supprimer n'existe pas!")
            return
        })
    })
}

/**
 * Handle item quantity and update total price & quantity
 * @returns {void}
 */
function handleQuantityItem(){

    let quantityInput = document.getElementsByName('itemQuantity')
        quantityInput.forEach(input => {
            input.addEventListener('change', function(el){
                let quantity = parseInt(el.target.value,10)
                    if(quantity instanceof Number && quantity <= 0){
                        Flash.info(null, "Quantité insuffisante!")
                        return
                    }
                    let article = el.target.closest('article')
                    let price = productPrice.find(e => e.id === article.dataset.id && e.color === article.dataset.color)

                    totalPrice = Cart.updateItemQuantity(
                        article.dataset.id, 
                        article.dataset.color, 
                        quantity, 
                        totalPrice, 
                        price.price
                    )
                    document.getElementById('totalPrice').innerText = totalPrice
                    
                    document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                    
                    
            })
        })
}

/**
 * @param {Product} product
 * @param {CartItem} cart
 * @returns {string}
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