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
const productThmbs = document.querySelector("#product-thmbs");

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
// FUNCTIONALITY
///////////////////////////////////

// --- GALLERY ---
// ZOOM IN GALLERY
function showModalGallery() {
  const galleryModal = document.createElement("div");
  const backdrop = document.createElement("div");

  const closeModalBtn = document.createElement("button");
  const btnPrevImg = document.createElement("button");
  const btnNextImg = document.createElement("button");

  // Modal Gallery block
  galleryModal.innerHTML = productGallery.innerHTML;
  galleryModal.classList.add("product__gallery--modal");

  const currentImageModal = galleryModal.querySelector("#current-image");
  let currentThmb = productGallery.querySelector(".product__thmb--current")
    ?.dataset.thmb;

  // Modal Gallery Thumbnails
  const productThmbsModal = galleryModal.querySelector("#product-thmbs");
  const thmbsCount = productThmbsModal.querySelectorAll("[data-thmb]").length;
  productThmbsModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("product__thmb")) {
      changeCurrentImage(
        currentImageModal,
        Number(e.target.dataset.thmb),
        productThmbsModal
      );
      currentThmb = Number(e.target.dataset.thmb);
    }
  });

  //Previous button
  btnPrevImg.classList.add("prev-btn");
  btnPrevImg.innerHTML = `
    <svg class="icon-carousel" width="12" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 1 3 9l8 8" fill="none" stroke-width="3"/>
    </svg>
    `;
  btnPrevImg.addEventListener("click", () => {
    currentThmb = currentThmb > 1 ? --currentThmb : 1;
    changeCurrentImage(currentImageModal, currentThmb, productThmbsModal);
  });

  //Next button
  btnNextImg.classList.add("next-btn");
  btnNextImg.innerHTML = `
  <svg class="icon-carousel" width="12" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="m2 1 8 8-8 8" stroke-width="3" fill="none"/>
  </svg>
    `;
  btnNextImg.addEventListener("click", () => {
    currentThmb = currentThmb < thmbsCount ? ++currentThmb : currentThmb;
    changeCurrentImage(currentImageModal, currentThmb, productThmbsModal);
  });

  // Smooth close down Modal Gallery
  const closeModal = function () {
    galleryModal.style.visibility = "hidden";
    galleryModal.style.opacity = "0";
    backdrop.style.visibility = "hidden";
    backdrop.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(galleryModal);
      document.body.removeChild(backdrop);
    }, 200);
  };

  // Modal Gallery Background
  backdrop.classList.add("product__modal-background");
  backdrop.addEventListener("click", closeModal);

  // Modal Gallery Close button
  closeModalBtn.classList.add("close-btn");
  closeModalBtn.innerHTML = `
  <svg class="icon-close" width="14" height="15" xmlns="http://www.w3.org/2000/svg">
  <path d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z" />
  </svg>
  `;
  closeModalBtn.addEventListener("click", closeModal);

  document.body.appendChild(backdrop);

  galleryModal.querySelector(".product__img-box").appendChild(btnPrevImg);
  galleryModal.querySelector(".product__img-box").appendChild(btnNextImg);

  galleryModal.appendChild(closeModalBtn);
  document.body.appendChild(galleryModal);

  // Smooth show up Modal Gallery
  setTimeout(() => {
    galleryModal.style.visibility = "visible";
    galleryModal.style.opacity = "1";
    backdrop.style.visibility = "visible";
    backdrop.style.opacity = "0.75";
  }, 200);
}

// CLICK CURRENT PRODUCT IMAGE
currentImage.addEventListener("click", showModalGallery);

// CHANGE CURRENT IMAGE
function changeCurrentImage(img, index, thmbs) {
  img.setAttribute("src", `img/product/image-product-${index}.jpg`);

  thmbs.querySelectorAll("[data-thmb]").forEach((thmb) => {
    if (Number(thmb.dataset.thmb) === index) {
      thmb.classList.add("product__thmb--current");
    } else {
      thmb.classList.remove("product__thmb--current");
    }
  });
}

// CLICK ON PRODUCT THUMBNAIL
productThmbs.addEventListener("click", (e) => {
  if (e.target.classList.contains("product__thmb")) {
    changeCurrentImage(
      currentImage,
      Number(e.target.dataset.thmb),
      productThmbs
    );
  }
});

// --- CART ----
// SSAVE CART ITEMS
const saveCart = function () {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// FILL CART WITH ITEMS
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
      <svg class="cart__item-delete-icon" width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a"/></svg>
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

// DELETE CART ITEM
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
