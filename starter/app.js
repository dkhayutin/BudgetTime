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

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      } else {
        ID = 0;
      }


      //Create new item based on 'inc' or 'exp' type
      if(type === 'exp') {
          newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push into data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    calculateBudget: function() {
      // Calculate sum of all income and expenses

      calculateTotal('exp');
      calculateTotal('inc');

      // Caclulate budget: income - expenses

      data.budget = data.totals.inc - data.totals.exp;

      // Calculate % of income that we spend
      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1; 
      }

    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };

})();


//UI Controller

//UI Controller
var UIController = (function () {

  var Domstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list'
  };

  return {
      getInput: function () {
          return {
              type: document.querySelector(Domstrings.inputType).value,
              description: document.querySelector(Domstrings.inputDescription).value,
              value: parseFloat(document.querySelector(Domstrings.inputValue).value)
          };
      },

      addListItem: function(obj, type) {
         var html, newHtml, element;
          // Create HTML string with placeholder Text
          if (type == 'inc'){
              element = Domstrings.incomeContainer;
             html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

          } else if (type =='exp') {
              element = Domstrings.expensesContainer;
             html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

          // Replace the placeholder text with actual data

          newHtml = html.replace('%id%, obj.id');
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);
          // Insert the HTML into the DOM

          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      },

      clearFields: function() {
        var fields = document.querySelectorAll(Domstrings.inputDescription + ', ' + Domstrings.inputValue);

        var fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array) {
          current.value = '';
        });

        fieldsArr[0].focus();
      },

      getDOMstrings: function () {
          return Domstrings;
      }
  };

})();

// Global APP Controller
var controller = (function (budgetCtrl, UICntrl) {

  var setupEventListeners = function () {

      var DOM = UICntrl.getDOMstrings();
      document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function (event) {

          if (event.keyCode === 3 || event.which === 13) {
              ctrlAddItem();
          }

      });
  };

  var updateBudget = function() {
    // 1. Calculate the budget

    budgetCtrl.calculateBudget();

    // 2. Return the budget

    var budget = budgetCtrl.getBudget();
    // 3. Disblay the Budget

    console.log(budget);
  }

  var ctrlAddItem = function () {
      var input, newItem;

      // 1. Get the field input date

        input = UICntrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
          // 2. Add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

          // 3. Add the new Item to the UI

          UICntrl.addListItem(newItem, input.type);

          //4. Clear Fields

          UICntrl.clearFields();

          //5. Calculate and Update the budget
          updateBudget();
        }

  };

  return  {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();
