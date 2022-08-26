import { searchForm, searchTerm, gridGallery } from './selectors.js';
import queryAPI from './api.js';

/* FUNCTIONS. */
export function showImages(e) {
   e.preventDefault();

   searchValidate();
};

function searchValidate() {
   if(!searchTerm.value) {
      showErrorAlert('You must enter a search term.');
      return;
   } else {
      cleanHTML(gridGallery);
      queryAPI(searchTerm.value);
   };
};

export function showErrorAlert(message) {
   const alertExist = document.querySelector('.alert');

   if(!alertExist) {
      const alert = document.createElement('div');
      alert.classList.add('alert');
      alert.textContent = message;
   
      searchTerm.style.borderColor = '#ff0000';
   
      searchForm.appendChild(alert);
   
      setTimeout(() => {
         alert.remove();
      }, 2500);
   };
};

function cleanHTML(element) {
   while(element.firstChild) {
      element.removeChild(element.firstChild);
   };
};

export function getData(data) {
   const { results } = data;

   createCardContainer(results);
};

function createCardContainer(results) {
   results.forEach(result => {
      const { alt_description, likes, urls: { regular }, user: { username, profile_image: { small } } } =  result;
   
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');
      cardContainer.onclick = displayModal;

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('card-info');

      cardInfo.appendChild(createCardUserInfo(username, small));
      cardInfo.appendChild(createCardLikesInfo(likes));

      cardContainer.appendChild(createCardImage(regular, alt_description, alt_description));
      cardContainer.appendChild(cardInfo);

      addCardImageToGrid(cardContainer);
   });
};

function createCardImage(src, alt, title) {
   const img = document.createElement('img');
   img.classList.add('card-image');
   img.loading = 'lazy';
   img.src = src;
   img.alt = alt;
   img.title = title;

   return img;
};

function createCardUserInfo(userName, userProfile) {
   const userInfo = document.createElement('div');
   userInfo.classList.add('user-info');
   userInfo.innerHTML = `
      <div class="user-image-container">
         <img src=${userProfile} class="user-image">
      </div>

      <span class="user-text">${userName}</span>
   `;

   return userInfo;
};

function createCardLikesInfo(likes) {
   const likesInfo = document.createElement('div');
   likesInfo.classList.add('likes-info');
   likesInfo.innerHTML = `
      <svg 
         xmlns="http://www.w3.org/2000/svg" 
         class="likes-image h-5 w-5" 
         viewBox="0 0 20 20" 
         fill="currentColor">
         <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
      </svg>

      <span class="likes-text">${likes}</span>
   `;

   return likesInfo;
};

function addCardImageToGrid(card) {
   const gridGallery = document.querySelector('#grid-gallery');
   gridGallery.classList.add('grid-gallery');

   gridGallery.appendChild(card);
};

export function displayModal(e) {
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
   modalWrapper.onclick = () => modalWrapper.remove();

   const closeBtn = document.createElement('button');
   closeBtn.classList.add('close-btn');
   closeBtn.textContent = 'X';
   closeBtn.onclick = () => modalWrapper.remove();
   
   figure.appendChild(closeBtn);
   modal.appendChild(figure);
   modalWrapper.appendChild(modal);
   body.appendChild(modalWrapper);
};

export function showSpinner() {
   const spinner = document.createElement('div');
   spinner.classList.add('spinner');
   spinner.innerHTML = `
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
   `;

   gridGallery.appendChild(spinner);
};
