let data = [];
let sorted = false;
let modalId;
let favorites = [];

const btnAll = document.querySelector('.btn-all');
const btnGryff = document.querySelector('.btn-gryffindor');
const btnSlyth = document.querySelector('.btn-slytherin');
const btnHuff = document.querySelector('.btn-hufflepuff');
const btnRaven = document.querySelector('.btn-ravenclaw');
const table = document.querySelector('.table');
const tBody = document.querySelector('.t-body');
const nameSort = document.querySelector('.sort-name');
const dateSort = document.querySelector('.sort-date');
const houseSort = document.querySelector('.sort-house');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const modalName = document.querySelector('.modal-name');
const modalDate = document.querySelector('.modal-date');
const modalHouse = document.querySelector('.modal-house');
const modalWizard = document.querySelector('.modal-wizard');
const modalAncestry = document.querySelector('.modal-ancestry');
const modalIsStudent = document.querySelector('.modal-is-student');
const modalImg = document.querySelector('.modal-img');
const btnFav = document.querySelector('.btn-favorites');
const btnClose = document.querySelector('.btn-close');

const loadStudents = function () {
  loadData('students');
};
const loadGryff = function () {
  loadData('house/gryffindor');
};
const loadSlyth = function () {
  loadData('house/slytherin');
};
const loadHuff = function () {
  loadData('house/hufflepuff');
};
const loadRaven = function () {
  loadData('house/ravenclaw');
};

const loadStorage = function () {
  const storage = localStorage.getItem('favorites');
  if (storage) favorites = JSON.parse(storage);
};

const loadData = async function (key) {
  try {
    loadStorage();
    const fetchData = await (
      await fetch(`https://hp-api.herokuapp.com/api/characters/${key}`)
    ).json();

    data = [];
    fetchData.forEach((per) => {
      const person = {
        name: per.name,
        birthDate: per.dateOfBirth,
        house: per.house,
        wizard: per.wizard,
        ancestry: per.ancestry,
        studentOrStaff: per.hogwartsStaff ? 'staff' : 'student',
        image: per.image,
      };
      data.push(person);
    });
    generateTable();
  } catch (err) {
    console.log(err);
  }
};

const generateTable = function () {
  tBody.innerHTML = '';
  data.forEach((person, row) => {
    tBody.insertAdjacentHTML('beforeend', generateRow(person, row));
  });
  table.classList.remove('hidden');
};

const generateRow = function (person, row) {
  return `
  <tr class='person-row' data-row='${row}'>
    <td>${person.name}</td>
    <td>${person.birthDate}</td>
    <td>${person.house}</td>
    <td>${person.wizard}</td>
    <td>${person.ancestry}</td>
    <td>${person.studentOrStaff}</td>
  </tr>
  `;
};

const sortName = function () {
  data.sort((a, b) => {
    if (!sorted) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
    }
    if (sorted) {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
    }
    return 0; // names must be equal
  });
  sorted = !sorted;
  generateTable();
};

const sortDate = function () {
  data.sort((a, b) => {
    const yearA = a.birthDate.slice(-4);
    const monthA = a.birthDate.slice(3, 5);
    const dayA = a.birthDate.slice(0, 2);

    const yearB = b.birthDate.slice(-4);
    const monthB = b.birthDate.slice(3, 5);
    const dayB = b.birthDate.slice(0, 2);

    const dateA = new Date(yearA, monthA, dayA);
    const dateB = new Date(yearB, monthB, dayB);

    if (sorted) {
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    }
    if (!sorted) {
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
    }
    return 0; // dates must be equal
  });
  sorted = !sorted;
  generateTable();
};

const sortHouse = function () {
  data.sort((a, b) => {
    if (sorted) {
      if (a.house < b.house) return -1;
      if (a.house > b.house) return 1;
    }
    if (!sorted) {
      if (a.house < b.house) return 1;
      if (a.house > b.house) return -1;
    }
    return 0; // houses must be equal
  });
  sorted = !sorted;
  generateTable();
};

const openModal = function (e) {
  if (e.target.tagName.toLowerCase() !== 'th') {
    const row = e.target.closest('tr').dataset.row;
    modalId = row;

    data[row].image
      ? modalImg.setAttribute('src', `${data[row].image}`)
      : modalImg.setAttribute('src', `placeholder.svg`);
    modalName.textContent = checkData(data[row].name);
    modalDate.textContent = checkData(data[row].birthDate);
    modalHouse.textContent = checkData(data[row].house);
    modalWizard.textContent = checkData(data[row].wizard);
    modalAncestry.textContent = checkData(data[row].ancestry);
    modalIsStudent.textContent = checkData(data[row].studentOrStaff);
    btnFav.textContent = favorites.some((fav) => fav.name === data[row].name)
      ? 'Remove from favorites'
      : 'Add to favorites';
    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
  }
};

const checkData = function (data) {
  return data ? data : 'unknown';
};

const closeModal = function () {
  backdrop.classList.add('hidden');
  modal.classList.add('hidden');
};

const changeFav = function () {
  if (!favorites.some((fav) => fav.name === data[modalId].name)) {
    favorites.push(data[modalId]);
    btnFav.textContent = 'Remove from favorites';
  } else {
    const index = favorites.findIndex((fav) => fav.name === data[modalId].name);
    favorites.splice(index, 1);
    btnFav.textContent = 'Add to favorites';
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const init = function () {
  btnAll.addEventListener('click', loadStudents);
  btnGryff.addEventListener('click', loadGryff);
  btnSlyth.addEventListener('click', loadSlyth);
  btnHuff.addEventListener('click', loadHuff);
  btnRaven.addEventListener('click', loadRaven);
  nameSort.addEventListener('click', sortName);
  dateSort.addEventListener('click', sortDate);
  houseSort.addEventListener('click', sortHouse);
  table.addEventListener('click', openModal);
  backdrop.addEventListener('click', closeModal);
  btnFav.addEventListener('click', changeFav);
  btnClose.addEventListener('click', closeModal);
};

init();
