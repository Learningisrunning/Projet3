
/*Gestion de la fenêtre modal */
const openModal = function(e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    target.setAttribute('aria-hidden', false)
    target.setAttribute('aria-modal', true)

}

document.querySelectorAll('.js-modal').forEach(a =>{
    var Test = a.addEventListener('click', openModal)
    console.log(Test)
   
})