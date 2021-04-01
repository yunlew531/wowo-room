function renderBannerTitle(length) {
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

const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 5000,
  },
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

function init() {
  animate.classList.add('active');
  bannerTitle.classList.add('active');
  bannerTitleText.classList.add('active');
  renderBannerTitle(bannerTitleArr.length);
}

const animate = document.querySelector('.animate');
const bannerTitle = document.querySelector('.banner-title');
const bannerTitleText = document.querySelector('.banner-title > h2');
const bannerText = {
  text1: `窩窩家居 跟您一起品味生活`,
  text2: `2021 全新窩窩實木製系列產品`,
  text3: `消費滿萬送純木窩窩木頭一塊`,
  text4: `窩窩家居全新升級! 選用全新木頭`,
  text5: `窩窩家居溫馨方案大回饋!`,
  text6: `窩窩家居買一送一，最後三天!`,
}
const bannerTitleArr = Object.values(bannerText);

init();