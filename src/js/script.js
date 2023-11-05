"use strict";

///////////////////////////////////
// INITIAL VALUES
///////////////////////////////////
// CURRENT PRODUCT
const product = {
  productId: 123,
  productName: "Fall Limited Edition Sneakers",
  brand: "Sneaker Company",
  description:
    "This low profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.",
  price: 250,
  discount: 50,
  productThumbnail: "thmb-123.jpg",
};

// FOR TESTING
// let cart = [
//   {
//     productId: 123,
//     productName: "Fall Limited Edition Sneakers",
//     quantity: 3,
//     price: 125,
//     thumbnail: "thmb-123.jpg",
//   },
//   {
//     productId: 456,
//     productName: "Rainbow Walker Sneakers",
//     quantity: 1,
//     price: 234,
//     thumbnail: "thmb-456.jpg",
//   },
// ];

let cart = JSON.parse(localStorage.getItem("cart"));
cart = cart ? cart : [];

///////////////////////////////////
// VARIABLES
///////////////////////////////////
// --- PRODUCT ---
const brandText = document.querySelector("#brand");
const nameText = document.querySelector("#name");
const descriptionText = document.querySelector("#description");
const finalPriceText = document.querySelector("#final-price");
const discountText = document.querySelector("#discount");
const priceText = document.querySelector("#price");

// --- GALLERY ---
const currentImage = document.querySelector("#current-image");
const productGallery = document.querySelector("#product-gallery");

// --- CART ---
const cartNotification = document.querySelector("#cart-notification");
const cartEmpty = document.querySelector("#cart-empty");
const cartItems = document.querySelector("#cart-items");
const btnDeleteItem = document.querySelector("#cart-item-delete");
const btnCartCheckout = document.querySelector("#cart-btn-cta");
let count = 0;

// --- ADD TO CART ---
const btnDecreaseCount = document.querySelector("#btn-decrease");
const btnIncreaseCount = document.querySelector("#btn-increase");
const btnAddToCart = document.querySelector("#btn-add");
const countInput = document.querySelector("#count");

///////////////////////////////////
// FUNCTIONS
///////////////////////////////////
// --- GALLERY ---
// ZOOM IN GALLERY
currentImage.addEventListener("click", () => {
  const galleryModal = document.createElement("div");
  const backdrop = document.createElement("div");
  const closeModalBtn = document.createElement("button");
  const btnPrevImg = document.createElement("button");
  const btnNextImg = document.createElement("button");

  const closeModal = function () {
    document.body.removeChild(galleryModal);
    document.body.removeChild(backdrop);
  };

  // Modal Gallery
  galleryModal.innerHTML = productGallery.innerHTML;
  galleryModal.classList.add("product__gallery--modal");
  galleryModal
    .querySelector("#current-image")
    .setAttribute("id", "current-image--modal");

  // Modal Gallery Thumbnails
  const thmbs = galleryModal.querySelectorAll("#product-thmb");
  thmbs.forEach((el) => el.setAttribute("id", "product-thmb--modal"));
  thmbs.forEach((el, i) =>
    el.setAttribute(
      "onclick",
      `changeThumbnail(${i}, 'current-image--modal', 'product-thmb--modal')`
    )
  );
  document.body.appendChild(galleryModal);

  // Modal Gallery Background
  backdrop.classList.add("product__modal-background");
  backdrop.addEventListener("click", () => closeModal());
  document.body.appendChild(backdrop);

  // Modal Gallery Close button
  closeModalBtn.classList.add("close-btn");
  closeModalBtn.innerHTML = `
  <svg class="icon-close">
    <use href="img/sprite.svg#icon-close"></use>
  </svg>
  `;
  closeModalBtn.addEventListener("click", () => closeModal());
  galleryModal.appendChild(closeModalBtn);

  // Modal Gallery Previous / Next buttons FIXME
  btnPrevImg.classList.add("prev-btn");
  btnPrevImg.innerHTML = `
  <svg class="icon-carousel">
    <use href="img/sprite.svg#icon-previous"></use>
  </svg>
  `;
  galleryModal.querySelector("#current-image--modal").appendChild(btnPrevImg);

  // btnNextImg
});

// CHANGING CURRENT PRODUCT IMAGE
const changeThumbnail = function (thmb, image, thmbs) {
  const thumbnails = document.querySelectorAll(`#${thmbs}`);
  thumbnails.forEach((el, i) => {
    if (i === thmb) el.classList.add("product__thmb--current");
    else el.classList.remove("product__thmb--current");
  });

  document
    .querySelector(`#${image}`)
    ?.setAttribute("src", `img/product/image-product-${thmb + 1}.jpg`);
};

// --- CART ----
// FILL CART WITH ITEMS
const saveCart = function () {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const fillCart = function () {
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    const newItem = document.createElement("div");
    newItem.classList.add("cart__item");
    newItem.setAttribute("id", item.productId);
    newItem.innerHTML = `                      
      <img
        class="cart__item-img"
        src="img/cart/thumbnail-${item.productId}.jpg"
        alt="Product thumbnail image"
      />
      <div class="cart__item-text">
        <p class="cart__item-name">
          ${item.productName}
        </p>
        <div>
          \$${item.price.toFixed(2)} <span id="cart-item-count">x ${
      item.quantity
    }</span>
          <span class="cart__item-total" id="cart-item-total"
            >\$${(item.quantity * item.price).toFixed(2)}</span
          >
        </div>
      </div>
      <button class="cart__item-delete-btn" id="cart-item-delete" onclick="deleteItem(${
        item.productId
      })">
        <svg class="cart__item-delete-icon">
          <use href="img/sprite.svg#icon-delete"></use>
        </svg>
      </button>`;
    cartItems.appendChild(newItem);
  });
};

// UDEATE CART NOTIFICATION & BOX
const updateCartNotification = function () {
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  if (cartCount > 0) {
    cartNotification.textContent = cartCount;
    cartNotification.classList.remove("invisible");
    cartItems.classList.remove("invisible");
    btnCartCheckout.classList.remove("invisible");
    cartEmpty.classList.add("invisible");
  } else {
    cartNotification.textContent = "";
    cartNotification.classList.add("invisible");
    cartItems.classList.add("invisible");
    btnCartCheckout.classList.add("invisible");
    cartEmpty.classList.remove("invisible");
  }
};

// DELETE CART ITEM FIXME - deleting item from array
const deleteItem = function (productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  fillCart();
  updateCartNotification();
};

// --- ADD TO CART ----
// REDUCE ADD TO CART COUNT
btnDecreaseCount.addEventListener("click", () => {
  if (count > 0) {
    count--;
    countInput.value = count;
  }
});

// INCREASE ADD TO CART COUNT (MAX VALUE = 10)
btnIncreaseCount.addEventListener("click", () => {
  count++;
  countInput.value = count;
});

// INPUT ADD TO CART COUNT (MAX VALUE = 10)
countInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
  count = Number(e.target.value);
});

btnAddToCart.addEventListener("click", () => {
  if (count > 0) {
    // Add count to item in the cart FIXME search item by id
    cart.forEach((item) => {
      if (item.productId === product.productId) {
        item.quantity += count;
        count = 0;
        return;
      }
    });

    // Add new item to the cart
    if (count > 0) {
      cart.push({
        productId: product.productId,
        productName: product.productName,
        quantity: count,
        price: product.price,
        thumbnail: product.productThumbnail,
      });
      count = 0;
    }

    saveCart();
    fillCart();
    updateCartNotification();
    countInput.value = count;
  }
});

///////////////////////////////////
// INITIAL RENDERING
///////////////////////////////////
// --- PRODUCT ---
brandText.textContent = product.brand;
nameText.textContent = product.productName;
descriptionText.textContent = product.description;
finalPriceText.textContent =
  "$" + ((product.price * product.discount) / 100).toFixed(2);
discountText.textContent = product.discount + "%";
priceText.textContent = "$" + product.price.toFixed(2);

// --- CART ---
fillCart();
updateCartNotification();
