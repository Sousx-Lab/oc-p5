export const Storage = {
    /**
     * @param {string} key 
     * @returns {array | null}
    */
    get(key){
        let items = JSON.parse(window.localStorage.getItem(key))
        return items;
    },

    /**
     * @param {string} key 
     * @param {array} item
     * @returns {void}
    */
    set(key, item){
        window.localStorage.setItem(key, JSON.stringify(item))
    },
    
    /**
     * @param {string} key
     * @returns {void}
    */
    delete(key){
        window.localStorage.removeItem(key)
    }
}