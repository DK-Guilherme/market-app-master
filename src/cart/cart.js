const cartList = document.getElementById('product-cart');
const API_URL = 'http://localhost:3000';

let cart = [];

fetch(`${API_URL}/cart`)
.then(response => response.json())
.then(json => getListOfProductsOnCart(json))

window.onload = totalValue;

// GET ALL
function getListOfProductsOnCart(productsFromServer) {
  productsFromServer.forEach(product => {
    cart.push(product);
    const template = `
      <div class="products-list__card">
      <img src="../images/cartimg.jpg" width="150px" alt="Comprar">
      <span><b>Nome:</b> ${product.name}</span>
      <span><b>Quantidade:</b> ${product.quantity}</span>
      <span><b>Preço:</b> ${product.totalPrice}</span>
      <button class="product-cart__add" onclick="addQuantity(${product.id})" onclick="totalValue(${product.id})">+</button>
      <button class="product-cart__delete" onclick="removeQuantity(${product.id})">-</button>
      <button onclick="deleteCartItem(${product.id})">Delete</button>
      <hr>
      </div>
    `;

    cartList.innerHTML += template;
  });
}

function addQuantity(id){
  const productFromCart = cart.filter(product => product.id === id)[0];
  const productOnCartArray = cart.filter(productOnCart => 
    productOnCart.name === productFromCart.name);
    // POST

  let getPrice = productFromCart.totalPrice;

  const productToUpdate = {
    name: productFromCart.name,
    quantity: productOnCartArray[0].quantity + 1,
    totalPrice: totalValue(getPrice, productOnCartArray[0].quantity)
  }

  fetch(`${API_URL}/cart/${productOnCartArray[0].id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productToUpdate)
  });
}

function removeQuantity(id){
  productFromCart = cart.filter(product => product.id === id)[0];
  productOnCartArray = cart.filter(productOnCart => 
    productOnCart.name === productFromCart.name);
    // POST

  let getPrice = productFromCart.totalPrice / 2;
  const productToUpdateRemove = {
    name: productFromCart.name,
    quantity: productOnCartArray[0].quantity - 1,
    totalPrice: totalValue(getPrice, productOnCartArray[0].quantity) 
  }

  fetch(`${API_URL}/cart/${productOnCartArray[0].id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productToUpdateRemove)
  });
}

function deleteCartItem(id){
  fetch(`${API_URL}/cart/${id}`, {
    method: 'DELETE'
  })
}

function totalValue(getPrice, quantity){
 let qtd = getPrice * quantity;
 return parseInt(qtd, 10);
}

let btnBuy = document.getElementById('buy');

btnBuy.addEventListener('click', function buyCard(){
  fetch(`${API_URL}/cart`)
  .then(response  => response.json())
  .then(json => buyItAll(json))
})

function buyItAll(products){
  products.forEach(product => {
    fetch(`${API_URL}/cart/${product.id}` ,{
      method: 'DELETE'
    })
  });
};