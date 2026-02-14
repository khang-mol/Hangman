/**
 * Handles the display and logic of the category option selection. playGame() is executed after that.
 * @returns {Promise} - returns a promise in the form of Object in the form of: { categoryObjects: [...], groups: [...]}. categoryObjects is an array of arrays of objects.
 */
export async function renderOptionSelection() {
  let groups;
  const allCategories = {selectedCategories: ['animals', 'colors', 'countries', 'fruits', 'maths', 'nobel laureates', 'Pokémon (Gen 1–3)', 'sports']};
  
  const {selectedCategories} = JSON.parse(
    localStorage.getItem('selectedCategories')) 
    || allCategories;

  const listItems = document.querySelector('.category-selector__dropdown');
  const categoryList = [];
  const isCheckedList = [];
  allCategories.selectedCategories.forEach(category => {
    categoryList.push(category);
    let isChecked = selectedCategories.includes(category) ? 'checked' : '';
    isCheckedList.push(isChecked);
  });


  isCheckedList.forEach(checked => {
    const item = document.createElement('li');
    item.classList.add('item');
    if (checked) {item.classList.add(checked)};
    listItems.appendChild(item);
  })
  
  document.querySelectorAll('.item').forEach(child => {
    const checkbox = document.createElement('span');
    checkbox.classList.add('checkbox');
    child.appendChild(checkbox);
  });

  document.querySelectorAll('.checkbox').forEach(child => {
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fa-solid', 'fa-check', 'check-icon');
    child.appendChild(checkIcon);
  });
  
  document.querySelectorAll('.item').forEach((child, i) => {
    const itemText = document.createElement('span');
    itemText.classList.add('item-text');
    itemText.dataset.category = `${categoryList[i]}`;
    itemText.innerText = `${categoryList[i]}`;
    child.appendChild(itemText);
  });

  const categoryButton = document.createElement('button');
  categoryButton.type = "button";
  categoryButton.classList.add('category-submit-button');
  categoryButton.innerText = 'Refresh';
  listItems.appendChild(categoryButton);


  const selectButton = document.querySelector('.category-selector');
  const items = document.querySelectorAll('.item');

  selectButton.addEventListener("click", () => {
    selectButton.classList.toggle("open");
  });

  items.forEach(item => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      loadCategoryPool();

      // let checked = document.querySelectorAll(".checked"),
      // btnText = document.querySelector(".btn-text");
      // if(checked && checked.length > 0){
      //     btnText.innerText = `${checked.length} Selected`;
      // }else{
      //     btnText.innerText = "Select Language";
      // }
    });
  });



  const form = document.forms['category-selector'];
  const submitButton = form.querySelector('.category-submit-button');
  
  /**
   * Stores all the selected categories inside localStorage. Disables the refresh button when no category is selected. Results in an array "groups", which will be handled further.
   * @returns undefined
   */
  function loadCategoryPool() {
    groups = [];
    items.forEach(item => {
      if (!item.classList.contains("checked")) {
        return;
      };
      
      let {category} = item.querySelector('.item-text').dataset;
      groups.push(category);
    });

    if (groups.length === 0) {
      submitButton.disabled = true;
      return;
    } else {
      submitButton.disabled = false;
    };
    
    localStorage.setItem('selectedCategories', 
      JSON.stringify({selectedCategories: groups}));
  };

  // Updates categories
  submitButton.addEventListener("click", () => {
    loadCategoryPool();
    location.reload();
  });



  /**
   * Requests and locates the correct JSON file. (This function is mapped onto every category inside function "processGroupPromises()".)
   * @param {string} category - used to locate the correct JSON file.
   * @returns {Promise} - JSON data for the given category
   */
  async function getCategoryJSON(category) {
    try {
      const myRequest = new Request(`./scripts/data/${category}.json`);
      const response = await fetch(myRequest);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    };
  };

  loadCategoryPool();

  // Alternative to below solution.
  // Promise.all(groups.map(category => getCategoryJSON(category)))
  //   .then(results => console.log(results))
  //   .catch(error => console.log(error));

  /**
   * Wrapper, which handles all the promises to get the category data for hangman.
   * @returns {Object} - Object in the form of { categoryObjects: [...], groups: [...]}. categoryObjects is an array of arrays of objects.
   */
  async function processGroupPromises() {
    try {
      const categoryObjects = await Promise.all(
        groups.map(category => getCategoryJSON(category)));
      return {categoryObjects, groups};
    } catch (error) {
      console.error(error);
    };
  };
  
  return processGroupPromises();
};