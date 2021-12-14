import { Cart, CartItem } from "../functions/cart.js"
import { jsonFetchOrFlash } from "../functions/api.js"
import { API, FRONT_LOCATION } from "../conf.js";
import { Flash } from "../functions/flash.js";
import { Validator } from "../functions/validator.js";


let totalPrice = 0

let fetchedProduct = []

/**
 * Main cart page function 
 * @param {HTMLElement} containerCartItems
 */
export const CartPage = (containerCartItems) => {

    /**@type {array} */
    const cartItems = Cart.getItems()
    if (null === cartItems) {
        document.querySelector('h1').innerText += " est vide"
        document.getElementById('order').disabled = true
        return
    }

    fetchCartItems(cartItems, containerCartItems)
        .then(() => {
            /** sort product by id */
            fetchedProduct.sort(function(a, b){
                if ( a.id < b.id ){
                    return -1;
                  }
                  if ( a.id > b.id ){
                    return 1;
                  }
                  return 0;
            })
            
            for(let product of fetchedProduct){
                /** Insert product in DOM */
                containerCartItems.insertAdjacentHTML('beforeend', CartArticle(product))
                /** Insert Total item quantity */
                document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                /** Insert Total price */
                document.getElementById('totalPrice').innerText = totalPrice
            }
        }).then(()=> {
            handleDeleteItem()
            handleQuantityItem()
            handleSubmit()
        })

}

/**
 * Await fetching each product in cart from Api
 * @param {[CartItem]} cart 
 * @param {HTMLElement} containerCartItems 
 * @returns {Promise}
 */
async function fetchCartItems(cart) {
    
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
                        /**Search in fetched product array and append it if not exist */
                        if (!fetchedProduct.find(e => e.id === item.id && e.color === item.color)) {
                            fetchedProduct = [...fetchedProduct, {
                                id: product._id,
                                name: product.name,
                                color: item.color,
                                price: product.price,
                                imageUrl: product.imageUrl,
                                quantities: item.quantities,
                                altTxt: product.altTxt
                            }]
                        }

                    })
            }

        ))
    } catch (error) {
        Flash.error(null, "Une erreur s'est produite lors de la récupération des produits")
    }
   
}

/**
 * Delete item to cart and update total item & total price
 * @returns {void}
 */
function handleDeleteItem() {
    let deleteButtons = document.querySelectorAll('.deleteItem')
    for(let button of deleteButtons) {
        button.addEventListener('click', function (el) {
            let article = el.target.closest('article')

            /** deleted product from cart */
            let deletedItem =  Cart.deleteItem(article.dataset.id, article.dataset.color)
            
            if (null !== deletedItem) {
                /** find product price */
                let deletedItemPrice = fetchedProduct.find(e => e.id === deletedItem.id && e.color === deletedItem.color)
                if(!deletedItemPrice){
                    return
                }
                /** update total price */
                totalPrice -= deletedItemPrice.price * deletedItem.quantities
                article.remove()
                /** find & update fetchedProduct array */
                let deletedItemIndex = fetchedProduct.findIndex(e => e.id === deletedItem.id && e.color === deletedItem.color)
                fetchedProduct.splice(deletedItemIndex, 1)
                /** update total price & total quantity */
                document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                document.getElementById('totalPrice').innerText = totalPrice = totalPrice
                return;
            }
            Flash.error(null, "Le produit que vous essayez de supprimer n'existe pas!")
            return
        })
    }
}

/**
 * Handle item quantity and update total item & total price
 * @returns {void}
 */
function handleQuantityItem(){

    let quantityInput = document.getElementsByName('itemQuantity')
        for(let input of quantityInput) {
            input.addEventListener('change', function(el){
                let quantity = parseInt(el.target.value, 10)
                    if(!quantity instanceof Number || quantity <= 0){
                        Flash.info(null, "Quantité insuffisante!")
                        return
                    }
                    let article = el.target.closest('article')
                    let product = fetchedProduct.find(e => e.id === article.dataset.id && e.color === article.dataset.color)
                    if(!product){
                        Flash.error(null, "Le produit n'e")
                        return;
                    }
                    totalPrice = Cart.updateItemQuantity(
                        product.id, 
                        product.color, 
                        quantity, 
                        totalPrice, 
                        product.price
                    )
                    document.getElementById('totalPrice').innerText = totalPrice
                    
                    document.getElementById('totalQuantity').innerText = Cart.getTotalItemsQuantity()
                    
                    
            })
        }
}
/**
 * Handle submit order form
 */
function handleSubmit(){
    let form = document.querySelector('form')
        form.addEventListener('submit', function(e){
            e.preventDefault()

            /**@type {object} formData */
            let formData = {contact:'', products: []}
            formData.contact =  Object.fromEntries(new FormData(form))

            if(!validateForm(formData.contact)){
                return false
            }
            
            /** insert cart product id in products formdata  */
            for(let cartItems of Cart.getItems()) {
                formData.products = [...formData.products, cartItems.id]
            }
            
            jsonFetchOrFlash(API.ORDER, {
                method: 'POST',
                body: formData
            }).then(resp =>{
                Cart.deleteAll()
                window.location.assign(FRONT_LOCATION.ORDER_CONFIRMATION_ROUTE(resp.orderId))
            })
        })
}

/**
 * handle validation form
 * @param {object} formData
 * @returns {boolean}
 */
function validateForm(formData){
    
    const validator = new Validator()

    document.getElementById('firstNameErrorMsg').innerText = validator.lettres(formData.firstName, 'Le Prénom')

    document.getElementById('lastNameErrorMsg').innerText = validator.lettres(formData.lastName, 'Le Nom')
   
    document.getElementById('addressErrorMsg').innerText = validator.notBlank(formData.address, "L'adresse")

    document.getElementById('cityErrorMsg').innerText = validator.notBlank(formData.city, 'La ville')

    document.getElementById('emailErrorMsg').innerText = validator.email(formData.email)
    
    return validator.validate()

}

/**
 * HTML article elements
 * @param {object} product
 * @returns {string}
 */
const CartArticle = (product) => {

    return `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${product.name}</h2>
              <p>${product.color}</p>
          <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantities}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
}