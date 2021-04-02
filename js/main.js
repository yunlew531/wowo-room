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

function showTransportPanel() {
  transportPanel.classList.toggle('active');
}

function closeTransportPanel() {
  transportPanel.classList.remove('active');
}

function getProducts() {
  const api = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${API_PATH}/products`;
  axios.get(api).then(res => {
    data = res.data.products;
    renderProducts(data);
    categoryArrHandler(); // 整理出種類不重複陣列
    renderProductsSelect(categoryArr);
  }).catch(err => {
    console.log(err);
  })
}

function renderProducts(arr) {
  let str = ''
  arr.forEach(item => {
    const content = `
      <li class="card">
        <a class="card-header" href="#">
          <img src="${item.images}" alt="">
          <div class="card-content">
            <h3>${item.title}</h3>
            <del>NT$${item.origin_price}</del>
            <p>NT$${item.price}</p>
            <button class="addCart-btn">加入購物車</button>
          </div>
          <span class="new-item">New</span>
        </a>
      </li>
    `;
    str += content;
  })
  cardGroup.innerHTML = str;
}

function filterProduct(e) {
  if (e.keyCode === 13 || e.type === 'click') {
    const value = productSearchInput.value;
    if (!value) return;
    const filterArr = data.filter(item => item.title.match(value));
    renderProducts(filterArr);
  }
}

function categoryArrHandler() {
  data.forEach(item => {
    const isRepeat = categoryArr.some(category => category === item.category);
    if (!isRepeat)
      categoryArr.push(item.category);
  })
}

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

function filterCategory(e) {
  const filterArr = data.filter(item => item.category.match(e.target.value));
  renderProducts(filterArr);
}

function init() {
  getProducts();
  enterAnimate.classList.add('active');  // 進網頁動畫
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

const API_PATH = 'yunlew531';
const enterAnimate = document.querySelector('#enterAnimate');
const bannerTitle = document.querySelector('#bannerTitle');
const bannerTitleText = document.querySelector('#bannerTitle > h2');
const transportModeBtn = document.querySelector('#transportModeBtn');
const transportBtn = document.querySelector('#transportBtn');
const cardGroup = document.querySelector('#cardGroup');
const productSearchInput = document.querySelector('#productSearchInput');
const productSearchBtn = document.querySelector('#productSearchBtn');
const categorySelect = document.querySelector('#categorySelect');
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
let categoryArr = [];



init();

transportModeBtn.addEventListener('click', showTransportPanel);
transportBtn.addEventListener('click', closeTransportPanel);
productSearchBtn.addEventListener('click', filterProduct);
productSearchInput.addEventListener('keyup', filterProduct);
categorySelect.addEventListener('change', filterCategory);
