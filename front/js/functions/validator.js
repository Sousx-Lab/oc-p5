
export const Validator = {
    
    /**
     * @param {string} value 
     * @returns 
     */
    email(value){
        const mailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

        return mailRegex.test(value) ?? false
    },

    /**
     * @param {string} value 
     * @returns 
     */
    lettres(value){
        const lettersRegex = new RegExp(/^[A-Za-z]+$/)

        return lettersRegex.test(value) ?? false
        
    },

    /**
     * @param {string} value 
     * @returns 
     */
    notBlank(value){
        const notBlankRegex = new RegExp(/([^\s])/)

        return notBlankRegex.test(value) ?? false
    }
}