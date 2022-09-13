import { searchForm, searchTerm, gridGallery } from './selectors.js';
import queryAPI from './api.js';

/* FUNCTIONS. */
export function showImages(e) {
   e.preventDefault();

   searchValidate();
};

let currentPage = 1;
function searchValidate() {
   if(!searchTerm.value) {
      showErrorAlert('You must enter a search term.');
      return;
   } else {
      cleanHTML(gridGallery);
      queryAPI(searchTerm.value, currentPage);
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
   const { total, results, total_pages } = data;

   if(!total) {
      showErrorAlert('Your search could not be found.');
   } else {
      createCardContainer(results);
      
      let pagesPager = getPagesPager(total_pages);
      createPager(pagesPager);
   };
};

function createCardContainer(results) {
   results.forEach(result => {
      const { alt_description, likes, urls: { regular }, user: { username, profile_image: { small } } } = result;
   
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card-container');
      cardContainer.onclick = () => {
         displayModal(result);
      };

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

function createCardUserInfo(userName, userImageProfile) {
   const userInfo = document.createElement('div');
   userInfo.classList.add('card-user-info');
   userInfo.innerHTML = `
      <div class="user-image-container">
         <img src=${userImageProfile} class="user-image">
      </div>

      <span class="user-text">${userName}</span>
   `;

   return userInfo;
};

function createCardLikesInfo(likes) {
   const likesInfo = document.createElement('div');
   likesInfo.classList.add('card-likes-info');
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

export function displayModal(result) {
   const { urls: { regular }, user} = result;
   
   const body = document.querySelector('body');

   const modalFigure = createModalFigure(regular);
   const modalUserInfo = createModalUSerInfo(user);

   const modal = document.createElement('div');
   modal.classList.add('modal');

   const modalWrapper = document.createElement('div');
   modalWrapper.classList.add('modal-wrapper');
   modalWrapper.onclick = () => modalWrapper.remove();

   modal.appendChild(modalFigure);
   modal.appendChild(modalUserInfo);
   modalWrapper.appendChild(modal);
   body.appendChild(modalWrapper);
};

function createModalFigure(src) {
   const modalFigure = document.createElement('figure');
   modalFigure.classList.add('modal-figure');
   modalFigure.style.margin = '0';
   modalFigure.innerHTML = `
      <img src="${src}" class="modal-image">
   `;

   return modalFigure;
};

function createModalUSerInfo(user) {
   const { name, first_name, username, bio, location, links: { html }, profile_image: { medium }, total_collections, total_likes, total_photos } = user;
   
   const modalUserInfo = document.createElement('div');
   modalUserInfo.classList.add('modal-user-info');
   modalUserInfo.innerHTML = `
      <a href="${html}" class="modal-user-link" target="_blank">
         <div class="modal-user-info-firstBlock">
            <img src="${medium}" class="modal-user-image">
         
            <div>
               <p class="modal-user-name">${name}</p>
               <p class="modal-user-userName">@${username}</p>
            </div>
         </div>
      </a>

      <div class="modal-user-info-secondBlock">
         <span>About ${first_name}:</span>
         <P class="modal-user-bio">${(!bio) ? 'Nothing written yet.' : bio}</P>
      </div>

      <div class="modal-user-info-thirdBlock">
         <span>Location:</span>
         <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="modal-user-iconLocation" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>
            <P class="modal-user-location">${(!location) ? 'Location not yet specified.' : location}</P>
         </div>         
      </div>

      <div class="modal-user-info-fourthBlock">
         <span>${first_name}'s facts:</span>

         <div class="modal-user-moreContainer">
            <div class="modal-user-moreItem" title="${first_name}'s photos.">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="modal-user-moreIcon"><path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM256 128c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/></svg>

               <span class="modal-user-moreText">${total_photos}</span>
            </div>

            <div class="modal-user-moreItem" title="${first_name}'s likes.">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="modal-user-moreIcon"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>

               <span class="modal-user-moreText">${total_likes}</span>
            </div>

            <div class="modal-user-moreItem" title="${first_name}'s collections.">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="modal-user-moreIcon"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>

               <span class="modal-user-moreText">${total_collections}</span>
            </div>
         </div>
      </div>
   `;
   
   return modalUserInfo;
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

function* getPagesPager(totalPages) {
   for(let i = 1; i <= totalPages; i++) {
      yield i;
   };
};

function createPager(pagesPager) {
   const pager = document.querySelector('.pager');
   cleanHTML(pager);

   while(pagesPager) {
      const { value, done } = pagesPager.next();

      if(done) {
         return;
      } else {
         const pageNumber = document.createElement('a');
         pageNumber.href = '#';
         pageNumber.classList.add('page-number')
         pageNumber.dataset.page = value;
         pageNumber.textContent = value;
         pageNumber.onclick = (e) => {
            e.preventDefault();

            currentPage = value;

            cleanHTML(gridGallery);
            queryAPI(searchTerm.value, currentPage);
         };
         
         pager.appendChild(pageNumber);
      };
   };
};
