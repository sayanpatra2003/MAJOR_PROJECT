console.log("validation js loaded");

(() => {
  'use strict'

  // Select all forms that need validation
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over forms
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      // Check form validity
      if (!form.checkValidity()) {
        event.preventDefault()   // stop form submit
        event.stopPropagation()  // stop bubbling
      }

      // Add Bootstrap validation classes
      form.classList.add('was-validated')
    }, false)
  });
})();
