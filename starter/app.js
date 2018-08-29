// Budget Controller

var budgetController = (function () {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };



  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      ID = 0;
      if(type === 'exp') {
          newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem; 
    }
  };

})();


//UI Controller

var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  };

  return {
    getinput: function() {
      return {
         type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
         description: document.querySelector(DOMstrings.inputDescription).value,
         value: document.querySelector(DOMstrings.inputValue).value
      }

    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  }
})();

//Global App Controller

var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var Dom = UICtrl.getDOMstrings();

    document.querySelector(Dom.inputButton).addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    // Get filed input data
    var input = UICtrl.getinput();

    // Add the item to the budget Controller

    // Add the item to the UI

    // Calculate the budgetCtrl

    // Display the budget on the UI
  };

  return  {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
