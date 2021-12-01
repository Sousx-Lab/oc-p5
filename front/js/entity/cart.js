import {Storage} from '../functions/localStorage.js'

export const Cart = {
    /**@param {CartItem} obj */
    addItem(obj) {
        let currentItems = this.getAll('cart')
        if (currentItems instanceof Array) {
            currentItems.forEach(e =>{
                
                if (e.id === obj.id && e.color !== obj.color && 
                    currentItems.find(({ color }) => color === obj.color) === undefined) {                
                    currentItems = [...currentItems, obj]
                }

                if(e.id === obj.id && e.color === obj.color){
                   
                    e.quantities += obj.quantities
                }
                
                if(e.id !== obj.id && currentItems.find(({ id }) => id === obj.id) === undefined){
                    currentItems = [...currentItems, obj]
                 }
                
            })
           
            Storage.set('cart', currentItems)
            return
        }
        Storage.set('cart', [obj])
    },
    /**
     *@param {string} key 
     *@returns {array | null}
    */
    getAll(key) {
        return Storage.get(key)
    }
}

/**
 * @typedef {object} CartItem
 * @property {number} id
 * @property {string} quantities
 * @property {string} color
 */

/**
 * @type {CartItem} CartItem
 */
export const CartItem = {
    id: 0,
    quantities: '',
    color: ''
}