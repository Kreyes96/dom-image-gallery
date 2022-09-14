import { getData, showSpinner } from './functions.js';

/* Query the Unsplash API. */
async function queryAPI(searchTerm, currentPage) {
   const accessKey = 'zCcnuqW8ytojINkI3P_f_L6Q6ppgv8mO60h7rVN37DY';
   const perPage = 30;

   const url = `https://api.unsplash.com/search/photos/?query=${searchTerm}&page=${currentPage}&per_page=${perPage}&client_id=${accessKey}`;
   
   try {
      showSpinner();

      const query = await fetch(url);
      const answer = await query.json();
      
      getData(answer);
   } catch(error) {
      console.log(error);
   };
};

export default queryAPI;
