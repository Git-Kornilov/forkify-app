import icons from 'url:../../img/icons.svg'; // for import Parcel 2 icons to distr folder
import View from './View.js';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully upload';

  _window = document.querySelector('.add-recipe-window');

  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // for addEventListener 'this' is this._btnOpen (BTN with action), you need bind correct 'this' - .bind(this) - current object
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUppload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // new FormData() - API work with forms
      const data = Object.fromEntries(dataArr); // make {} from []
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new addRecipeView();
