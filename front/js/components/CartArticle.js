import { Product } from "../entity/product.js"
import { CartItem } from "../functions/cart.js"
/**
 * @param {Product} product
 * @param {CartItem} cart
 */
export const CartArticle = (product = {}, cart) => {

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