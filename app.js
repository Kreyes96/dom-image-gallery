/* EVENTS. */
document.addEventListener('DOMContentLoaded', showImages);

/* FUNCTIONS. */
function showImages() {
   createCardImage()
};

function createCardImage() {
   let cards = [];

   for(let i = 1; i <= 10; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.onclick = displayModal;

      const img = document.createElement('img');
      img.classList.add('image');
      img.src = `images/${i}.jpg`;
      img.title = `Image #${i}`;

      card.appendChild(img);

      cards.push(card); 
   };

   addCardImageToGrid(cards);
};

function addCardImageToGrid(cards) {
   const gridGallery = document.querySelector('#grid-gallery');
   gridGallery.classList.add('grid-gallery');

   cards.forEach(card => gridGallery.appendChild(card));
};

function displayModal(e) {
   const body = document.querySelector('body');

   const figure = document.createElement('figure');
   figure.classList.add('figure');
   figure.innerHTML = `
      <img src="${e.target.src}" class="modal-image">
   `;
   
   const modal = document.createElement('div');
   modal.classList.add('modal');

   const modalWrapper = document.createElement('div');
   modalWrapper.classList.add('modal-wrapper');

   const closeBtn = document.createElement('button');
   closeBtn.classList.add('close-btn');
   closeBtn.textContent = 'X';
   closeBtn.onclick = () => modalWrapper.remove();
   
   figure.appendChild(closeBtn);
   modal.appendChild(figure);
   modalWrapper.appendChild(modal);
   body.appendChild(modalWrapper);
};
