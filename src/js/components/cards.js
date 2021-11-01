const cardsContainer = document.querySelector('.assortment__product-cards');
const resultText = document.querySelector('.search-result__text');
const filter = document.querySelector('.assortment__filter');
const btnMore = document.querySelector('.assortment__btn-more');

let flagPrice, flagAge = true;

//копирование каталога
let cards = JSON.parse(JSON.stringify(CATALOG));
let trimCards = [];

// добавление в шапку кол-ва найденных котов
function getQuantity() {
  if (CATALOG.length === 11 || CATALOG.length === 12 ) {
    return resultText.textContent = `Найден ${CATALOG.length} котов`
  }
  if (CATALOG.length % 10 === 1) {
    return resultText.textContent = `Найден ${CATALOG.length} кот`
  }
  if (CATALOG.length % 10 === 2) {
    return resultText.textContent = `Найдено ${CATALOG.length} кота`
  }
  return resultText.textContent = `Найдено ${CATALOG.length} котов`
}

//сортировка каталога по возрасту
function sortByAge() {
  let age;
  cards.forEach(card => {
    age = card.characteristic.age.split(' ');
    age[0] = Number(age[0]);
    if(age[1].startsWith('год') || age[1].startsWith('лет')) {
      age[0] *= 12;
    }
    card.characteristic.age = age;
  })

  if (flagAge) {
    cards.sort((card1, card2) => card1.characteristic.age[0] > card2.characteristic.age[0] ? 1 : -1)
  } else {
    cards.sort((card1, card2) => card1.characteristic.age[0] < card2.characteristic.age[0] ? 1 : -1)
  }
  
  cards.forEach(card => {
    age = card.characteristic.age;
    if(age[1].startsWith('год') || age[1].startsWith('лет')) {
      age[0] /= 12;
    }
    card.characteristic.age = age.join(' ');
  })
  getTrimCards();
  buildCards(trimCards);
}

// сортировка каталога по цене
function sortByPrice() {
  if (flagPrice) {
    cards.sort((card1, card2) => card1.price > card2.price ? 1 : -1)
  } else {
    cards.sort((card1, card2) => card1.price < card2.price ? 1 : -1)
  }
  getTrimCards();
  buildCards(trimCards);
}

// ограничение кол-ва карточек на экране
function getTrimCards(trimEnd = trimCards.length ) {
  return trimCards = cards.slice(0, trimEnd)
}

//построение HTML разметки карточек котов
function buildCards(trimCards) {
  cardsContainer.innerHTML = '';
  trimCards.forEach(card => {
    cardsContainer.innerHTML += 
` <div class="product-card"> 
    <header class="product-card__header"> <img class="product-card__img" src= ${card.img} alt="фото кота" srcset="">
      ${isDiscount(card.discount)}
      <svg class="product-card__mark product-card__mark--heart" width="46" height="42" viewBox="0 0 46 42" xmlns="http://www.w3.org/2000/svg" >
        <path class="imgHeart" d="M33.7812 0.695312C31.2851 0.695312 28.9966 1.4863 26.9794 3.04634C25.0456 4.54197 23.758 6.44693 23 7.83214C22.242 6.44684 20.9544 4.54197 19.0206 3.04634C17.0034 1.4863 14.7149 0.695312 12.2188 0.695312C5.25298 0.695312 0 6.39293 0 13.9485C0 22.1112 6.55347 27.696 16.4746 36.1505C18.1593 37.5863 20.0689 39.2138 22.0538 40.9494C22.3154 41.1785 22.6514 41.3047 23 41.3047C23.3486 41.3047 23.6846 41.1785 23.9462 40.9495C25.9312 39.2136 27.8408 37.5862 29.5265 36.1496C39.4465 27.696 46 22.1112 46 13.9485C46 6.39293 40.747 0.695312 33.7812 0.695312Z"/>
      </svg>
    </header>
    <div class="product-card__content"> 
      <h3 class="product-card__title">${card.name}</h3>
    <div class="product-card__desc desc">
      <div class="desc__color">${card.characteristic.color}</div>
    <div class="desc__age"><span>${card.characteristic.age}</span>Возраст</div>
      <div class="desc__paws"><span>${card.characteristic.paws}</span>Кол-во лап</div>
        </div>
    <div class="product-card__price" data-price="30000">${changePrice(card.price)} руб.</div>
    </div>
    ${isSale(card)}
    </div>`
  })
};

// определение наличия скидки
function isDiscount(discount) {
  if(discount.mark === true) {
    return `<span class="product-card__mark product-card__mark--discount">-${discount.num}</span>`
  }
  return '';
}

// проверка на наличие кота
function isSale(card) {
  if (card.forSale === true) {
    return `<button class="btn-reset product-card__btn">Купить</button>`
  }
  return `<button class="btn-reset product-card__btn product-card__btn--sold" desabled>Продан</button>`
}

// добавление пробела в цене 
function changePrice(price) {
  return String(price).replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
}


// событие - сортировка
filter.addEventListener('click', (e) => {

  if(e.target.id == 'btnPrice') {
    sortByPrice();
    flagPrice = !flagPrice;
    e.target.querySelector('svg').classList.toggle('icon-arrow--down')  
  }
  if(e.target.id == 'btnAge') {
    sortByAge();
    flagAge = !flagAge;
    e.target.querySelector('svg').classList.toggle('icon-arrow--down')  
  }
})

// событие - добавать еще 6 карточек на страницу 
btnMore.addEventListener('click', () => {
  getTrimCards(trimCards.length+6);
  buildCards(trimCards);

  if (trimCards.length === cards.length) {
    btnMore.style.display = 'none';
  }
}) 

getTrimCards(trimCards.length+6);
buildCards(trimCards);
getQuantity();

