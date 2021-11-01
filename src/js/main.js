const formInput = document.querySelector('.form__input');
const formBtn = document.querySelector('.form__btn');
const formCheck = document.querySelector('.form__check');

// подписка


[formInput, formCheck].forEach(item => {
  item.addEventListener('input', () => {
    if (formInput.value !== '' && formCheck.checked == true) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', true);
    }
  })
})
