let modal = document.querySelector('.modal');
let modalText = document.querySelector('.modal-favorites__text');
let imgHeart = document.querySelectorAll('.product-card__mark--heart')

// добавление в избранное

cardsContainer.addEventListener('click', function(e) {
  let parent = e.target.parentNode;
  
  if(e.target.classList.contains('imgHeart')) {
    parent.classList.toggle('product-card__mark--heart-checked');
    
    if (parent.classList.contains('product-card__mark--heart-checked')) {
      modalText.textContent = 'Добавлено в избранное';
    } else {
      modalText.textContent = 'Удалено из избранного';
    }
    
    modal.classList.add('modal__open'); 
    setTimeout(function() {
      modal.classList.remove('modal__open')
      }, 2000)
  }

})

