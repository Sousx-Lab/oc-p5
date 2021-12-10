import { Flash } from "../functions/flash.js";

/**
 * insert order id in DOM 
 * @param {HTMLElement} orderIdElement 
 * @returns {void}
 */
export const ConfirmationPage = (orderIdElement) =>{

    const searchParams = new URLSearchParams(window.location.search);

    let orderId = searchParams.get('orderId')
    if(!orderId){
        Flash.warning(null, "Aucune commande n'est enregistrée avec cet ID")
        return
    }

    orderIdElement.innerText = orderId
    return
}