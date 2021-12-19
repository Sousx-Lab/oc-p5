
export class Validator  {
    
    constructor(){
        this.isValide = true
        this.xss = new RegExp(/^<script[\s\S]*?>[\s\S]*?<\/script>/)
    }
    /**
     * @param {string} value 
     * @returns {string}
     */
    email(value){
        const mailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

        if(false === mailRegex.test(value)){
            this.isValide = false
            return `L'email "${value}" n'est pas un email valide !`
        }
        return ''
    }

    /**
     * @param {string} value
     * @param {string} valueName
     * @returns 
     */
    lettres(value, valueName){
        const lettersRegex = new RegExp(/^[A-Za-z]+$/)

        if(false === lettersRegex.test(value)){
            this.isValide = false
            return `${valueName} "${value}" ne doit contenir que des lettres !`
        }
        return ''
        
    }

    /**
     * @param {string} value
     * @param {string} valueName 
     * @returns 
     */
    notBlank(value, valueName){
        const notBlankRegex = new RegExp(/([^\s])/)
        
        if(false === notBlankRegex.test(value) || true === this.xss.test(value)){
            this.isValide = false
            return `${valueName} ne doit pas étre vide !`
        }
        return ''
    }
    /**
     * return true if all input form is valide
     * @returns {boolean}
     */
    validate(){
        return this.isValide
    }
}