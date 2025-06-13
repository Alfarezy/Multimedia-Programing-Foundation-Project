document.addEventListener("DOMContentLoaded", () => {
  // Cart state
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // DOM elements
  const cartItemsContainer = document.getElementById("cart-items")
  const cartItemTemplate = document.getElementById("cart-item-template")
  const cartTotalAmount = document.getElementById("cart-total-amount")
  const cartCount = document.querySelector(".cart-count")

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart)
  })

  // Initialize cart
  updateCartDisplay()

  // Format price to Indonesian Rupiah
  function formatRupiah(price) {
    return `Rp ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  // Add to cart function
  function addToCart(event) {
    const button = event.target
    const id = button.dataset.id
    const name = button.dataset.name
    const price = Number.parseInt(button.dataset.price)

    // Get the actual image path from the product card
    const productCard = button.closest(".product-card")
    const imageSrc = productCard.querySelector(".product-image img").src

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === id)

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      cart[existingItemIndex].quantity += 1
    } else {
      // Add new item to cart
      cart.push({
        id,
        name,
        price,
        image: imageSrc,
        quantity: 1,
      })
    }

    // Save cart to localStorage
    saveCart()

    // Update cart display
    updateCartDisplay()

    // Show feedback
    showAddedToCartFeedback(button)
  }

  // Show feedback when item is added to cart
  function showAddedToCartFeedback(button) {
    const originalText = button.textContent
    button.textContent = "Added!"
    button.disabled = true

    setTimeout(() => {
      button.textContent = originalText
      button.disabled = false
    }, 1000)
  }

  // Update cart display
  function updateCartDisplay() {
    // Clear cart items container
    cartItemsContainer.innerHTML = ""

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>'
      cartTotalAmount.textContent = "Rp 0"
      cartCount.textContent = "0"
      return
    }

    // Add each item to cart display
    cart.forEach((item, index) => {
      const cartItemElement = cartItemTemplate.content.cloneNode(true)

      // Set item details
      const itemImage = cartItemElement.querySelector(".cart-item-image img")
      itemImage.src = item.image
      itemImage.alt = item.name

      cartItemElement.querySelector(".cart-item-name").textContent = item.name
      cartItemElement.querySelector(".cart-item-price").textContent = formatRupiah(item.price)
      cartItemElement.querySelector(".quantity-input").value = item.quantity

      // Add event listeners to quantity buttons
      const minusBtn = cartItemElement.querySelector(".minus-btn")
      const plusBtn = cartItemElement.querySelector(".plus-btn")
      const removeBtn = cartItemElement.querySelector(".remove-item-btn")

      minusBtn.addEventListener("click", () => updateQuantity(index, -1))
      plusBtn.addEventListener("click", () => updateQuantity(index, 1))
      removeBtn.addEventListener("click", () => removeItem(index))

      // Add item to cart display
      cartItemsContainer.appendChild(cartItemElement)
    })

    // Update cart total and count
    updateCartTotal()
  }

  // Update item quantity
  function updateQuantity(index, change) {
    cart[index].quantity += change

    // Remove item if quantity is 0 or less
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1)
    }

    // Save cart to localStorage
    saveCart()

    // Update cart display
    updateCartDisplay()
  }

  // Remove item from cart
  function removeItem(index) {
    cart.splice(index, 1)

    // Save cart to localStorage
    saveCart()

    // Update cart display
    updateCartDisplay()
  }

  // Update cart total
  function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    cartTotalAmount.textContent = formatRupiah(total)

    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = count
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  // Checkout button
  const checkoutBtn = document.querySelector(".checkout-btn")
  checkoutBtn.addEventListener("click", () => {
    alert("Thank you for your purchase! This is where the checkout process would begin.")
    // Clear cart after checkout
    cart = []
    saveCart()
    updateCartDisplay()
  })
})
