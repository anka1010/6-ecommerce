"use strict";

// CHANGING CURRENT PRODUCT IMAGE
const currentImage = document.querySelector("#current-image");
const productThumbBtns = document.querySelectorAll(".product__thmb-btn");

productThumbBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (!btn.classList.contains("product__thmb-btn--current")) {
      btn.classList.toggle("product__thmb-btn--current");
    }
  })
);
