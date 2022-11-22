(function(){
  var selectors = {
    form: '.filter-form'
  };

  if(window.location.pathname == '/search' || window.location.pathname.includes('/collections')){
    document.querySelector(selectors.form).addEventListener('click', (e) => {
      if(e.target.classList.contains('filter-checkbox') || e.target.classList.contains('f_wrap')){
        submitSearchForm();
      }
    })
  }

  function submitSearchForm(){
    var formData = new FormData(document.querySelector(selectors.form));
    const searchParams = new URLSearchParams(formData);

    const currentParams = new URLSearchParams(window.location.search);
    const updatedParams = getUpdatedParams(currentParams, searchParams);

    console.log(updatedParams.toString())
    
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
}
)();