import { ProductsCard } from "./pages/HomePage.js";
import { ProductDetails } from "./pages/ProductPage.js";

function App(){
    
    let items =  document.getElementById('items')
    if(items instanceof HTMLElement){
        ProductsCard(items)
        return;
    }
    
    if(window.location.pathname.includes('product.html')){
        ProductDetails();
        return
    }
}App()