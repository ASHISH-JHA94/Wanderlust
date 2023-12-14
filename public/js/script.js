(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  let taxbutton = document.getElementById("flexSwitchCheckReverse");
  taxbutton.addEventListener("click", () => {
    let Tax = document.getElementsByClassName("Tax");
    for (let tx of Tax) {
      if (window.getComputedStyle(tx).display === "none") {
        tx.style.display = "inline";
      } else {
        tx.style.display = "none";
      }
    }
  });