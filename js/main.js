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
    const addCartBtns = document.querySelectorAll('#productPanel .addCart-btn');
    addCartBtns.forEach(addCartBtn => addCartBtn.addEventListener('click', addCart));
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
      <li id="${item.id}" class="card">
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
  arr.forEach(cart => {
    str += `
    <li id=${cart.id}>
    <p>${cart.product.title}<span style="margin-left: 20px">${cart.quantity}</span><span style="margin-left: 20px">${cart.product.price}</span></p>
    </li>
    `;
  })
  cartGroup.innerHTML = str;
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
  const api = `${API}/api/livejs/v1/customer/${api_path}/carts`;
  const el = e.target.parentNode.parentNode.parentNode.parentNode;
  const addCartNum = e.target.parentNode.querySelector('.cart-num-select');
  const productId = el.getAttribute('id');
  const quantity = parseInt(addCartNum.value);
  const cart = {
    productId,
    quantity,
  };
  axios.post(api, { data: cart }).then(res => {
    if (res.status === 200) {
      cartData = res.data.carts;
      renderCart(cartData);
      addCartNum.value = 1;
    }
  }).catch(err => {
    console.log(err);
  })
}

// 刪除全部購物車
function removeAllCart() {
  const api = `${API}/api/livejs/v1/customer/${api_path}/carts`;
  axios.delete(api).then(res => {
    if (res.status === 200) {
      cartData = res.data.carts;
      renderCart(cartData);
    }
  }).catch(err => {
    console.log(err);
  })
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
const productSearchInput = document.querySelector('#productSearchInput');
const productSearchBtn = document.querySelector('#productSearchBtn');
const categorySelect = document.querySelector('#categorySelect');
const cartGroup = document.querySelector('#cartGroup');
const removeAllBtn = document.querySelector('#removeAllBtn');
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

init();

transportModeBtn.addEventListener('click', showTransportPanel);
transportBtn.addEventListener('click', closeTransportPanel);
productSearchBtn.addEventListener('click', filterProduct);
productSearchInput.addEventListener('keyup', filterProduct);
categorySelect.addEventListener('change', filterCategory);
removeAllBtn.addEventListener('click', removeAllCart);

