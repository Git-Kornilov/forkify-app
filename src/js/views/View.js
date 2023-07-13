import icons from 'url:../../img/icons.svg'; // for import Parcel 2 icons to distr folder

export default class View {
  _data;

  /// jsdoc - add documentation comments directly to your source code //////////
  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string istead to rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Alex (thanks Jonas)
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); // convert string `newMarkup` into real DOM-objects (virtual DOM)
    const newElements = Array.from(newDOM.querySelectorAll('*')); // NodeList all elements, then in []

    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // current DOM elements

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      // Update change TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      } // compare Node-elements real and virtual DOM - isEqualNode(), then check only node.text element - firstChild?.nodeValue - for change only new numbers/text in elements

      // Update change attributes (DATA-attributes in btn)
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) // change attributes in elements, like data in btns - from newEl to curEl
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
		<div class="spinner">
			<svg>
				<use href="${icons}#icon-loader"></use>
			</svg>
		</div> 
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
