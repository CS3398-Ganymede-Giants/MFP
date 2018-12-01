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
            sum += parseInt(currentElement.value);
        });
        // store the totals in the data object
        data.totals[type] = sum;
    };


    // //james's code 
    // //need to load these with the retrieved data instead

    // //making the variable return a promise I can resolve top level 
    // var data = async () => {
    //     return await loadExpenseIncomeTbls()
    // }

    // //resolving the promise 
    // data().then(returnedData => {
    //     //formatting data 
    //     //spltting expenses and income

    //     console.log("BEFORE ESPENSE")
    //     var expense = returnedData.expense 

    //     console.log("BEFORE INCOME")
    //     var income = returnedData.income

    //     console.log("BEFORE DATA")

    //     //making data object 
    //     data = {
    //         allItems: {
    //             exp: expense, //[],
    //             inc: income//[]
    //         },
    //         totals: {
    //             exp: expense.length,//0,
    //             inc: income.length //0
    //         },
    //         budget: 0,
    //         percentage: -1 // because evaluated as non-existent
    //     };

    //     console.log("AFTER DATA")

    // })


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
        addItem: function (type, desc, val, addingNewItem = true) {
            console.log("IN add item first controller")

            var newItem, ID;
            // create new ID
            //TODO: need to change to the highest loaded id 
            console.log(type)
            console.log(typeof type)
            console.log(data.allItems[type])
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
            console.log("\n\nadding to data.allItems\n\n")
            console.log(newItem)
            // add new exp or inc to the end of the allItems.exp or allItems.inc array
            //lazy code 
            if (newItem != undefined) {
                data.allItems[type].push(newItem);
            }
            


            ///////// james's code
            //saving to database code 
            console.log("SAVING DATA ")
            console.log(addingNewItem)
            if(addingNewItem == true) {
                saveNewItem(newItem, type)
            }
            // saveNewItem(newItem, type)
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
        dateLabel: '.budget__title--month'//,
        // inputAccount: '.add__account'
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
            console.log("ADD LIST ITEM")
            console.log(obj)
            console.log(type)
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
            console.log("CHANGED TYPE")
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


        //james's code 
        //going to try to save the budget stuff here 
        saveBudgetAsync(budget)
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
    var controlAddItem = function (expense_income_loaded = -1, expense_or_income_sent = -1) {
        //optional param check 
        if (expense_income_loaded != -1 && expense_or_income_sent != -1) {
            console.log("if 1")

            //4am code 
            if(expense_income_loaded == JSON.stringify({})) {
                // data[expense_or_income_sent]
                data.allItems[expense_or_income_sent] = []
                return
            } else {
                // declare variables
                var newItem = -1; //,input;
                
                //skipping 1
                // 2. Add the item to the budget controller
                //scope issue 
                var amountValue = -1;
                if(expense_or_income_sent == 'exp') {
                    amountValue = expense_income_loaded.cost_amount
                } else {
                    amountValue = expense_income_loaded.income_amount
                }
                console.log("TEST")
                newItem = budgetCntrl.addItem(expense_or_income_sent, expense_income_loaded.description, amountValue, false);

                //skipping the rest if it's an empty object 
                if (expense_income_loaded != {}) {
                    console.log("new item")
                    console.log(newItem)
                    // 3. Add the new item to the UI
                    UICntrl.addListItem(newItem, expense_or_income_sent);
                    // 4. Clear the fields
                    UICntrl.clearFields();
                    // 5. Calculate and update the budget
                    updateBudget();
                    // 6. Calculate and update expense percentages
                    updateExpPercentages();
                }

                //exit 
                return 
            }

            
        } else {
            // console.log("after if 1")
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
    

    //james's code
    //getting rows indiviually 
    async function loadExpenseIncomeTbls(callback) {
        console.log("loadExpenseIncomeTbls...")
        //getting expense data 
        var expense = await loadItemsAsync('individual_expense_tbl')
        //parsing 
        expense = JSON.parse(expense)
        //map array 

        //getting income data 
        var income = await loadItemsAsync('individual_income_tbl')
        // console.log(income)
        //parsing 
        income = JSON.parse(income)
        //map array 
        // income = income.map(row => parseInt(row.cost_amount))
        

        //dataObj to return 
        var dataObj = {income: income, expense: expense}

        //callback?
        callback && callback(dataObj)

    }

    async function loadItemsAsync(tbl) {

        //javascript await 
        var response = await loadItems(tbl);
        //sending back
        return response;
    }
    
    
    //Loading function
    function loadItems(tbl) {
        //GET req to node server to grab data from individual_expense_tbl to populate table etc with 
    
        //vars 
        var baseUrl = "http://localhost:8080"
        // var baseUrl = "https://ganymede18.herokuapp.com"
        //user id from cookies 
        var user_id_val = getCookie("user_id")
    
        //need to make a GET and return json 
        //url from base 
        var url = baseUrl + '/loaddata/all/' + user_id_val + '/' + tbl
        console.log("URL IS ")
        console.log(url)
    
        
        //return promise 
        return new Promise(resolve => {
            //fetch 
            // Default options are marked with *
            fetch(url, {
                method: "GET", 
                mode: "same-origin",
                // mode: "cors", // no-cors, cors, *same-origin
                // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                // redirect: "follow", // manual, *follow, error
                // referrer: "no-referrer", // no-referrer, *client
                // body: postBody, // body data type must match "Content-Type" header
            })
            .then(response => {
                //parsing response
                //resolving
                resolve(response.json())
            }); // parses response to JSON
        })
    
    
    
    }

    
    // create a public initialization function
    // return in an object to make public
    return {
        init: function (dataObj = -1) {
            //console.log('Application has begun.');
            UICntrl.displayMonth();

           //dataObj maybe has data to use
            //if it's -1 it's a new user 
            if (dataObj == -1) {
                console.log("INIT EMPTY")
                //init empty
                UICntrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0, //totalExpenses,
                    percentage: -1
                });
            } else {
                //init full
                console.log("INIT FULL")
                UICntrl.displayBudget({
                    budget: dataObj.budget, //budget, //0,
                    totalInc: dataObj.totalIncome,
                    totalExp: dataObj.totalExpenses, //totalExpenses,
                    percentage: -1
                });
                
            }

            

            //event listeners
            setUpEventListeners();

            //james's code 
            //load stuff and add items 
            loadExpenseIncomeTbls(function(dataObj) {
                console.log("Made it this far?...")
                //loaded data 
                var expense = dataObj.expense
                var income = dataObj.income 
                console.log(expense)
                console.log(income)


                //need to call controlAddItem 
                //will just send objects and do formatting there 
                //expenses 
                if (expense.length != 0) {
                    for(let obj of expense) {
                        console.log("loaded expense added")
                        controlAddItem(obj, 'exp', false)
                        // testFunc()
                    }
                }
                //incomes
                if (income.length != 0) {
                    for(let obj of income) {
                        controlAddItem(obj, 'inc', false)
                        // testFunc()
                    }
                }
                
            })
        }
    }



})(budgetController, UIController, window);

//james's added code 
//main


// load saved data in if any
//get saved data 
loadBudgetInit(function(allData) {
    //budget 
    console.log("load trackingPage.html")
    
    var budget = allData.budget
    budget = JSON.parse(budget)
    budget = budget[0]
    budget = budget.sum
    

    //data object 
    var dataObj = { /*totalExpenses: sum,*/ budget: budget}

    console.log("Data object loading first")
    console.log(dataObj.budget)

    //could be empty 
    if (dataObj.budget == null) {
        //send it empty data 
        console.log("SENDING EMPTY")
        controller.init()
    } else {
        // send it full data
        // begin the app or nothing will ever run because the event listeners are in a private function
        controller.init(dataObj);
    }

    
   

})


//adding code down here to not mess with other code for now 

//vars 
var baseUrl = "http://localhost:8080"
// var baseUrl = "https://ganymede18.herokuapp.com"


//saving function
function saveNewItem(newItem, type) {
    console.log("SAVE ITEM")
    //need to make post request 
    //url 
    // var url = 'http://localhost:8080/posts'
    var url = baseUrl + '/saveexpense'
    // var url = 'https://ganymede18.herokuapp.com/posts'

    //need: expense_id, expense_type_id, user_id, description, cost_amount
    //newItem has expense_id, description, cost_amount
    //sent var type is expense_type_id
    //need to get user_id
    //in cookies 
    var user_id_val = getCookie("user_id")

    //need to get the db to save to
    //storing 
    var db = ''
    //changing post body for each table
    var postBody = {}
    if (type == 'inc') {
        //database to store in
        db = 'individual_income_tbl'
        //postbody to send 
        postBody = {
            //['income_id', 'account_id', 'description', 'income_amount']
            // 'income_id': newItem.id,
            'description': newItem.description, 
            'income_amount': newItem.value, 
            // 'account_id': 1, //TODO: change
            'user_id': user_id_val,
            'db': db,
            'account_type': "Checking" //TODO change
        }
    } 
    if (type == 'exp') {
        db = 'individual_expense_tbl'
        //postbody to send 
        postBody = {
            //['expense_id', 'expense_type_id', 'user_id', 'description', 'cost_amount']
            // 'expense_id': newItem.id,
            'expense_type_id': 1, //TODO: change
            'user_id': user_id_val,
            'description': newItem.description,
            'cost_amount': newItem.value,
            'db': db

        }
    }
    if (type == 'budget') {
        //database to store in
        db = 'account_tbl'
        //account_id | user_id | account_type | balance | balance_goal | monthly_payment 
        //postbody to send 
        postBody = {

            'account_id': 1, //TODO: change
            'user_id': user_id_val,
            'account_type': "Checking",
            'balance': newItem.budget, 
            'balance_goal': 0, //TODO: change
            'monthly_payment': 0, //TODO change
            'db':db
        }
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


async function saveBudgetAsync(budget) {
    // console.log("savebudgetasync")
    //sent the budget object from other code 
    //await saveBudget 
    await saveBudget(budget)
}

function saveBudget(budget) {
    //need to send the budget data over
    // console.log("savebudget")
    // console.log("BUDGET IS ")
    // console.log(budget)

}


async function loadBudgetAsync() {
    //javascript await 
    var response = await loadBudget();
    //sending back
    return response;
}

function loadBudget() {
    //vars 
    
    var baseUrl = "http://localhost:8080"
    // var baseUrl = "https://ganymede18.herokuapp.com"
    //user id from cookies 
    var user_id_val = getCookie("user_id")

    //need to make a GET and return json 
    //url from base 
    var url = baseUrl + '/loadbudget/' + user_id_val + '/'

    console.log("here")
    //return promise 
    return new Promise(resolve => {
        //fetch 
        console.log("here")
        // Default options are marked with *
        fetch(url, {
            method: "GET", 
            mode: "same-origin",
            // mode: "cors", // no-cors, cors, *same-origin
            // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            // redirect: "follow", // manual, *follow, error
            // referrer: "no-referrer", // no-referrer, *client
            // body: postBody, // body data type must match "Content-Type" header
        })
        .then(response => {
            console.log("here")
            // console.log("RESPONSE")
            // console.log(response.data)
            resolve(response.json())
        }); // parses response to JSON
    })

}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }


  function buildUrl(url, parameters) {
    let qs = "";
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const value = parameters[key];
            qs +=
                encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
    }
    if (qs.length > 0) {
        qs = qs.substring(0, qs.length - 1); //chop off last "&"
        url = url + "?" + qs;
    }
    console.log("URL IS ")
    console.log(url)
    return url;
}


//need to get all data
//damnit need to consolidate this code 
async function loadBudgetInit(callback) {
    //probably get cookie from browser here 
    //getting account_tbl data 
    
    var budget = await loadBudgetAsync()

    //object to return 
    var allData = {"budget": budget}// , "expense": expense }//, "income": income}

    //callback
    callback && callback(allData)

    // return allData
    
}

