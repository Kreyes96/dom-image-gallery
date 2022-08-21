import { getData } from './functions.js';

/* Query the Unsplash API. */
function queryAPI(searchTerm) {
   const accessKey = 'zCcnuqW8ytojINkI3P_f_L6Q6ppgv8mO60h7rVN37DY';
   const perPage = 30;

   const url = `https://api.unsplash.com/search/photos/?query=${searchTerm}&per_page=${perPage}&client_id=${accessKey}`;

   fetch(url)
   .then(answer => answer.json())
   .then(data => getData(data))
   .catch(error => console.log(error));
};

export default queryAPI;
