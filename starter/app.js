var budgetController = (function () {
  var x = 23;
  var add = function(a) {
    return x + a
  }
  return {
    publicTest: function(b) {
      return (add(b));
    }
  }
})();

//UI budgetController

var UIController = (function(){


})();

//App budgetController

var controller = (function(budgetCtrl, UICtrl) {
  var z = budgetCtrl.publicTest(5)
  return {
    anotherpublic: function() {
      console.log(z)
    }
  }

})(budgetController, UIController);
