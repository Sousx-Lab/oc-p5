import { ProductsCard } from "./pages/HomePage.js";
import { ProductDetails } from "./pages/ProductPage.js";
import { CartPage } from "./pages/CartPage.js";
function App(){
    
    /** Home Page */
    let parentCardsElement = document.getElementById('items')
    if(parentCardsElement instanceof HTMLElement){
        ProductsCard(parentCardsElement);
        return;
    }
    
    /** Product Page */
    if(window.location.pathname.includes('product.html')){
        ProductDetails();
        return;
    }

    /** Cart Page */
    let parentCartItemsElement = document.getElementById('cart__items')
    if(parentCartItemsElement instanceof HTMLElement){
        CartPage(parentCartItemsElement);
        return;
    }

}App()