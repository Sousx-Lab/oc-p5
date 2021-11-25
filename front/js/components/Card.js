/**
 * 
 * @param {object} product 
 * @return {String}
 */
export const Card = (product = {}) => {

    return `<a href="${product.url}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt} ">
        <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
        </article>
    </a>`

}