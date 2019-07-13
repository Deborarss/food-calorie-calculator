// Storage Controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    storeItem: function(item) {
      let items;
      // Check if has any items in local storage
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set localstorage
        localStorage.setItem('items', JSON.stringify(items));
      } else { 
        // Get what is already in localstorage
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item
        items.push(item);
        // Re set localstorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      // Check if has any items in local storage
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id) {
          // Remove item and replace it with the updatedItem
          items.splice(index, 1, updatedItem);
        }
      }); 
      // Re set local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(id === item.id) {
        // Remove item
        items.splice(index, 1);
        }     
      });
      // Re set local storage
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const state = {
    // items: [
    //    {id: 0, name: 'Feijoada', calories: 1000},
    //    {id: 1, name: 'Pizza de Calabresa', calories: 800},
    //    {id: 2, name: 'Brigadeiro', calories: 400}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, calories) {
      // console.log(name, calories);

      let ID;
      // Create ID
      if(state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      state.items.push(newItem);

      return newItem;

    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      state.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function(item) {
        if(item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids
      ids = state.items.map(function(item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },
    clearAllItems: function() {
      state.items = [];
    },
    getCurrentItem: function() {
      return state.currentItem;
    },
    setCurrentItem: function(item) {
      state.currentItem = item;
    },
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and add cals
      state.items.forEach(function(item){
        total += item.calories;
      });

      // Set total cal in state
      state.totalCalories = total;
      // Return total
      return state.totalCalories;
    },
    logData: function() {
      return state;
    }
  }

})();

// UI Controller
const UICtrl = (function() {

  // UI Selectors 
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calorias</em>
        <a href="#" class="secondary-content">
          <i class="edit-item material-icons">edit</i>
        </a>
      </li>`;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add Class
      li.className = ' collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calorias</em>
      <a href="#" class="secondary-content">
        <i class="edit-item material-icons">edit</i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);
      
      // Loop through list items
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calorias</em>
          <a href="#" class="secondary-content">
            <i class="edit-item material-icons">edit</i>
          </a>`; 
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.addBtn).style.display = 'none'; 
    },
    getSelectors: function() {
      return UISelectors;
    }
  }

})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // console.log(ItemCtrl.logData());

  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button events
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // console.log('add'); 

    // Get form input from UI Controller
    const input = UICtrl.getItemInput(); 
    // console.log(input);    

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);  
      // Add item to UI List
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();       
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // console.log('update');   
    
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete item submit
  const itemDeleteSubmit = function(e) {
    // console.log('Deleting...');
    
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from state
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    // Hide list if we don't have any items
    if(ItemCtrl.getItems().length === 0) {
      UICtrl.hideList();
    }

    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function(e) {
    // Delete all items from state
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Hide UL
    UICtrl.hideList();

    // Remove from UI
    UICtrl.removeItems();

    // Clear items from local storage
    StorageCtrl.clearItemsFromStorage();
    
    e.preventDefault();
  }

  // Click edit item 
  const itemEditClick = function(e) {
    // console.log('test'); 
    
    if(e.target.classList.contains('edit-item')) {
      // console.log(('edit item'));     
      
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;
      // console.log(listId); 

      // Break into an array
      const listIdArr = listId.split('-');
      // console.log(listIdArr);      

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // console.log(itemToEdit);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Public Methods
  return {
    init: function() {
      // console.log('Initializing App');    

      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from state
      const items = ItemCtrl.getItems();

      // Check if has any items
      if(items.length === 0) {
        UICtrl.hideList();       
      } else {
       // Populate list with items
        UICtrl.populateItemList(items); 
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();