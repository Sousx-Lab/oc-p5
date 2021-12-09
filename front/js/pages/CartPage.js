import { Cart, CartItem } from "../functions/cart.js"
import { jsonFetchOrFlash } from "../functions/api.js"
import { API } from "../conf.js";
import { Product } from "../entity/product.js";
import { Flash } from "../functions/flash.js";
import { Validator } from "../functions/validator.js";


let totalPrice = 0
let fetchedProduct = []
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
            handleSubmit()
        })

}

/**
 * Await fetching each product from Api and append it to DOM
 * @param {[CartItem]} cart 
 * @param {HTMLElement} containerCartItems 
 * @returns {Promise}
 */
async function fetchCartItems(cart, containerCartItems) {

    try {
        await Promise.all(cart.map(async (item) => {
       
            await jsonFetchOrFlash(API.PRODUCT(item.id), {
                    method: 'GET'
                    })
                    .then((product) => {
                        if (Object.keys(product).length === 0) {
                            return
                        }
                        totalPrice += product.price * item.quantities
                        if(!fetchedProduct.find(e => e.id === item.id && e.color === item.color)){
                            fetchedProduct = [...fetchedProduct, {id: item.id, color: item.color, price: product.price}]
                        }
                        /** Insert product in DOM */
                        containerCartItems.insertAdjacentHTML('beforeend', CartArticle(product, item))
                        /** Insert Total item quantity */
                        document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                        /** Insert Total price */
                        document.getElementById('totalPrice').innerText = totalPrice
    
                    })
            }
    
        ))
    } catch (error) {
        Flash.error(null, "Une erreur s'est produite lors du la récupération des produits")
    }
   
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

            /** deleted product from cart */
            let deletedItem =  Cart.deleteItem(article.dataset.id, article.dataset.color)
            
            if (deletedItem) {
                /** find product price */
                let price = fetchedProduct.find(e => e.id === article.dataset.id && e.color === article.dataset.color)
                if(!price){
                    return
                }
                /** update total price */
                totalPrice -= price.price * deletedItem.quantities
                article.remove()
                /** find & update fetchedProduct array */
                let productIndex = fetchedProduct.findIndex(e => e.id === article.dataset.id && e.color === article.dataset.color)
                fetchedProduct.splice(productIndex,1)
                /** update total price & total quantity */
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
                    let price = fetchedProduct.find(e => e.id === article.dataset.id && e.color === article.dataset.color)

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
 * Handle submit form order
 */
function handleSubmit(){
    let form = document.querySelector('form')
        form.addEventListener('submit', function(e){
            e.preventDefault()
            let formData = new FormData(form)
            let formObj = {};
            for (let pair of formData.entries()) {
                formObj[pair[0]] = pair[1]
            }
            if(!validateForm(formObj)){
                return false
            }
            
            console.log('submited')
        })
}

/**
 * 
 * @param {object} formObj
 * @returns {boolean}
 */
function validateForm(formObj){
    let validate = true

    if(false === Validator.lettres(formObj.firstName)){
        document.getElementById('firstNameErrorMsg').innerText =
        `Le Prénom ${formObj.firstName} n'est pas valide !`;
        validate = false
    }else{
        document.getElementById('firstNameErrorMsg').innerText = ''
    }

    if(false === Validator.lettres(formObj.lastName)){
        document.getElementById('lastNameErrorMsg').innerText = 
        `Le Nom ${formObj.lastName} n'est pas valide !`
        validate = false
    }else{
        document.getElementById('lastNameErrorMsg').innerText = ''
    }

    if(false === Validator.notBlank(formObj.address)){
        document.getElementById('addressErrorMsg').innerText = 
        `L'adresse ne doit pas étre vide !`
        validate = false
    }else{
        document.getElementById('addressErrorMsg').innerText = ''
    }

    if(false === Validator.notBlank(formObj.city)){
        document.getElementById('cityErrorMsg').innerText = 
        `La ville ne doit pas étre vide !`
        validate= false
    }else{
        document.getElementById('cityErrorMsg').innerText = ''
    }

    if(false === Validator.email(formObj.email)){
        document.getElementById('emailErrorMsg').innerText = 
        `L'adresse email ${formObj.email} n'est pas valide !`;
        validate = false
    }else{
        document.getElementById('emailErrorMsg').innerText = ''
    }
    
    return validate
}

/**
 * HTML article elements with props
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