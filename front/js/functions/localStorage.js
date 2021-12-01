export const Storage = {
    /**
     * @param {string} key 
     * @returns {array | null}
    */
    get(key){
        let itmes = JSON.parse(window.localStorage.getItem(key))
        return itmes;
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