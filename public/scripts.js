/* eslint no-console: 0 */
const appendItemToList = item => $('.garage__list').append(`
  <li id=${item.id} class="garage__list-item">
    <h2 >${item.name}</h2>
    <p>reason: <span>${item.reason}</span></p>
    <p>cleanliness: <span>${item.cleanliness}</span></p>
  </li> `);

const updateGarageItemStats = (total, sparkling, dusty, rancid) => {
  $('.item-stats p').remove();
  $('.item-stats').append(`
    <p class="item-stats__total">
      Total Items: 
      <span class="item-stats__total--count">${total}</span>
    </p>
    <p class="item-stats__sparkling">
      Sparkling items:
      <span class="item-stats__sparkling--count">${sparkling}</span>
    </p>
    <p class="item-stats__dirty">
      Dusty items:
      <span class="item-stats__dirty--count">${dusty}</span>
    </p>
    <p class="item-stats__rancid">
      Rancid items:
      <span class="item-stats__rancid--count">${rancid}</span>
    </p>
  `);
};

const fetchAllItemsInGarage = async () => {
  await fetch('api/v1/items')
    .then(response => response.json())
    .then((response) => {
      response.items.map(item => appendItemToList(item));
      const total = response.items.length;
      const sparkling = response.items.filter(item => item.cleanliness === 'Sparkling').length;
      const dusty = response.items.filter(item => item.cleanliness === 'Dusty').length;
      const rancid = response.items.filter(item => item.cleanliness === 'Rancid').length;

      updateGarageItemStats(total, sparkling, dusty, rancid);
    })
    .catch(error => console.error(error));
};

const garageDoorButtonClick = () => {
  $('.garage-door').slideToggle('slow', () => {
    $('.garage__list').toggleClass('hidden');
  });
};

function listItemClick() {
  const id = $(this).attr('id');
}

const clearInputFields = () => {
  $('.new-item__form__name').val('');
  $('.new-item__form__reason').val('');
  $('.new-item__form__select').val('');
};

const buildPostFetchPayload = body => ({
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify(body),
});

async function newItemButtonClick(event) {
  event.preventDefault();
  const name = $('.new-item__form__name').val();
  const reason = $('.new-item__form__reason').val();
  const cleanliness = $('.new-item__form__select').val();

  const body = { name, reason, cleanliness };
  const postBody = buildPostFetchPayload(body);

  await fetch('/api/v1/items', postBody)
    .then(response => response.json())
    .then(() => {
      appendItemToList(body);
    })
    .catch(error => console.error(error));

  await fetch('/api/v1/items')
    .then(response => response.json())
    .then((response) => {
      const total = response.items.length;
      const sparkling = response.items.filter(item => item.cleanliness === 'Sparkling').length;
      const dusty = response.items.filter(item => item.cleanliness === 'Dusty').length;
      const rancid = response.items.filter(item => item.cleanliness === 'Rancid').length;

      updateGarageItemStats(total, sparkling, dusty, rancid);
    })
    .catch(error => console.error(error));
  clearInputFields();
}

const enableNewItemSubmitButton = () => {
  $('.new-item__form__submit').removeAttr('disabled');
};

const disableNewItemSubmitButton = () => {
  $('.new-item__form__submit').attr('disabled', true);
};

function enableButton() {
  if (($('.new-item__form__name').val() !== '') && ($('.new-item__form__reason').val() !== '')) {
    enableNewItemSubmitButton();
  } else {
    disableNewItemSubmitButton();
  }
}

const sortAscending = (a, b) => {
  const itemA = a.name.toUpperCase();
  const itemB = b.name.toUpperCase();

  let comparison = 0;
  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }
  return comparison;
};

const sortDescending = (a,b) => {
  const itemA = a.name.toUpperCase();
  const itemB = b.name.toUpperCase();

  let comparison = 0;
  if (itemA > itemB) {
    comparison = 1;
  } else if (itemA < itemB) {
    comparison = -1;
  }
  return comparison * -1;
};



const listSortButtonClick = () => {
  $('li').remove();
  fetch('api/v1/items')
    .then(response => response.json())
    .then((response) => {
      if (!$('.garage__list').hasClass('sorted')) {
        const sorted = response.items.sort(sortAscending);
        $('li').remove();
        sorted.map(item => appendItemToList(item));
        $('.garage__list').toggleClass('sorted');
      } else {
        const sorted = response.items.sort(sortDescending);
        $('li').remove();
        sorted.map(item => appendItemToList(item));
        $('.garage__list').toggleClass('sorted');
      }
    })
    .catch(error => console.error(error));
};

$('.garage__list').on('click', '.garage__list-item', listItemClick);
$('.garage-door__button').on('click', garageDoorButtonClick);
$('.new-item__form__submit').on('click', newItemButtonClick);
$('.new-item__form__name, .new-item__form__reason').keyup(enableButton);
$('.sort-button').on('click', listSortButtonClick);
// on page load
fetchAllItemsInGarage();
