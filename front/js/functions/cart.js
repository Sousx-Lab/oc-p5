import {Storage} from './localStorage.js'

export const Cart = {
    /**
     * @param {CartItem} obj 
     * @param {string | null} key
    */
    addItem(key = 'cart', obj) {
        let currentItems = this.getItems(key)
        if (currentItems instanceof Array) {
            currentItems.map(e =>{
                
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
           
            Storage.set(key, currentItems)
            return
        }
        Storage.set(key, [obj])
    },

    /**
     *@param {string} key 
     *@returns {array|null} Array[CatItem]
    */
    getItems(key = 'cart') {
        return Storage.get(key)
    },

    /**
     * @param {[CartItem]} items 
     * @returns {number} 
    */
    getQuantitiesItems(items){
        let quantities = 0
        if(items instanceof Array && items.length > 0){
            let quantities = 0;
                items.map(e => {
                quantities += e.quantities
            })
            return quantities
        }
        
    },
    
    /**
     * 
     * @param {string} key 
     * @param {string} id 
     */
    deleteItemById(key = 'cart', id){
        let currentItems = this.getItems(key)
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