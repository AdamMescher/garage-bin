const appendItemToList = item => $('.garage__list').append(`
  <li id=${item.id} class="garage__list-item">
    <h2 >${item.name}</h2>
    <p>reason: <span>${item.reason}</span></p>
    <p>cleanliness: <span>${item.cleanliness}</span></p>
  </li> `);

const updateGarageItemStats = (total, sparkling, dusty, rancid) => {
  if (!total) {
    $('.item-stats').append(`
      <p class="item-stats__total">
        Total Items: 
        <span class="item-stats__total--count"></span>
      </p>
      <p class="item-stats__sparkling">
        Sparkling items:
        <span class="item-stats__sparkling--count"></span>
      </p>
      <p class="item-stats__dirty">
        Dusty items:
      </p>
      <p class="item-stats__rancid">
        Rancid items:
        <span class="item-stats__rancid--count"></span>
      </p>
  `);
  }
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
      response.items.map((item) => {
        appendItemToList(item);
      });
      const total = response.items.length;
      const sparkling = response.items.filter(item => item.cleanliness === 'Sparkling').length;
      const dusty = response.items.filter(item => item.cleanliness === 'Dusty').length;
      const rancid = response.items.filter(item => item.cleanliness === 'Rancid').length;

      updateGarageItemStats(total, sparkling, dusty, rancid);
    })
    .catch(error => console.log(error));
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

function newItemButtonClick(event) {
  event.preventDefault();
  const name = $('.new-item__form__name').val();
  const reason = $('.new-item__form__reason').val();
  const cleanliness = $('.new-item__form__select').val();

  const body = { name, reason, cleanliness };
  const postBody = buildPostFetchPayload(body);

  fetch('/api/v1/items', postBody)
    .then(response => response.json())
    .then(() => {
      appendItemToList(body);
    })
    .catch(error => console.error(error));
  
  
  updateGarageItemStats();
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

$('.garage__list').on('click', '.garage__list-item', listItemClick);
$('.garage-door__button').on('click', garageDoorButtonClick);
$('.new-item__form__submit').on('click', newItemButtonClick);
$('.new-item__form__name, .new-item__form__reason').keyup(enableButton);

// on page load
fetchAllItemsInGarage();
updateGarageItemStats();
