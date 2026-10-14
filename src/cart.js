const PROMO_CODE = 'SAVE10';
const PROMO_DISCOUNT_RATE = 0.1;
const PROMO_MIN_SUBTOTAL = 20000;
const DELIVERY_PRICE = 30000;
const FREE_DELIVERY_MIN_SUBTOTAL = 50000;

function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество товара должно быть положительным целым числом.');
  }
  if (quantity > stock) {
    throw new RangeError(`На складе осталось только ${stock} шт.`);
  }
}

function addToCart(cart, product, quantity = 1) {
  const cartItem = cart.find((item) => item.id === product.id);
  const newQuantity = (cartItem ? cartItem.quantity : 0) + quantity;

  validateQuantity(quantity, product.stock);
  validateQuantity(newQuantity, product.stock);

  if (!cartItem) return [...cart, { ...product, quantity }];
  return cart.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item));
}

function changeQuantity(cart, productId, quantity) {
  const cartItem = cart.find((item) => item.id === productId);
  if (!cartItem) return [...cart];

  validateQuantity(quantity, cartItem.stock);
  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);
  const isPromoApplied = String(promoCode).trim().toUpperCase() === PROMO_CODE
    && subtotal >= PROMO_MIN_SUBTOTAL;
  const discount = isPromoApplied ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;
  const delivery = subtotal > 0 && subtotal < FREE_DELIVERY_MIN_SUBTOTAL ? DELIVERY_PRICE : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
