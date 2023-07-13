// https://forkify-api.herokuapp.com/v2

import { async } from 'regenerator-runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationViews from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // import module for polifiles
import 'regenerator-runtime/runtime'; // import module for polifiles - async/await

// if (module.hot) {
//   module.hot.accept();
// } // for Parcel - not reload module

//////////////////////////////////////////////////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // cut # slice(1)

    if (!id) return; // when no id

    // visualize spinner when getting data
    recipeView.renderSpinner(); // method from module recipeView

    // 0. Update results view to mark selected serch result (marker)
    resultsView.update(model.getSearchResultPage());

    // 1. Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading recipe
    await model.loadRecipe(id); // loadRecipe() return Promise - need await for go forward

    // 3. Rendering recipe
    recipeView.render(model.state.recipe); // method from module recipeView
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // visualize spinner when getting data
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search result
    await model.loadSearchResults(query);

    // 3. Render result
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4. Render initial pagination buttons
    paginationViews.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Render NEW result
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2. Render NEW pagination buttons
  paginationViews.render(model.state.search);
}; // render new page and pagination button

const controlServings = function (newServigs) {
  // Update recipe servings (in state)
  model.updateServings(newServigs);

  // Update and reneder the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Add / remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Uppload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Reder recipe
    recipeView.render(model.state.recipe);

    // Success massage
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // change URL with new ID when push new recipe

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error('*********', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); //
  recipeView.addHandlerRender(controlRecipes); // subscribe on event in recipeView (load and hashchange event)
  recipeView.addHandlerUpdateServings(controlServings); // subscribe on event + / - for servisings
  recipeView.addHandlerAddBookmark(controlAddBookmark); // // subscribe on event bookmarks
  searchView.addHandlerSearch(controlSearchResults); // subscribe on event in searchView
  paginationViews.addHandlerClick(controlPagination); // subscribe on event in paginationViews
  addRecipeView.addHandlerUppload(controlAddRecipe);
  console.log('Welcome!');
};
init();
