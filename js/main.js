// 控制橫幅文字動畫
function bannerTitleHandler(length) {
  let n = 1;
  bannerTitleText.textContent = `${bannerTitleArr[0]}`;
  setInterval(() => {
    bannerTitle.classList.remove('active');
    bannerTitleText.classList.remove('active');
    bannerTitleText.textContent = `${bannerTitleArr[n]}`;
    n = (n === length - 1 ? 0 : n + 1);
    setTimeout(() => {
      bannerTitle.classList.add('active');
      bannerTitleText.classList.add('active');
    }, 100);
  }, 5000);
}

// 開啟運送方式窗
function showTransportPanel() {
  transportPanel.classList.toggle('active');
}

// 關閉運送方式窗
function closeTransportPanel() {
  transportPanel.classList.remove('active');
}

// 取得商品
function getProducts() {
  const api = `${API}/api/livejs/v1/customer/${api_path}/products`;
  axios.get(api).then(res => {
    data = res.data.products;
    renderProducts(data);
    categoryArrHandler(); // 整理出種類不重複陣列
    renderProductsSelect(categoryArr); // 渲染種類選項
  }).catch(err => {
    console.log(err);
  })
}

// 取得購物車
function getCarts() {
  const api = `${API}​​/api/livejs/v1/customer/${api_path}/carts`;
  axios.get(api).then(res => {
    cartData = res.data.carts;
    renderCart(cartData);
  }).catch(err => {
    console.log(err);
  })
}

// 渲染商品卡片
function renderProducts(arr) {
  let str = ''
  arr.forEach(item => {
    const content = `
      <li data-id="${item.id}" class="card">
        <a class="card-header" href="javascript:void(0)">
          <img src="${item.images}" alt="">
          <div class="card-content">
            <h3>${item.title}</h3>
            <del>NT$${item.origin_price}</del>
            <p>NT$${item.price}</p>
            <div>
              <button class="addCart-btn">加入購物車</button>
              <select class="cart-num-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
          <span class="new-item">New</span>
        </a>
      </li>
    `;
    str += content;
  })
  cardGroup.innerHTML = str;
}

// 渲染購物車
function renderCart(arr) {
  let str = '';
  let totalPrice = 0;

  arr.forEach(cart => {
    let optionStr = '';
    for (let i = 0; i < 10; i++) {
      const selected = (i + 1 === cart.quantity ? 'SELECTED ' : '');
      const content = `<option value="${i + 1}" ${selected}>${i + 1}</option>`;
      optionStr += content;
    }
    str += `
      <tr data-id="${cart.id}">
        <td><img src="${cart.product.images}" alt="${cart.product.title}">${cart.product.title}</td>
        <td>${cart.product.origin_price}</td>
        <td>
          <select>
            ${optionStr}
          </select>
        </td>
        <td>${cart.product.price}</td>
        <td class="remove-cart-btn"><i class="fas fa-trash"></i></td>
      </tr>
    `;
    totalPrice += cart.product.price * cart.quantity;
  })
  cartGroup.innerHTML = str;
  totalPriceDom.textContent = `NT $${totalPrice}`;
}

// 依輸入框過濾商品卡片
function filterProduct(e) {
  if (e.keyCode === 13 || e.type === 'click') {
    const value = productSearchInput.value;
    if (!value) return;
    const filterArr = data.filter(item => item.title.match(value));
    renderProducts(filterArr);
  }
}

// 將重複種類過濾整理成陣列
function categoryArrHandler() {
  data.forEach(item => {
    const isRepeat = categoryArr.some(category => category === item.category);
    if (!isRepeat)
      categoryArr.push(item.category);
  })
}

// 渲染種類選項
function renderProductsSelect(arr) {
  let str = `<option value="">全部品項</option>`;
  arr.forEach(item => {
    const content = `
      <option value="${item}">${item}</option>
    `;
    str += content;
  })
  categorySelect.innerHTML = str;
}

// 依種類過濾商品卡片
function filterCategory(e) {
  const filterArr = data.filter(item => item.category.match(e.target.value));
  renderProducts(filterArr);
}

// 加入購物車
function addCart(e) {
  e.preventDefault();
  if (e.target.className !== 'addCart-btn') return;
  const api = `${API}/api/livejs/v1/customer/${api_path}/carts`;
  const el = e.target.parentNode.parentNode.parentNode.parentNode;
  const addCartNum = e.target.parentNode.querySelector('.cart-num-select');
  const productId = el.dataset.id;
  const quantity = parseInt(addCartNum.value);
  const cart = {
    productId,
    quantity,
  };
  axios.post(api, { data: cart }).then(res => {
    if (res.data.status) {
      cartData = res.data.carts;
      renderCart(cartData);
      addCartNum.value = 1;
      cartMessageHandler('addCartSuccess');
    } else {
      cartMessageHandler('addCartError');
    }
  }).catch(err => {
    console.log(err);
  })
}

// 購物車、訂單操作訊息
function cartMessageHandler(text) {
  const message = {
    addCartSuccess: { text: '成功加入購物車', color: '#6ed26e' },
    addCartError: { text: '加入失敗...!', color: '#e9afba' },
    removeCartSuccess: { text: '成功移除物品', color: '#6ed26e' },
    removeCartError: { text: '沒有成功移除物品!', color: '#e9afba' },
    orderSubmitSuccess: { text: '成功送出訂單!', color: '#6ed26e' },
    orderSubmitError: { text: '訂單送出失敗!', color: '#e9afba' },
    editCartSuccess: { text: '購物車更新!', color: '#6ed26e' },
    editCartError: { text: '購物車更新失敗!', color: '#e9afba' },
  }
  const content = `<li style="color: ${message[text].color};">${message[text].text}</li>`
  messageArr.push(content);
  let str = messageArr.reduce((prev, text) => prev + text);
  cartMessage.innerHTML = str;
  setTimeout(() => {
    messageArr.splice(0, 1);
    str = (messageArr.length === 0 ? '' : messageArr.reduce((prev, text) => prev + text));
    cartMessage.innerHTML = str;
  }, 5000);
}

// 刪除單筆購物車
function removeCart(e) {
  if (e.target.parentNode.className !== 'remove-cart-btn') return;
  const id = e.target.parentNode.parentNode.dataset.id;
  const api = `${API}/api/livejs/v1/customer/${api_path}/carts/${id}`;
  axios.delete(api).then(res => {
    if (res.data.status) {
      cartData = res.data.carts;
      cartMessageHandler('removeCartSuccess');
      renderCart(cartData);
    } else {
      cartMessageHandler('removeCartError');
    }
  }).catch(err => {
    console.log(err);
  })
}

// 刪除全部購物車
function removeAllCart() {
  const api = `${API}/api/livejs/v1/customer/${api_path}/carts`;
  axios.delete(api).then(res => {
    if (res.status) {
      cartData = res.data.carts;
      renderCart(cartData);
      cartMessageHandler('removeCartSuccess');
    }
  }).catch((err) => {
    cartMessageHandler('removeCartError');
    console.log(err);
  })
}

// 修改購物車數量
function editCartNum(e) {
  const api = `${API}​/api/livejs/v1/customer/${api_path}/carts`;
  const Id = e.target.parentNode.parentNode.dataset.id;
  const num = e.target.value;
  const obj = {
    id: Id,
    quantity: parseInt(num),
  };
  axios.patch(api, { data: obj }).then(res => {
    cartMessageHandler('editCartSuccess');
  }).catch(err => {
    cartMessageHandler('editCartError');
    console.log(err.response);
  })
}

// 送出訂單
function orderSubmit() {
  const api = `${API}/api/livejs/v1/customer/${api_path}/orders`;
  const user = {
    name: nameDom.value,
    tel: tel.value,
    email: email.value,
    address: address.value,
    payment: payment.value
  }
  const hasError = validate(user);
  if (hasError) return;
  axios.post(api, { data: { user } }).then(res => {
    cartMessageHandler('orderSubmitSuccess');
    getCarts();
    submitForm.reset();
  }).catch(() => {
    cartMessageHandler('orderSubmitError');
  });
}

// 表單驗證
function validate(user) {
  const arr = Object.values(user);
  const isEmpty = arr.some(value => !value);
  inputGroup.forEach(input => {
    const el = input.parentNode.querySelector('.alert-message');
    if (!input.value)
      el.textContent = `必填!`;
    else
      el.textContent = '';
  })
  return isEmpty;
}

// 動畫控制
function animateHandler() {
  if (window.scrollY > 300 && window.scrollY < 1500) {
    environmental.classList.add('active')
    textDom[0].classList.add('active');
    setTimeout(() => {
      moreInformationBtn.classList.add('active');
    }, 800);
    setTimeout(() => {
      textDom[2].classList.add('active');
    }, 1000)
  }
  if (window.scrollY > 1100 && window.scrollY < 2270) {
    middleImgAnimate.classList.add('active');
    setTimeout(() => {
      productPageBtn.classList.add('active');
    }, 800);
  }
  if (window.scrollY > 1900 && window.scrollY < 3000)
    comparedPanel.classList.add('active');
  if (window.scrollY > 2446 && window.scrollY < 3650) {
    let time = 500;
    setTimeout(() => {
      commentCards[0].classList.add('active');
    }, 0);
    setTimeout(() => {
      commentCards[1].classList.add('active');
    }, time);
    setTimeout(() => {
      commentCards[2].classList.add('active');
    }, time * 2);
    setTimeout(() => {
      commentCards[3].classList.add('active');
    }, time * 3);
    setTimeout(() => {
      commentCards[4].classList.add('active');
    }, time * 4);
    setTimeout(() => {
      commentCards[5].classList.add('active');
    }, time * 5);
  }
  if (window.scrollY > 3200)
    productPanelTitle.classList.add('active');
}

// 初始
function init() {
  getProducts(); // 從伺服器取商品
  getCarts(); // 從伺服器取購物車
  enterAnimate.classList.add('active');  // 進網頁過場動畫
  setTimeout(() => {
    bannerTitle.classList.add('active');
    bannerTitleText.classList.add('active');
    bannerTitleHandler(bannerTitleArr.length);
  }, 600);
}

// 橫幅廣告
const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 1000,
  slidesPerView: 3.2,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const api_path = 'yunlew531';
const API = 'https://hexschoollivejs.herokuapp.com';
const enterAnimate = document.querySelector('#enterAnimate');
const bannerTitle = document.querySelector('#bannerTitle');
const bannerTitleText = document.querySelector('#bannerTitle > h2');
const transportModeBtn = document.querySelector('#transportModeBtn');
const transportBtn = document.querySelector('#transportBtn');
const cardGroup = document.querySelector('#cardGroup');
const cartGroup = document.querySelector('#cartGroup');
const productSearchInput = document.querySelector('#productSearchInput');
const productSearchBtn = document.querySelector('#productSearchBtn');
const categorySelect = document.querySelector('#categorySelect');
const removeAllBtn = document.querySelector('#removeAllBtn');
const middleImgAnimate = document.querySelector('#middleImgAnimate');
const environmental = document.querySelector('#environmental');
const cartMessage = document.querySelector('#cartMessage');
const comparedPanel = document.querySelector('#comparedPanel');
const moreInformationBtn = document.querySelector('.more-information-btn');
const productPageBtn = document.querySelector('.product-page-btn');
const commentCards = document.querySelectorAll('#commentPanel .card');
const productPanelTitle = document.querySelector('#productPanel > h2');
const textDom = document.querySelectorAll('.textDom');
const nameDom = document.querySelector('#name');
const tel = document.querySelector('#tel');
const email = document.querySelector('#email');
const address = document.querySelector('#address');
const payment = document.querySelector('#payment');
const inputGroup = document.querySelectorAll('[data-use="validate"]');
const submitBtn = document.querySelector('.submit-btn');
const totalPriceDom = document.querySelector('#totalPrice');
const submitForm = document.querySelector('#submitForm');
const body = document.body;
const bannerText = {
  text1: `窩窩家居 跟您一起品味生活`,
  text2: `2021 全新窩窩實木製系列產品`,
  text3: `消費滿萬送純木窩窩木頭一塊`,
  text4: `窩窩家居全新升級! 選用全新木頭`,
  text5: `窩窩家居溫馨方案大回饋!`,
  text6: `窩窩家居買一送一，最後三天!`,
}
const bannerTitleArr = Object.values(bannerText);
let data = [];
let cartData = [];
let categoryArr = [];
let messageArr = [];

init();

transportModeBtn.addEventListener('click', showTransportPanel);
transportBtn.addEventListener('click', closeTransportPanel);
productSearchBtn.addEventListener('click', filterProduct);
productSearchInput.addEventListener('keyup', filterProduct);
categorySelect.addEventListener('change', filterCategory);
removeAllBtn.addEventListener('click', removeAllCart);
cardGroup.addEventListener('click', addCart);
cartGroup.addEventListener('click', removeCart);
cartGroup.addEventListener('change', editCartNum);
window.addEventListener('scroll', animateHandler);
submitBtn.addEventListener('click', orderSubmit);