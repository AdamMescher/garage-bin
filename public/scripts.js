const appendItemToList = item => $('.garage__list').append(`
  <li id=${item.id} class="garage__list-item">
    <h2 >${item.name}</h2>
    <p>reason: <span>${item.reason}</span></p>
    <p>cleanliness: <span>${item.cleanliness}</span></p>
  </li> `);

const fetchAllItemsInGarage = () => {
  fetch('api/v1/items')
    .then(response => response.json())
    .then((response) => {
      response.items.map((item) => {
        appendItemToList(item);
      });
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

function newItemButtonClick(event) {
  event.preventDefault();
  const name = $('.new-item__form__name').val();
  const reason = $('.new-item__form__reason').val();
  const cleanliness = $('.new-item__form__select').val();
  const postBody = {
    
  }
}

$('.garage__list').on('click', '.garage__list-item', listItemClick);
$('.garage-door__button').on('click', garageDoorButtonClick);
$('.new-item__form__submit').on('click', newItemButtonClick);


// on page load
fetchAllItemsInGarage();
