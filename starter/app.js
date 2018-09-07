// Budget Controller

var budgetController = (function () {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }

  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

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

    deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

    calculatePercentages: function() {

      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc  );
      });

    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage()
      });
      return allPerc;
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
      expensesContainer: '.expenses__list',
      budgetLabel: ".budget__value",
      incomeLabel: ".budget__income--value",
      expenseLabel: ".budget__expenses--value",
      percentageLabel: ".budget__expenses--percentage",
      container: ".container",
      expensesPercLabel: ".item__percentage",
      dateLabel: ".budget__title--month"

  };

  var formatNumber =  function(num, type) {

    num = Math.abs(num);
    num = num.toFixed(2);

  var numSplit = num.split('.');
  var int = numSplit[0];
  var dec = numSplit[1];
  if(int.length > 3) {
     int = int.substr(0, int.length - 3) +',' + int.substr(int.length -3, 3)

  }

  dec = numSplit[1];

  return (type === 'exp' ?  '-' : '+') + ' ' + int + '.' + dec;
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
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

          } else if (type =='exp') {
              element = Domstrings.expensesContainer;
             html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

          // Replace the placeholder text with actual data

          newHtml = html.replace('%id%, obj.id');
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
          // Insert the HTML into the DOM

          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      },

      deleteListItem: function(selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
      },

      clearFields: function() {
        var fields = document.querySelectorAll(Domstrings.inputDescription + ', ' + Domstrings.inputValue);

        var fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array) {
          current.value = '';
        });

        fieldsArr[0].focus();
      },

      displayBudget: function(obj) {

        obj.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(Domstrings.budgetLabel).textContent = formatNumber(obj.budget,type) ;
        document.querySelector(Domstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(Domstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
        document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage;

        if(obj.percentage > 0 ) {
          document.querySelector(Domstrings.percentageLabel).textContent = obj.percentage + '%';

        } else {
          document.querySelector(Domstrings.percentageLabel).textContent = '---'
        }


      },

      displayPercentages: function(percentages) {

        var fields = document.querySelectorAll(Domstrings.expensesPercLabel);

        var nodeListForEach = function(list, callback) {
          for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
          }
        };

        nodeListForEach(fields, function(current, index){
          if(percentages[index] > 0) {
            current.textContent = percentages[index] + '%'
          } else {
            current.textContent = '---'
          }

        });

      },

      displayMonth: function() {

        var now = new Date();

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        var month = now.getMonth();

        var year = now.getFullYear();
        document.querySelector(Domstrings.dateLabel).textContent = months[month] + ' ' + year;
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

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budget

    budgetCtrl.calculateBudget();

    // 2. Return the budget

    var budget = budgetCtrl.getBudget();
    // 3. Disblay the Budget

    UICntrl.displayBudget(budget);
  };

  var updatePercentages = function() {

    // 1. Calculate percentages

    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller

    var percentages = budgetCtrl.getPercentages()

    // 3. Update UI with new percentages

    UICntrl.displayPercentages(percentages);

  };

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

          //6. Calculate and update percentages

          updatePercentages();
        }

  };

  var ctrlDeleteItem = function(event){
      var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            //1. delete the item from the data structure.
            budgetCtrl.deleteItem(type, id);

            //2. delete the item from the UI.
            UICntrl.deleteListItem(itemID);

            //3. update and show the new object.

            updateBudget();

            //4. Calculate and update percentages

            updatePercentages();

        }
    };

  return  {
    init: function() {
      console.log('Application has started');
      UICntrl.displayMonth();
      UICntrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init();
