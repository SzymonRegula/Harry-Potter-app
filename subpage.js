let favorites = [];
let btnsRemove;
let columnNums = 3;

const cardsContainer = document.querySelector('.cards-container');
const switchDispBtn = document.querySelector('.switch-disp');
let cards;
let cardsInfo;

const dispCards = function () {
  cardsContainer.innerHTML = '';
  favorites.forEach((person) =>
    cardsContainer.insertAdjacentHTML('beforeend', generateCard(person))
  );
  btnsRemove = document.querySelectorAll('.btn-remove');
  btnsRemove.forEach((btn) => btn.addEventListener('click', removeCard));

  cards = document.querySelectorAll('.card');
  cardsInfo = document.querySelectorAll('.card-info');
};

const generateCard = function (person) {
  return `
  <div class='card columns-${columnNums}' >
    <img class='card-img' src='${person.image}' alt='Harry Potter character' />
    <div class='card-info columns-${columnNums}'>
      <div>
        <span class='card-name'>${person.name}</span>
      </div>
    </div>
    <button class='btn btn-remove' data-name='${person.name}'>
      <ion-icon class='icon-remove' name="trash-outline"></ion-icon>
    </button>
  </div>
  `;
};

const removeCard = function (e) {
  const index = favorites.findIndex(
    (fav) => fav.name === e.target.closest('.btn-remove').dataset.name
  );

  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  dispCards();
};

const loadStorage = function () {
  const storage = localStorage.getItem('favorites');
  favorites = JSON.parse(storage);
};

const switchDisp = function () {
  if (columnNums === 3) {
    cardsContainer.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr';

    cards.forEach((card) => card.classList.replace('columns-3', 'columns-5'));
    cardsInfo.forEach((info) =>
      info.classList.replace('columns-3', 'columns-5')
    );

    columnNums = 5;

    return;
  }
  if (columnNums === 5) {
    cardsContainer.style.gridTemplateColumns = '1fr';

    cards.forEach((card) => card.classList.replace('columns-5', 'columns-1'));
    cardsInfo.forEach((info) =>
      info.classList.replace('columns-5', 'columns-1')
    );

    columnNums = 1;
    return;
  }
  cardsContainer.style.gridTemplateColumns = '1fr 1fr 1fr';

  cards.forEach((card) => card.classList.replace('columns-1', 'columns-3'));
  cardsInfo.forEach((info) => info.classList.replace('columns-1', 'columns-3'));

  columnNums = 3;
};

const init = function () {
  loadStorage();
  dispCards();
  switchDispBtn.addEventListener('click', switchDisp);
};

init();
