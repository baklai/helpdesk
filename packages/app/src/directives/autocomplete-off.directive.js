export const vAutocompleteOff = {
  mounted(el) {
    const getElements = el => Array.from(el.querySelectorAll('input, select, textarea'));

    const disable = () => {
      const elements = getElements(el);
      elements.forEach(el => el.setAttribute('readonly', 'readonly'));
      setTimeout(() => {
        elements.forEach(el => el.removeAttribute('readonly'));
      }, 500);
    };

    disable();
  }
};
