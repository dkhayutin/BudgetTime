// Budget Controller

var budgetController = (function () {

})();

//UI Controller

var UIController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'

  }

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

  var Dom = UICtrl.getDOMstrings();

  var ctrlAddItem = function() {
    // Get filed input data
    var input = UICtrl.getinput();
    console.log(input);

    // Add the item to the budget Controller

    // Add the item to the UI

    // Calculate the budgetCtrl

    // Display the budget on the UI
  }

  document.querySelector(Dom.inputButton).addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }


  });

})(budgetController, UIController);
