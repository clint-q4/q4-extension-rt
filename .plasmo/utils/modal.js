import {getCurrentTabLink} from '../../content';

export const modalFunctions = () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  async function openNewFromModal ($el) {
    getCurrentTabLink($el);
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const createNew = $trigger.classList.contains('create-new-button');
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      console.log('$trigger', $trigger)
      console.log(createNew, $trigger.classList);
      createNew ? openNewFromModal($target) : openModal($target);
    });
  });


  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button.cancel') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
  // });
}