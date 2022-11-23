(function(){
  var selectors = {
    form: '.filter-form',
    mobileFilter: '.filter-form-mobile',
    mobileFilterTrigger: '.filter-form-mobile--trigger',
    clearMobileFilterTrigger: '.active_f_clear',

    openMobileFilter: 'is-open-filter',
    closeMobileFilter: '.close-mobile-filter'
  };

  if(window.location.pathname == '/search' || window.location.pathname.includes('/collections')){
    document.querySelector(selectors.form).addEventListener('click', (e) => {
      if(e.target.classList.contains('filter-checkbox') || e.target.classList.contains('f_wrap')){
        submitSearchForm();
      }
    })

    if(window,innerWidth < 767){
      document.querySelector(selectors.mobileFilterTrigger).addEventListener('click', openMobileFilter);
      document.querySelector(selectors.closeMobileFilter).addEventListener('click', closeMobileFilter);
    }

  }

  function submitSearchForm(){
    var formData = new FormData(document.querySelector(selectors.form));
    const searchParams = new URLSearchParams(formData);

    const currentParams = new URLSearchParams(window.location.search);
    const updatedParams = getUpdatedParams(currentParams, searchParams);
    
    if(window.location.pathname == '/search'){
      window.location.href = '/search?' + updatedParams.toString();
      return;
    } 

    window.location.pathname.includes('/collections') && updatedParams.toString() != '' 
    ? window.location.href = window.location.pathname + '?' + updatedParams.toString()
    : window.location.href = window.location.pathname
  }

  function openMobileFilter (){
    document.querySelector(selectors.mobileFilter).classList.add(selectors.openMobileFilter);
  }

  function closeMobileFilter (){
    document.querySelector(selectors.mobileFilter).classList.remove(selectors.openMobileFilter);
  }
}
)();

var PriceRange = class extends HTMLElement {
  connectedCallback() {
    this.rangeLowerBound = this.querySelector('.price-range__range-group input:first-child');
    this.rangeHigherBound = this.querySelector('.price-range__range-group input:last-child');
    this.textInputLowerBound = this.querySelector('.price-range__input:first-child input');
    this.textInputHigherBound = this.querySelector('.price-range__input:last-child input');
    this.textInputLowerBound.addEventListener('focus', () => this.textInputLowerBound.select());
    this.textInputHigherBound.addEventListener('focus', () => this.textInputHigherBound.select());
    this.textInputLowerBound.addEventListener('change', (event) => {
      event.target.value = Math.max(
        Math.min(
          parseInt(event.target.value),
          parseInt(this.textInputHigherBound.value || event.target.max) - 1
        ),
        event.target.min
      );
      this.rangeLowerBound.value = event.target.value;
      this.rangeLowerBound.parentElement.style.setProperty(
        '--range-min',
        `${(parseInt(this.rangeLowerBound.value) / parseInt(this.rangeLowerBound.max)) * 100}%`
      );
    });
    this.textInputHigherBound.addEventListener('change', (event) => {
      event.target.value = Math.min(
        Math.max(
          parseInt(event.target.value),
          parseInt(this.textInputLowerBound.value || event.target.min) + 1
        ),
        event.target.max
      );
      this.rangeHigherBound.value = event.target.value;
      this.rangeHigherBound.parentElement.style.setProperty(
        '--range-max',
        `${(parseInt(this.rangeHigherBound.value) / parseInt(this.rangeHigherBound.max)) * 100}%`
      );
    });
    this.rangeLowerBound.addEventListener('change', (event) => {
      this.textInputLowerBound.value = event.target.value;
      // this.textInputLowerBound.dispatchEvent(new Event('change', { bubbles: true }));
      this._onFilterChanged();
    });
    this.rangeHigherBound.addEventListener('change', (event) => {
      this.textInputHigherBound.value = event.target.value;
      // this.textInputHigherBound.dispatchEvent(new Event('change', { bubbles: true }));
      this._onFilterChanged();
    });
    this.rangeLowerBound.addEventListener('input', (event) => {
      event.target.value = Math.min(
        parseInt(event.target.value),
        parseInt(this.textInputHigherBound.value || event.target.max) - 1
      );
      event.target.parentElement.style.setProperty(
        '--range-min',
        `${(parseInt(event.target.value) / parseInt(event.target.max)) * 100}%`
      );
      this.textInputLowerBound.value = event.target.value;
    });
    this.rangeHigherBound.addEventListener('input', (event) => {
      event.target.value = Math.max(
        parseInt(event.target.value),
        parseInt(this.textInputLowerBound.value || event.target.min) + 1
      );
      event.target.parentElement.style.setProperty(
        '--range-max',
        `${(parseInt(event.target.value) / parseInt(event.target.max)) * 100}%`
      );
      this.textInputHigherBound.value = event.target.value;
    });
  }

  _onFilterChanged() {
    const formData = new FormData(document.querySelector(".filter-form"));
    const searchParamsAsString = new URLSearchParams(formData);

    if(window.location.pathname == '/search'){
      const currentParams = new URLSearchParams(window.location.search);
      const updatedParams = getUpdatedParams(currentParams, searchParamsAsString);
      window.location.href = '/search?' + updatedParams.toString();
      return;
    } 
    window.location.href = window.location.pathname + '?' + searchParamsAsString;
  }
};
window.customElements.define('price-range', PriceRange);

function getUpdatedParams (currentParams, newParams) {
  const clone = new URLSearchParams(currentParams);
  const preservedParams = ['sort_by', 'q', 'options[prefix]', 'type'];

  // Find what params need to be removed
  // delete happens first as we cannot specify keys based off of values
  for (const [key, value] of clone.entries()) {
    if (!newParams.getAll(key).includes(value) && !preservedParams.includes(key)) {
      clone.delete(key);
    };
  }

  // Find what params need to be added
  for (const [key, value] of newParams.entries()) {
    if (!clone.getAll(key).includes(value) && value !== '') {
      clone.append(key, value);
    }
  }

  return clone;
}
