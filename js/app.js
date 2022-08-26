import { searchForm, searchTerm } from './selectors.js';
import { showImages, showErrorAlert } from './functions.js';

/* START APP */
document.addEventListener('DOMContentLoaded', () => {
   searchForm.addEventListener('submit', showImages);
   searchTerm.addEventListener('keyup', () => {
      if(!searchTerm.value) {
         searchTerm.style.borderColor = '#ff0000';
         showErrorAlert('Try enter a topic of your interest.');
      } else {
         searchTerm.style.borderColor = '#4b134f';
      };
   });
});
