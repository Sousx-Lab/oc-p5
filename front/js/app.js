import { ProductsCard } from "./pages/HomePage.js";
import { ProductDetails } from "./pages/ProductPage.js";

function HomePage(){
    let items =  document.getElementById('items')
    ProductsCard(items)
}HomePage();

function ProductPage(){
    if(window.location.pathname.includes('product.html')){
        ProductDetails()
    }
}ProductPage();