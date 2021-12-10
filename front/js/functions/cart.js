import {Storage} from './localStorage.js'

export const Cart = {
    /**
     * @param {CartItem} obj 
     * @param {string | null} key
    */
    addItem(obj) {
        let currentItems = this.getItems('cart')
        if (currentItems instanceof Array ) {

            for(let e of currentItems){
                
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
                
            }
           
            Storage.set('cart', currentItems)
            return
        }
        Storage.set('cart', [obj])
    },

    /**
     * @param {string} id
     * @param {string} color
     */
    deleteItem(id, color){
        let currentItems = this.getItems('cart')
        if(currentItems instanceof Array && currentItems.length > 0){

            let itemIndex = currentItems.findIndex(item => item.id === id && item.color === color)

            if( itemIndex >= 0){
                let deltedItem = currentItems[itemIndex]
                currentItems.splice(itemIndex, 1)
                if(currentItems.length === 0){
                    Storage.delete('cart');
                    return deltedItem
                }
                Storage.set('cart', currentItems)
                return deltedItem
            };
        }
        return null
    },

    /**
     *@param {string|null} key 
     *@returns {array|null} Array[CatItem]
    */
    getItems(key = 'cart') {
        return Storage.get(key)
    },

    /**
     * Calculate total of quantity items
     * @returns {number} 
    */
    getTotalItemsQuantity(){
        let currentItems = this.getItems('cart') 
        let quantities = 0;
        if(currentItems instanceof Array && currentItems.length > 0){
                for(let e of currentItems)  {
                quantities += e.quantities
            }
            return quantities
        }
        return quantities
    },

    /**
     * @param {string} id 
     * @param {string} color 
     * @param {number} quantity
     * @param {number} totalPrice
     */
    updateItemQuantity(id, color, quantity, totalPrice, price){
        let currentItems = this.getItems('cart')

        if(currentItems instanceof Array && currentItems.length > 0){
            
            let itemIndex = currentItems.findIndex(item => item.id === id && item.color === color)
            if(itemIndex < 0){
                return
            }
            //calculate old product price
            let oldTotalPrice = price * currentItems[itemIndex].quantities
            //subtract the old price from the total price
            totalPrice -= oldTotalPrice

            //updating quantity
            currentItems[itemIndex].quantities = quantity

            //add the new price to the total price
            totalPrice += price * quantity
        
            if(currentItems[itemIndex].quantities <= 0){
                currentItems.splice(itemIndex, 1)
            }
            Storage.set('cart', currentItems)
            return totalPrice
        }
    },
 
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