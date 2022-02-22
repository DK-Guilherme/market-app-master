const listSection = document.getElementById('product-section');
const API_URL = 'http://localhost:3000';

let products = [];
let cart = [];

fetch(`${API_URL}/products`)
  .then(response => response.json())
  .then(json => getListOfProducts(json));

fetch(`${API_URL}/cart`)
  .then(response => response.json())
  .then(json => addProductsToCartList(json));

function addProductsToCartList(products) {
  cart = products;
}

// GET ALL
function getListOfProducts(productsFromServer) {
  productsFromServer.forEach(product => {
    products.push(product);
    const template = `
      <div class="products-list__card">
      <img src="images/cartimg.jpg" width="150px" alt="Comprar">
      <span>Nome: ${product.name}</span>
      <span>Preço: ${product.price}</span>
      <span>Preço com Desconto:</b> ${getDiscount(product.discount, product.price)}</span>
      <input type="number" id="add-quantity-${product.id}" placeholder="quantidade">
      <button class="product-cart__add" onclick="addProductToCart(${product.id})"><i class="fas fa-shopping-cart"></i> Adicionar ao carrinho</button>
      <button class="product-cart__delete" onclick="deleteProduct(${product.id})">Deletar</button>
      <hr>
      </div>
    `;

    listSection.innerHTML += template;
  });
}

const getTodayDate = () => {
  let date = new Date();
  const day = date.getDay().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
};

function addProduct() {
  const name = document.getElementById('add-name').value;
  const price = document.getElementById('add-price').value;
  const disc = document.getElementById('add-disc').value;

  const product = {
    name: name,
    price: parseInt(price, 10),
    discount: parseInt(disc, 10),
    date: getTodayDate()
  }

  fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  })
}

function getDiscount(discount, price) {
  if (discount !== 0 && discount !== null) {
    return price - (price * (discount / 100));
  }
  return price;
}

function addProductToCart(id) {
  // Extrai o produto do array local a partir do ID que a função recebe
  debugger;
  const productFromArray = products.filter(product => product.id === id)[0];
  const productOnCartList = cart.filter(productOnCart =>
    productOnCart.name === productFromArray.name);
  const isProductOnCart = productOnCartList.length !== 0 ? true : false;

  const quantityInput = document.getElementById(`add-quantity-${id}`);
  const quantity = parseInt(quantityInput.value.length > 0 ? quantityInput.value : 1);
  if (isProductOnCart) {
    // POST

    const productToUpdate = {
      name: productFromArray.name,
      quantity: productOnCartList[0].quantity + quantity,
      totalPrice: getDiscount(productFromArray.discount, productFromArray.price)
    }

    fetch(`${API_URL}/cart/${productOnCartList[0].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productToUpdate)
    });

  } else {
    // POST
    const productToSave = {
      name: productFromArray.name,
      quantity: quantity,
      totalPrice: getDiscount(productFromArray.discount, productFromArray.price)
    }

    fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productToSave)
    });
  }
}

function deleteProduct(id) {
  fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  })
  console.log(id);
}

