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

  function openMobileFilter (){
    document.querySelector(selectors.mobileFilter).classList.add(selectors.openMobileFilter);
  }

  function closeMobileFilter (){
    document.querySelector(selectors.mobileFilter).classList.remove(selectors.openMobileFilter);
  }
}
)();