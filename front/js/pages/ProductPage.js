import { jsonFetchOrFlash } from "../functions/api.js";
import { API } from "../conf.js";
import { Product } from '../entity/product.js'
import { flash } from "../functions/flash.js";

/**
 * define type of targetElems
 * @typedef {object} targetElems
 * @property {HTMLElement} selectedColor
 * @property {HTMLElement} quantity
 * @property {HTMLElement} submitButton
 */

/**
 * handle product details in product page
 */
export const ProductDetails = () => {

    let query = window.location.search
    const searchParams = new URLSearchParams(query);

    let id = searchParams.get('id')
    if (!id) {
        return
    }

    jsonFetchOrFlash(API.PRODUCT(id), {
            method: 'GET'
        })
        .then(function (data) {
            Object.assign(Product, data)

            /**@type {targetElems} */
            const awaitSubmit = insertProduct(Product)
            handleSubmit(awaitSubmit)
        })

}

/**
 * insert infos Product in DOM
 * @param {Product} product
 * @return {object} targetElems
 */
function insertProduct(product) {

    /**Insert Image */
    let divImg = document.getElementsByClassName('item__img')[0]
    let img = document.createElement('img')
    img.src = product.imageUrl
    img.alt = product.altTxt
    divImg.append(img)

    /** Insert product title */
    document.getElementById('title').innerText = product.name

    /** Insert product price */
    document.getElementById('price').innerText = product.price

    /** Insert product description */
    document.getElementById('description').innerText = product.description

    /** Insert product colors */
    const selectColor = document.getElementById('colors')
    Product.colors.forEach((color) => {
        let option = document.createElement("option");
        option.value = color
        option.text = color
        selectColor.add(option, null)
    })

    /**@type {targetElems}*/
    const targetElems = {
        selectedColor: selectColor,
        quantity: document.getElementById('quantity'),
        submitButton: document.getElementById('addToCart'),
    }

    return targetElems
}

/**
 * @param {targetElems} target 
 */
function handleSubmit(target) {

    target.submitButton.addEventListener('click', function (e) {
        e.preventDefault();
        let selectedColorValue = target.selectedColor.options[target.selectedColor.selectedIndex].value
        let quantity = parseInt(target.quantity.value, 10)

        if (!selectedColorValue) {
            flash.error('Veuillez sélectionner une couleur !')
            document.querySelector("label[for='color-select']").style.color = "red"
        }
        if (quantity <= 0 || quantity > 100) {
            target.quantity.value = "1"
        }

    })

}

