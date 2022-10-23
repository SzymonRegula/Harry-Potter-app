let favorites = [];
let btnsRemove;
let cards;
let cardsInfo;
let columnNums = 3;

const cardsContainer = document.querySelector('.cards-container');
const switchDispBtn = document.querySelector('.switch-disp');

const dispCards = function () {
  cardsContainer.innerHTML = '';
  favorites.forEach((person) =>
    cardsContainer.insertAdjacentHTML('beforeend', generateCard(person))
  );
  btnsRemove = document.querySelectorAll('.btn-remove');
  btnsRemove.forEach((btn) => btn.addEventListener('click', removeCard));

  //needed for different styling for different columns number
  cards = document.querySelectorAll('.card');
  cardsInfo = document.querySelectorAll('.card-info');
};

const generateCard = function (person) {
  return `
  <div class='card columns-${columnNums}' >
    <img class='card-img' src='${
      person.image ? person.image : `placeholder.svg`
    }' alt='Harry Potter character' />
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
    changeColumns(3, 5);
    return;
  }
  if (columnNums === 5) {
    changeColumns(5, 1);
    return;
  }
  changeColumns(1, 3);
};

const changeColumns = function (was, willBe) {
  cardsContainer.style.gridTemplateColumns = '1fr '.repeat(willBe);
  cards.forEach((card) =>
    card.classList.replace(`columns-${was}`, `columns-${willBe}`)
  );
  cardsInfo.forEach((info) =>
    info.classList.replace(`columns-${was}`, `columns-${willBe}`)
  );
  columnNums = willBe;
};

const init = function () {
  loadStorage();
  dispCards();
  switchDispBtn.addEventListener('click', switchDisp);
};

init();
