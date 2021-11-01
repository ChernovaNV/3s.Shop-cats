// scroll to top

let btnTop = document.querySelector('.btn__to-top');

function btnReveal() { 
  console.log()
    if ( window.scrollY >= 300) {
      btnTop.classList.add('to-top__is-visible');
    } else {
      btnTop.classList.remove('to-top__is-visible');
    }    
  }  

  function TopscrollTo() {
    if(window.scrollY !=0) {
      setTimeout(function() {
        window.scrollTo(0,window.scrollY-10);
        TopscrollTo();
      }, 5);
    }
  }

  
  window.addEventListener('scroll', btnReveal);
  btnTop.addEventListener('click', TopscrollTo);  

btnReveal();