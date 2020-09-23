document
  .querySelector("#burgersBtn")
  .addEventListener("click", () => load("Burguers"));
document
  .querySelector("#tacosBtn")
  .addEventListener("click", () => load("Tacos"));
document
  .querySelector("#saladsBtn")
  .addEventListener("click", () => load("Salads"));
document
  .querySelector("#dessertsBtn")
  .addEventListener("click", () => load("Desserts"));
document
  .querySelector("#dsBtn")
  .addEventListener("click", () => load("Drinks and Sides"));
document
  .querySelector("#btnShoppingCart")
  .addEventListener("click", () => showCart());

let productsContent = document.querySelector("#cards-content");
let cartCounter = document.querySelector("#itemsCounter");
let mainTitle = document.querySelector("#mainTitle");
let footButtons = document.querySelector("#footerButtons");
let info;
let shoppingCart = [];
let total = 0;
let totalProductos = 0;

/**
 * Method that  loads info
 * @param {} category 
 */
function load(category) {
  fetch(
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"
  ).then((resp) => {
    resp.json().then((data) => {
      info = data;
      showCont(category);
    });
  });
}

/**
 * Method that show shopping cart
 */

function showCart() {
  let tableHead =
    '<table class="table table-striped"><thead><tr><th scope="col">Item</th><th scope="col">Qty.</th><th scope="col">Description</th><th scope="col">Unit Price</th><th scope="col">Amount</th></tr></thead><tbody>';

  shoppingCart.forEach((item,index) => {
    let row =
      `<tr><td>${index+1}</td><td>${item.qty}</td><td>${item.name}</td><td>${item.price}</td><td>${item.price * item.qty}</td></tr>`;
    tableHead += row;
  });
  tableHead += `</tbody></table><h5 class="px-4 font-weight-bold">Total: $ ${total}</h5>`;
  footButtons.innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#sureModal">
  Cancel
</button>
<button
  type="submit"
  class="btn btn-outline-dark"
  onclick="printOrder()"
>
  Confirm Order
</button>`;

  productsContent.innerHTML = tableHead;
  mainTitle.innerHTML = "Order Detail";
}

/**
 * Method that shows content
 * @param {} category 
 */
function showCont(category) {
  let html = "";
  info
    .filter((it) => it.name == category)[0]
    .products.forEach((product, index) => {
      let newContent = `<div class="col-sm-6 col-md-4 col-lg-3 mt-4">
        <div class="card card-inverse card-primary">
          <img class="card-img-top" src="${product.image}"/>
          <blockquote class="card-blockquote p-3">
            <p class="font-weight-bold">${product.name}</p>
            <footer>
              <p>${product.description}<br />
              </p>
            </footer>
            <h6 class=""><strong>$${product.price}</strong></h6>
            <button id="${category};;${index}" type="button" class="btn btn-dark text-white">Add to car</button>
          </blockquote>
        </div>
      </div>`;
      html += newContent;
    });
  productsContent.innerHTML = html;
  mainTitle.innerHTML = category;
  document
    .querySelectorAll(".btn-dark")
    .forEach((item) =>
      item.addEventListener("click", () => addToCart(item.id))
    );
    footButtons.innerHTML = "";
}

/**
 * Refresh the total amount
 */
function refreshTotal(){
    total = 0;
    totalProductos = 0;
    shoppingCart.forEach((item) => {
        totalProductos += item.qty;
        total += (item.qty * item.price);
      });
      let cartItemsNumber = document.querySelector("#btnShoppingCart");
      cartItemsNumber.innerHTML = ` <img
      class="btn-image"
      src="./assets/car.png"
      alt=""
    />${totalProductos} items`;
}

/**
 * 
 * @param {Adds an item to the shopping cart.} itemId 
 */
function addToCart(itemId) {
  array = itemId.split(";;");
  let category = array[0];
  let index = array[1];
  let result = info.filter((item) => item.name == category)[0].products[index];
  let i = shoppingCart.findIndex((item) => item.name == result.name);
  if (i < 0) {
    result.qty = 1;
    shoppingCart.push(result);
  } else {
    result.qty = result.qty + 1;
  }
  refreshTotal();
}

function reset(){
  totalProductos = 0;
  total = 0;
  shoppingCart = [];
  showCart();
  refreshTotal();
}
/**
 * Method that prints the json required
 */
function printOrder(){
  let array = [];
  shoppingCart.forEach((item,index) => {
    let toAdd = {Id:index, quantity:item.qty, description:item.description,unitPrice:item.price};
    array.push(toAdd);
  });
  console.log(array);
}
