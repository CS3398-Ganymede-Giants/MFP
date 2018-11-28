// BUDGET CONTROLLLER
var budgetController = (function () {
    // create a function constructor for income and expense types
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        // only calculate if Income is greater than zero
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        // use this method to return the calculated percentage
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        // add all values in the array depending on if it's 'exp' or 'inc'
        data.allItems[type].forEach(function(currentElement){
            sum += currentElement.value;
        });
        // store the totals in the data object
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
        percentage: -1 // because evaluated as non-existent
    };
    // create public method to allow other modules to add new items to the data structure
    return {
        addItem: function (type, desc, val) {
            var newItem, ID;
            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // create new item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val);
            }
            // add new exp or inc to the end of the allItems.exp or allItems.inc array
            data.allItems[type].push(newItem);


            ///////// james's code
            //saving to database code 
            saveNewItem(newItem, type)
            /////////

            // return the new item
            return newItem;
        },
        // delete item public method
        deleteItem: function(type, id) {
            // declare the variables
            var ids, index;
            // create a new array
            ids = data.allItems[type].map(function(currentElement){
                return currentElement.id;
            });
            // find the index of the element to delete from the new array ids
            // returns index of the id passed through
            index = ids.indexOf(id);
            // now delete that item from the array
            // if not found, it will return -1
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate percentage of income that has already been spent
            if (data.totals.inc > 0){
                // if income > 0, then calculate the percent expenses
                data.percentage = Math.round( (data.totals.exp / data.totals.inc) * 100 );
            } else {
                // display nothing
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            // calculate % for each item stored in the expenses array
            data.allItems.exp.forEach(function(currentVar){
                currentVar.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            // must loop over all the expenses to call on each of the expense objects
            // use .map to return something new
            var allPercentages = data.allItems.exp.map(function(currentEl){
                // loops through each element and returns the getPercentage method
                return currentEl.getPercentage();
            });
            // return the variable
            return allPercentages;
        },

        getBudget: function(){
            // this method will just return the budget items
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        // this method is just for testing purposes
        testing: function () {
            console.log(data);
        }
    }
})();

// UI CONTROLLER
var UIController = (function () {
    // create private variable/object to store DOM strings
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    // private function
    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num); // find abs value of the number
        num = num.toFixed(2); // make num exactly 2 decimals
        // this is now a string, so use split
        numSplit = num.split('.');
        // find the integer
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        // find the decimal
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // private function within UI controller
    var nodeListForEach = function(list, callbackFn) {
                for (var i = 0; i < list.length; i++) {
                    // current is the item in the array
                    // i is the index
                    // in each iteration, the callback function gets called
                    callbackFn(list[i], i);
                }
    };

    // return an object that contains a method to get input values
    return {
        getInput: function () {
            return { // return an object with three properties instead of having 3 separate variables
                type: document.querySelector(DOMstrings.inputType).value, // will be either income or expense
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // the reads a string, so need to convert to a number
            };
        },

        addListItem: function (obj, type) {
            // declare variables
            var html, newHtml, element;
            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%\t</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">del</i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%\t</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">del</i></button></div></div></div>'
            }
            // replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            // convert list to array.
            // since querySelectorAll returns a string, use Array.prototype to call .slice and then bind the this variable to fields using .call
            fieldsArray = Array.prototype.slice.call(fields);
            // use .foreach method that works like the for loop
            // the anonymous function in the .foreach method can receive up to 3 arguments
            fieldsArray.forEach(function(currentValue, index, array){
                // set the value of the currentValue to empty
                currentValue.value = "";
            });
            // set the focus back to the description element when cleared
            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            if (obj.budget > 0) {
                type = 'inc';
            } else {
                type = 'exp';
            }
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            // if there's a percentage, display it, if it's -1, then display something else
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentagesArr) {
            var fields = document.querySelectorAll(DOMstrings.expPercentageLabel); // this returns a node list
            // loop through
            // create your own foreach function for node lists so it's reusable for any nodelist
            nodeListForEach(fields, function(current, index){
                if (percentagesArr[index] > 0) {
                    // display percentages
                    current.textContent = percentagesArr[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;
            now = new Date();
            // note: month is zero based, so use 11 to get December; 12 will return Jan 25, 2017
            // var Christmas = new Date(2016, 11, 25);
            months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            //console.log(fields);
            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        // pass DOMstrings object to the global app controller
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCntrl, UICntrl) {
    // private function that sets up the event listeners
    var setUpEventListeners = function () {
        var DOM = UICntrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', controlAddItem);
        document.addEventListener('keypress', function (event) {
            // use .which to add support for older browsers
            if (event.keyCode === 13 || event.which === 13) {
                controlAddItem();
            }
        });
        // use event delegation to the parent .container
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        // use change event to update highlight color of input fields for expense entries
        document.querySelector(DOM.inputType).addEventListener('change', UICntrl.changedType);
    };

     var updateBudget = function(){
        // 1. Calculate the budget
        budgetCntrl.calculateBudget();
        // 2. Return the budget
        var budget = budgetCntrl.getBudget();
        // 3. Display the budget on the UI
        // console.log(budget);
        // pass the budget object as a parameter to the displayBudget method b/c it's looking for an obj argument
        UICntrl.displayBudget(budget);
    };

    var updateExpPercentages = function() {
        // 1. Calculate percentages
        budgetCntrl.calculatePercentages();
        // 2. Read percentages from budget controller
        var percentages = budgetCntrl.getPercentages();
        // 3. Update the UI
        // console.log(percentages); // this is an array
        UICntrl.displayPercentages(percentages);
    };

    // private function that gets called when we want to add a new item
    var controlAddItem = function () {
        // declare variables
        var input, newItem;
        // 1. Get the field input data when enter key or button is clicked
        input = UICntrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            // 3. Add the new item to the UI
            UICntrl.addListItem(newItem, input.type);
            // 4. Clear the fields
            UICntrl.clearFields();
            // 5. Calculate and update the budget
            updateBudget();
            // 6. Calculate and update expense percentages
            updateExpPercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        // use parentNode to traverse up the DOM and then get the unique #id#
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // target = i.ion-ios-close-outline
        if (itemID) {
            // inc-# or exp-#
            // use split - JS converts string to an Object and will return and array
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); // use parseInt to convert the string '1' to number 1
        }
        // 1. delete item from data structure
        budgetCntrl.deleteItem(type, ID);
        // 2. delete item from UI
        UICntrl.deleteListItem(itemID);
        // 3. Update and show the new budget
        updateBudget();
        // 4. Calculate and update expense percentages
        updateExpPercentages();
    };
    
    // create a public initialization function
    // return in an object to make public
    return {
        init: function () {
            //console.log('Application has begun.');
            UICntrl.displayMonth();
            // set initial budget to zero upon application start
            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }
})(budgetController, UIController);
// begin the app or nothing will ever run because the event listeners are in a private function
controller.init();




//adding code down here to not mess with other code for now 

//vars 
var baseUrl = "http://localhost:8080"

//saving function
function saveNewItem(newItem, type) {
    //need to make post request 
    //url 
    // var url = 'http://localhost:8080/posts'
    var url = baseUrl + '/saveexpense'
    // var url = 'https://ganymede18.herokuapp.com/posts'



    //values to send 
    // var select =  document.getElementById("addExpenseSelect").value;
    // var desc = document.getElementById("addExpenseDescription").value;
    // var val = document.getElementById("addExpenseValue");
    // //type is sent for now 
    
    //need: expense_id, expense_type_id, user_id, description, cost_amount
    //newItem has expense_id, description, cost_amount
    //sent var type is expense_type_id
    //need to get user_id
    //in cookies 
    var user_id_val = getCookie("user_id")

    


    //json body 
    var postBody = {
        expense_id: newItem.id,
        expense_type_id: type,
        user_id: user_id_val,
        description: newItem.description,
        cost_amount: newItem.value
    }

     // Default options are marked with *
     return fetch(url, {
        method: "POST", 
        // mode: "cors", // no-cors, cors, *same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        // redirect: "follow", // manual, *follow, error
        // referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(postBody), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON

}



function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }