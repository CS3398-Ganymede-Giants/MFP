//vars 
// var baseUrl = "http://localhost:8080"
var baseUrl = "https://ganymede18.herokuapp.com"



// BUDGET CONTROLLLER
var budgetController = (function () {
    //data object
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
        startingBudget: 0,
        percentage: -1, // because evaluated as non-existenta
        accountData: []

    };

    // create a function constructor for income and expense types
    var Expense = function (id, description, cost_amount, expense_type_id, account_type) {
        this.id = id;
        this.description = description;
        this.cost_amount = cost_amount;
        this.percentage = -1;
        this.expense_type_id = expense_type_id;
        this.account_type = account_type;
        this.type = "Expense"

    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        // only calculate if Income is greater than zero
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        // use this method to return the calculated percentage
        return this.percentage;
    };

    var Income = function (id, description, value, expense_type, account_type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.expense_type = expense_type
        this.account_type = account_type
        this.type = "Income"
    };

    var calculateTotal = function (type) {
        var sum = 0;
        //if is expense 
        if (type === 'exp') {
            // add all values in the array depending on if it's 'exp' or 'inc'
            data.allItems[type].forEach(function (currentElement) {
                sum += parseInt(currentElement.cost_amount);
            });
        } else {
            // add all values in the array depending on if it's 'exp' or 'inc'
            data.allItems[type].forEach(function (currentElement) {
                sum += parseInt(currentElement.value);
            });
        }

        // store the totals in the data object
        data.totals[type] = sum;
    };


    

    // //set budget data 
    // var setData = function(budget) {
    //     this.data.budget = budget
    // }

    // create public method to allow other modules to add new items to the data structure
    return {
        //set budget data 
        setData: function (budget) {
            data.startingBudget = budget
            console.log("ADDING BUDGET")
            console.log(data)
        },
        //set account info 
        setAccountData: function(accountData) {
            data.accountData = accountData
        },
        updateBudgetAfterSavingModal: function(budget) {
            // put in data structure 
            //reset to added columns and then add new budget in 
            //using calculate total
            calculateTotal('exp')
            calculateTotal('inc')
            data.budget = budget - data.totals.exp + data.totals.inc
            console.log("UPDATE BUDET AFTER SAVING")
            
            console.log(data)
            console.log(data.budget)
            // console.log(budget)
        },
        addItem: function (type, desc, val, expense_type_id = -1, account_type = "-2", addingNewItem = true) {
            console.log("IN add item first controller")

            var newItem, ID;
            // create new ID
            //TODO: need to change to the highest loaded id 
            // console.log(type)
            // console.log(typeof type)
            // console.log(data.allItems[type])
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // create new item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, desc, val, expense_type_id, account_type);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val, expense_type_id, account_type);
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
            // console.log("SAVING DATA ")
            // console.log(newItem)
            if (addingNewItem == true) {
                saveNewItem(newItem, type)
                //add to graph?
                // loadGraphs(data.allItems.exp)
                updateGraphNewItem(newItem)
                // updateLineChartNewItem(data)
                // addData('expenseBreakdown', newItem)
            }
            /////////

            // return the new item
            return newItem;
        },
        // delete item public method
        deleteItem: function (type, id) {
            // declare the variables
            var ids, index;
            // create a new array
            ids = data.allItems[type].map(function (currentElement) {
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

        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate budget: income - expenses
            //james's code 
            // console.log("CALCULATING BUDGET")
            // console.log(data)
            // console.log(data.allItems.exp.length)
            // console.log(data.allItems.inc.length)
            //need to add the pre sent budget if there's no inc or exp
            // if (data.allItems.exp.length == 0 && data.allItems.inc.length == 0) {
            //     console.log("SDLKFJ")
                
            data.budget = data.totals.inc - data.totals.exp + data.startingBudget
            // } else {
            //     data.budget = data.totals.inc - data.totals.exp
            // }
            console.log(data.budget)
            

            // calculate percentage of income that has already been spent
            if (data.totals.inc > 0) {
                // if income > 0, then calculate the percent expenses
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                // display nothing
                data.percentage = -1;
            }

        },

        calculatePercentages: function () {
            // calculate % for each item stored in the expenses array
            data.allItems.exp.forEach(function (currentVar) {
                currentVar.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            // must loop over all the expenses to call on each of the expense objects
            // use .map to return something new
            var allPercentages = data.allItems.exp.map(function (currentEl) {
                // loops through each element and returns the getPercentage method
                return currentEl.getPercentage();
            });
            // return the variable
            return allPercentages;
        },

        getBudget: function () {
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
    var formatNumber = function (num, type) {
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
    var nodeListForEach = function (list, callbackFn) {
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
            // console.log("ADD LIST ITEM")
            // console.log(obj)
            // console.log(type)
            // declare variables
            var html, newHtml, element;
            //temp
            var sentValue;
            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%\t</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">del</i></button></div></div></div>'
                sentValue = obj.value
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%\t</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">del</i></button></div></div></div>'
                sentValue = obj.cost_amount
            }
            // replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(sentValue, type));
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            // convert list to array.
            // since querySelectorAll returns a string, use Array.prototype to call .slice and then bind the this variable to fields using .call
            fieldsArray = Array.prototype.slice.call(fields);
            // use .foreach method that works like the for loop
            // the anonymous function in the .foreach method can receive up to 3 arguments
            fieldsArray.forEach(function (currentValue, index, array) {
                // set the value of the currentValue to empty
                currentValue.value = "";
            });
            // set the focus back to the description element when cleared
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
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

        displayPercentages: function (percentagesArr) {
            var fields = document.querySelectorAll(DOMstrings.expPercentageLabel); // this returns a node list
            // loop through
            // create your own foreach function for node lists so it's reusable for any nodelist
            nodeListForEach(fields, function (current, index) {
                if (percentagesArr[index] > 0) {
                    // display percentages
                    current.textContent = percentagesArr[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function () {
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

        changedType: function () {
            // console.log("CHANGED TYPE")
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            //console.log(fields);
            nodeListForEach(fields, function (current) {
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

    var updateBudget = function () {
        // 1. Calculate the budget
        budgetCntrl.calculateBudget();
        // 2. Return the budget
        var budget = budgetCntrl.getBudget();
        // 3. Display the budget on the UI
        // console.log(budget);
        // pass the budget object as a parameter to the displayBudget method b/c it's looking for an obj argument
        // console.log(budget)
        UICntrl.displayBudget(budget);

    };

    var updateExpPercentages = function () {
        // 1. Calculate percentages
        budgetCntrl.calculatePercentages();
        // 2. Read percentages from budget controller
        var percentages = budgetCntrl.getPercentages();
        // 3. Update the UI
        // console.log(percentages); // this is an array
        UICntrl.displayPercentages(percentages);
    };

    // private function that gets called when we want to add a new item
    var controlAddItem = function (expense_income_loaded = -1, expense_or_income_sent = -1, addingNewItem) {
        //optional param check 
        
        if (expense_income_loaded != -1 && expense_or_income_sent != -1) {
            // console.log("if 1")

            //4am code 
            if (expense_income_loaded == JSON.stringify({})) {
                // data[expense_or_income_sent]
                data.allItems[expense_or_income_sent] = []
                return
            } else {
                // declare variables
                var newItem = -1; //,input;
                //getting the expense type 
                // var expense_type = document.getElementById("select_expense_type").value
                // var expense_type = expense_income_loaded.account_type

                //skipping 1
                // 2. Add the item to the budget controller
                //scope issue 
                var amountValue = -1;
                if (expense_or_income_sent == 'exp') {
                    amountValue = expense_income_loaded.cost_amount
                } else {
                    amountValue = expense_income_loaded.income_amount
                }
                // console.log("TEST\n\n\n\n\n")
                // console.log(expense_type)
                newItem = budgetCntrl.addItem(expense_or_income_sent, expense_income_loaded.description, parseInt(amountValue), expense_income_loaded.expense_type_id,  expense_income_loaded.account_type, false);
                // console.log("NEW ITEM")
                // console.log(newItem)
                //skipping the rest if it's an empty object 
                if (expense_income_loaded != {}) {
                    // console.log("new item")
                    // console.log(newItem)
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
                //get value 
                var expense_type_id = document.getElementById("select_expense_type").selectedIndex;
                
                //getting the expense type 
                var account_type = document.getElementById("select_account_type").value
                //making new item
                newItem = budgetCntrl.addItem(input.type, input.description, input.value, expense_type_id, account_type);
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

    var ctrlDeleteItem = function (event) {
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
    async function loadExpenseIncomeTbls(/*callback*/) {
        // console.log("loadExpenseIncomeTbls...")
        //getting expense data 
        var expense = await loadItemsAsync('individual_expense_tbl')
        //parsing 
        expense = JSON.parse(expense)
        //formatting 
        var newExpense = []
        for (let e of expense) {
            newExpense.push({ expense_id: e.expense_id, expense_type_id: e.expense_type_id - 1, user_id: e.user_id, description: e.description, cost_amount: e.cost_amount, timestamp: e.timestamp, account_type:e.account_type, timestamp:e.timestamp })
        }
        console.log("SECOND LOADED")
        // console.log(expense)
        //map array 

        //getting income data 
        var income = await loadItemsAsync('individual_income_tbl')
        // console.log(income)
        //parsing 
        income = JSON.parse(income)
        console.log(income)
        //map array 
        // income = income.map(row => parseInt(row.cost_amount))

        //need to get account_tbl data here too?
        var accountData = await(loadItemsAsync('account_tbl'))
        //should have rows of data 
        console.log("\n\naccount data is \n\n")
        console.log(accountData)


        //dataObj to return 
        var dataObj = { income: income, expense: newExpense, accountData: accountData }

        //callback?
        // callback && callback(dataObj)
        return dataObj

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

        //user id from cookies 
        var user_id_val = getCookie("user_id")

        //need to make a GET and return json 
        //url from base 
        var url = baseUrl + '/loaddata/all/' + user_id_val + '/' + tbl
        // console.log("URL IS ")
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
        init: async function (dataObj) {
            //console.log('Application has begun.');
            UICntrl.displayMonth();

            // //just initializing with 0 again 
            // UICntrl.displayBudget({
            //     budget: 0,
            //     totalInc: 0,
            //     totalExp: 0, //totalExpenses,
            //     percentage: -1
            // });


            //event listeners
            setUpEventListeners();

            //james's code 
            //load stuff and add items 
            var dataObj = await loadExpenseIncomeTbls()
            console.log("DATAOBJ IS ")
            console.log(dataObj)
            // loadExpenseIncomeTbls(function (dataObj) {
            // console.log("Made it this far?...")
            //loaded data 
            var expense = dataObj.expense
            var income = dataObj.income
            var accountData = JSON.parse(dataObj.accountData)
            // console.log("loaded expenses were:")
            // console.log(expense)
            // console.log("loaded incomes were:")
            // console.log(income)

            console.log("ACCOUNT DATA IS")
            console.log(accountData)
            
            //summing budget 
            var startingBudget = 0;
            for(let a of accountData) {
                console.log(a.account_type)
                console.log(typeof a.account_type)
                console.log(a.account_type === "Credit")
                // if (a.account_type === "Credit") {
                    // startingBudget = startingBudget - parseInt(a.balance)
                // } else {
                    startingBudget = startingBudget + parseInt(a.balance)
                // }
            }
            console.log("STARTIND BUDGET IS ")
            console.log(startingBudget)

            //just initializing with 0 again 
            UICntrl.displayBudget({
                budget: startingBudget,
                totalInc: 0,
                totalExp: 0, //totalExpenses,
                percentage: -1
            });

            //set data structure budget first 
            budgetCntrl.setData(startingBudget)
            budgetCntrl.setAccountData(accountData)

            //calculate budget here?
            updateBudget()


            //need to call controlAddItem 
            //will just send objects and do formatting there 
            //expenses 
            if (expense.length != 0) {
                for (let obj of expense) {
                    console.log("loaded expense added")
                    console.log(obj)
                    controlAddItem(obj, 'exp', false)
                    // testFunc()
                }
            }
            //incomes
            if (income.length != 0) {
                for (let obj of income) {
                    controlAddItem(obj, 'inc', false)
                    // testFunc()
                }
            }

            //load graphs here
            //send it expense and income
            // loadGraphs(expense, income)
            //don't waste time loading graphs when resetting balances and goals
            // console.log("CLASS NAME IS ")
            // console.log(document.getElementById("everything_besides_modal").className)
            if (document.getElementById("everything_besides_modal").className === "everything_besides_modal_blur") {
                //don't load graphs
                loadGraphs(expense, income, accountData)
            } else {
                loadGraphs(expense, income, accountData)
            }

            // })
        },
        resetAfterSavingModal(balance) {
            //just update the budget with the info?
            console.log("reset after saving modal")
            console.log(balance)
            //process info 
            var savedNewBudget = 0;
            
            savedNewBudget += parseInt(balance['Checking'])
            console.log(parseInt(balance['Checking']))
            savedNewBudget += parseInt(balance['Savings'])  
            console.log(parseInt(balance['Credit']))
            savedNewBudget += parseInt(balance['Credit'])            
            console.log(savedNewBudget)

            budgetCntrl.updateBudgetAfterSavingModal(savedNewBudget)


            var budget = budgetCntrl.getBudget();
            // 3. Display the budget on the UI
            // console.log(budget);
            // pass the budget object as a parameter to the displayBudget method b/c it's looking for an obj argument
            // console.log(budget)
            UICntrl.displayBudget(budget);

        }
    }



})(budgetController, UIController, window);

//james's added code 
//main
// send it 0 because loading saved expenses/income is done through using the controlAddItem function through the above code
// begin the app or nothing will ever run because the event listeners are in a private function
// var dataObj = loadExpenseIncomeTbls()
controller.init();




//Database functions:
//for graphs
var expenseBreakdown;
var financeLineChart;
function loadGraphs(expense, income, accountData) {
    //TODO: customize more
    console.log("In LOAD GRAPHS")
    console.log(expense)


    //what charts to load?
    //1: expense category breakdown 
    //2: progress to goal


    //Expense BreakDown Pie Chart first
    //getting the graph from the html after it's loaded 
    var ctx = document.getElementById("expenseBreakdown").getContext('2d');

    //data object 
    // var data = {} //expense values from db // OR 0 if new user!
    var data = processPieChart(expense)

    //creating the chart
    expenseBreakdown = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Expense Breakdown'
            }
        }
    });

    //update?
    expenseBreakdown.update()


    //Line chart
    //now to load the line chart data 
    var newCtx = document.getElementById("financeLineChart").getContext('2d')

   
    //colors 
    var chartColors = {
        red: "#db3e00",
        blue: "#004dcf",
        lightBlue: "#8ed1fc",
        lightGreen: "#13e66c",
        green: "#06cf5a"
    }

    //need to format data to get:
    //for each account type:
    //all dates/times in order 
    // var datesTimesLabel = []
    //BUDGET VALUES after inputting each expense/income sorted left to right by date
    //y-value of budget green goal, should just be top of graph to red goal 
    //y-value of red goal, should be finance goal for checking and savings

    //trying it out
    var data2 = formatLineChart(expense, income, accountData, "Checking")
    var data3 = formatLineChart(expense, income, accountData, "Savings")
    var data4 = formatLineChart(expense, income, accountData, "Credit")
    console.log("RETURND DTA IS ")
    
    console.log(data2)
    console.log(data3)
    console.log(data4)
    

    
    //setting just the data
    var lineChartData = {
        // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Checking',
            borderColor: chartColors.red,
            backgroundColor: chartColors.red,
            fill: false,
            data: data2,
            // yAxisID: 'y-axis-1',
        },{
            label: 'Savings',
            borderColor: chartColors.blue,
            backgroundColor: chartColors.blue,
            fill: false,
            data: data3,
            // yAxisID: 'y-axis-1',
        }, {
            label: 'Credit',
            borderColor: chartColors.green,
            backgroundColor: chartColors.green,
            fill: false,
            data: data4,
            // yAxisID: 'y-axis-1',
        }

          
        ]
    };
    console.log("CREATING GRAPH")
    console.log(lineChartData)

    // window.onload = function () {
        //creating the graph
        // var ctx = document.getElementById('financeLineChart').getContext('2d');
        financeLineChart = Chart.Line(newCtx, {
            data: lineChartData,
            options: {
                title: {
                    display: true,
                    text: 'Account Balances'
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        time: {
                            unit: 'hour'
                        },
                        ticks: {
                            autoSkip: false,
                            source: 'auto'
                        },
                        gridLines: {
                            display: true
                        }

                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        gridLines: {
                            display: true
                        }
                    }]
                }
            }
            
        });
        financeLineChart.update()
    // };


}

//need to get data for lineChart 
function formatLineChart(expense, income, accountData, account_type) {
    //http request to something for sure
    //need to get all of the inputted income/expense data 
    //already have that
    //need to get finance goal data 

    //when loading saved data 
    //expense is expense[x].account_type
    //income is same 
    //account data is same 

    //vars 
    var allForAccountTypeArr = []
    //accountData has account types paired with id's
    // var account_id; 
    // for (let o of accountData) {
    //     if(o['account_type'] === account_type) {
    //         account_id = o['account_id']
    //     }
    // }

    //adding to array 
    //expense and income 
    console.log("expense")
    console.log(expense)
    expense.map(obj => {
        //if account id matches 
        if(obj.account_type === account_type) {
            allForAccountTypeArr.push({ time: obj.timestamp, amount: obj.cost_amount * -1 })
        }
        
    })
    //incoem 
    console.log("INCOME")
    console.log(income)
    income.map(obj => {
        if (obj.account_type === account_type) {
            allForAccountTypeArr.push({time:obj.timestamp, amount:obj.income_amount})
        }
    })

    //now sort 
    var sortedDates = allForAccountTypeArr.sort(function (var1, var2) {
        var a = new Date(var1.time), b = new Date(var2.time);
        if (a > b)
            return 1;
        if (a < b)
            return -1;

        return 0;
    });

    console.log("SORTED DATA IS")
    console.log(sortedDates)

    //x-axis of graph 
    // var first = new Date(sortedDates[sortedDates.length - 1].time)
    // var last = new Date(sortedDates[0].time)
    // var range = first - last
    // / 1000
    // range = parseFloat(range)/parseFloat(1000) // range / 1000
    // range = precise(range)
    // var range = Date(sortedDates[sortedDates.length - 1].timestamp) - Date(sortedDates[0].timestamp)
    // console.log("RANGE IS ")
    // console.log(first)
    // console.log(last)
    // console.log(range)
    //if range < 86400 then data is less than a day, show hours
    // if range < 3600 then data is less than an hour, show minutes 
    // var rangeMins = precise(parseFloat(range) / parseFloat(60))
    //can store date objects 
    console.log("typeof")
    console.log(typeof sortedDates)

    //vars 
    var budgetTracker = 0

    var finalCoordinateDates = []
    for (let obj of sortedDates) {
        var temp = {}
        // var sentDate = 
        var manipDate = new Date(obj.time)

        //add a day to the date
        // manipDate.setDate(manipDate.getDate() + 0.25);
        temp.t =  manipDate
        //tracker 
        budgetTracker = budgetTracker +  parseInt(obj.amount)
        temp.y = budgetTracker
        // temp.amount = obj.amount
        finalCoordinateDates.push(temp)
    }
    console.log(finalCoordinateDates)

    //return 
    return finalCoordinateDates

    // data = [{
    //     x: 0.10,
    //     y: 0.20
    // }, {
    //     x: 0.15,
    //     y: 0.10
    // }]

}

//minor pre processing 
function precise(x) {
    return Number.parseFloat(x).toPrecision(4);
}
function updateLineChartNewItem(data) {

}
function updateGraphNewItem(newItem) {
    // console.log("EXPENSE SENT IS ")
    // console.log(expense)
    //vars to store
    // var newExpense = []
    // //need to preprocess 
    // var labelArray = ["Auto", "Home", "Food", "Entertainment"]
    // for (let e of data.allItems.exp) {
    //     e.expense_type = labelArray[e.expense_type]
    //     //push
    //     newExpense.push(e)
    // }

    //updating directly?
    //for expense break down nedd 
    //if expense 
    var amount;
    if(newItem.type === "Expense") {
        amount = newItem.cost_amount
        expenseBreakdown.data.datasets[0].data[0] = parseInt(expenseBreakdown.data.datasets[0].data[0]) + parseInt(newItem.cost_amount)
        console.log("LIFE IS PAIN")
        console.log(expenseBreakdown.data.datasets[0].data)
        expenseBreakdown.update()
    } else {
        amount = newItem.value
    }

    //if credit 
    if(newItem.account_type === 'Credit') {
        amount = amount 
    } else {
        amount = amount * -1
    }

    //for linechart
    var helperObj = {
        "Checking":0,
        "Savings": 1, 
        "Credit": 2
    }
    console.log("IN TTESTING")
    console.log(newItem.account_type)
    console.log(helperObj[newItem.account_type])
    //adding to the dataset
    //obj to add 
    //dates 
    // var currentDate = new Date()
    // var manipDate = currentDate.addHours(6)


    // var manipDate = new Date();
    // var newTime = new Date() + 6;//manipDate.getTime()
    d = new Date();
    d.setHours(d.getHours() + 6);

    //add a day to the date
    // manipDate.setDate(manipDate.getDate() + 0.25);

    var length = financeLineChart.data.datasets[helperObj[newItem.account_type]].data.length
   
    // console.log(financeLineChart.data.datasets[helperObj[newItem.account_type]].data[length - 1])
    // console.log(currentDate)
    //need to store value + previous value intead of just value 
    
    // console.log(manipDate)
    
    var lastValue;
    //if not 0
    if (length != 0) {
        lastValue = financeLineChart.data.datasets[helperObj[newItem.account_type]].data[length - 1].y
    } else {
        lastValue = 0
    }
    
    // console.log(lastValue)
    var newObj = { t: d, y: amount + lastValue}
    
    financeLineChart.data.datasets[helperObj[newItem.account_type]].data[length] = newObj
    financeLineChart.update()
    financeLineChart.update()
    // console.log(financeLineChart.data.datasets[helperObj[newItem.account_type]].data)
    

    //need to change 
    //labels 
    // nestedLabels = ["Auto", "Home", "Food", "Entertainment"]

    // //init to 0
    // var expenseTypes = [0, 0, 0, 0]
    // //iterating
    // for (let indivExpense of dataRows) {
    //     console.log("INDIV")
    //     console.log(indivExpense)
    //     //sum into expensetypes [index - 1]
    //     expenseTypes[indivExpense.expense_type_id] += parseInt(indivExpense.cost_amount)
    //     console.log(expenseTypes)
    //     //sum into expensetypes 
    //     //might have expense_type need expense index
    //     // expenseTypes[]
    // }
    // //store again 
    // nestedData = expenseTypes












    //now call function
    // console.log("NEW DATA IS")
    // console.log(newExpense)
    //income processing 
    // var newIncome = []
    // for (let i of data.allItems.inc) {
    //     // newIncome.push()
    //     console.log("NEW INCOME")
    //     console.log(i)
    //     newIncome.push(i)
    // }
    // var accountData = data.accountData

    //updating graphs?
    // loadGraphs(newExpense, newIncome, accountData)
}





//
async function saveModalData() {
    //get values from html 
    //modal-checking
    //modal-credit-initial
    //getting initial values 
    var initBalances = {
        'Checking': document.getElementById("modal-checking-initial").value,
        'Savings': document.getElementById("modal-savings-initial").value, 
        'Credit': parseInt(document.getElementById("modal-credit-initial").value) * -1
    }

    //finance goals 
    var financeGoals = {
        'Checking': document.getElementById("modal-checking").value,
        'Savings': document.getElementById("modal-savings").value,
        'Credit': document.getElementById("modal-credit").value
    }

    console.log("SAVE MODAL DATA ")
    console.log(initBalances)
    console.log(financeGoals)


    //need to save balance and finance goals 
    var didSetBalances = await updateAccountTbl("balance", initBalances)

    var didSetGoals = await updateAccountTbl("goal", financeGoals)

    //testing whether successful 
    if (didSetBalances.didAdd == false || didSetGoals.didAdd == false) {
        //errored 
        alert("Failure to set")
    } else {
        console.log("DID SET")
        console.log(didSetBalances)
        console.log(didSetGoals)

        //do something here 
        //hiding modal
        document.getElementById("myModal").style.display = "none";
        //un blurring 
        document.getElementById('everything_besides_modal').className = "everything_besides_modal_focus"

        //load graphs
        // loadGraphs()
        // controller.init()
        controller.resetAfterSavingModal(initBalances)
        // window.location.href = baseUrl + "/trackingPage.html";
    }

   


}


//function to update account_tbl with info
function updateAccountTbl(balanceOrGoal, valueObj) {
    //goal or initial balance 
    //post body 
    var postBody = {balanceOrGoal: balanceOrGoal, valueObj: valueObj }

    //sending to url 
    var url = baseUrl + '/updateaccounttbl'

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


//processing data for line chart/bar graph
function processLineChart(dataRows) {
    // need to show:
    // for each account on the same graph:
    // the inputted finance data 
    // horizontal line where finance goal is

    //WORKING code from chart sample
    var lineChartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            // borderColor: window.chartColors.red,
            // backgroundColor: window.chartColors.red,
            fill: false,
            data: [
                1, 2, 3, 4, 5, 6, 7
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor()
            ],
            yAxisID: 'y-axis-1',
        }, {
            label: 'My Second dataset',
            // borderColor: window.chartColors.blue,
            // backgroundColor: window.chartColors.blue,
            fill: false,
            data: [
                7, 6, 5, 4, 3, 2, 1
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor(),
                // randomScalingFactor()
            ],
            yAxisID: 'y-axis-2'
        }]
    };
}


//processing data for graphs 
function processPieChart(dataRows) {
    //assuming expense for this second 


    //variables to put in object to return 
    //data obj to return 
    var data = {}
    //nested data set 
    var nestedData = []
    //nested labels 
    var nestedLabels = []
    console.log("DATA ROWS")
    console.log(dataRows)

    //need to see if there's any at all
    if (dataRows.length == 0) {
        //nothing stored 
        console.log("No data stored")
        nestedData = [0, 0, 0, 0] //TODO change if added misc category
        nestedLabels = ["Auto", "Home", "Food", "Entertainment"]
    } else {
        //if there IS data 
        // console.log("Expense data loaded in graph")
        // console.log(dataRows)

        //need to sum data and seperate by category 
        //storing values 
        //labels 
        nestedLabels = ["Auto", "Home", "Food", "Entertainment"]

        //init to 0
        var expenseTypes = [0, 0, 0, 0]
        //iterating
        for (let indivExpense of dataRows) {
            console.log("INDIV")
            console.log(indivExpense)
            //sum into expensetypes [index - 1]
            expenseTypes[indivExpense.expense_type_id] += parseInt(indivExpense.cost_amount)
            console.log(expenseTypes)
            //sum into expensetypes 
            //might have expense_type need expense index
            // expenseTypes[]
        }
        //store again 
        nestedData = expenseTypes

    }

    //storing in data object to return
    //TODO change if adding income breakdown
    data = {
        datasets: [{
            //label of graph 
            label: 'Expense Category',
            //data to send
            data: nestedData,
            //colors
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'//,
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'//,
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1

        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: nestedLabels
    };

    //returning object
    return data

    // var myChart = new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Gay"],
    //             datasets: [{
    //                 label: '# of Votes',
    //                 data: [12, 19, 3, 5, 2, 3],
    //                 backgroundColor: [
    //                     'rgba(255, 99, 132, 0.2)',
    //                     'rgba(54, 162, 235, 0.2)',
    //                     'rgba(255, 206, 86, 0.2)',
    //                     'rgba(75, 192, 192, 0.2)',
    //                     'rgba(153, 102, 255, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(255,99,132,1)',
    //                     'rgba(54, 162, 235, 1)',
    //                     'rgba(255, 206, 86, 1)',
    //                     'rgba(75, 192, 192, 1)',
    //                     'rgba(153, 102, 255, 1)',
    //                     'rgba(255, 159, 64, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }]
    //         },
    //         options: {
    //             scales: {
    //                 yAxes: [{
    //                     ticks: {
    //                         beginAtZero:true
    //                     }
    //                 }]
    //             }
    //         }
    //     });


}



//saving expense/income
function saveNewItem(newItem, type) {
    console.log("SAVE ITEM")
    //need to make post request 
    //url 
    // var url = 'http://localhost:8080/posts'
    var url = baseUrl + '/saveexpense'
    // var url = 'https://ganymede18.herokuapp.com/posts'

    //user_id
    var user_id_val = getCookie("user_id")

    //need to get the db to save to
    //storing 
    var db = ''
    //changing post body for each table
    var postBody = {}
    //need to get the account type 
    var account_type = document.getElementById("select_account_type").value
    //getting expense type 
    var expense_type = document.getElementById("select_expense_type").value
    if (type == 'inc') {
        //database to store in
        db = 'individual_income_tbl'

        //postbody to send 
        postBody = {
            'description': newItem.description,
            'income_amount': newItem.value,
            // 'account_id': 1, //TODO: change
            'user_id': user_id_val,
            'db': db,
            'account_type': account_type//"Checking" //TODO change
        }
    }
    if (type == 'exp') {
        //swithcing label and string 

        db = 'individual_expense_tbl'
        console.log("\n\n\n\n")
        // console.log(labelObject[newItem.expense_type])
        console.log(newItem)
        //postbody to send 
        postBody = {
            'expense_type_id': newItem.expense_type_id, //labelObject[newItem.expense_type],
            'user_id': user_id_val,
            'description': newItem.description,
            'cost_amount': newItem.cost_amount,
            'account_type': account_type,
            'db': db

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


//getting particular cookie from cookies
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

//building URL for GET requests
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


Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}






//code to delete 


// async function saveBudgetAsync(budget) {
//     // console.log("savebudgetasync")
//     //sent the budget object from other code 
//     //await saveBudget 
//     await saveBudget(budget)
// }

// function saveBudget(budget) {
//     //need to send the budget data over
//     // console.log("savebudget")
//     // console.log("BUDGET IS ")
//     // console.log(budget)

// }


// async function loadBudgetAsync() {
//     //javascript await 
//     var response = await loadBudget();
//     //sending back
//     return response;
// }

// function loadBudget() {
//     //vars 

//   
//     //user id from cookies 
//     var user_id_val = getCookie("user_id")

//     //need to make a GET and return json 
//     //url from base 
//     var url = baseUrl + '/loadbudget/' + user_id_val + '/'

//     console.log("here")
//     //return promise 
//     return new Promise(resolve => {
//         //fetch 
//         console.log("here")
//         // Default options are marked with *
//         fetch(url, {
//             method: "GET", 
//             mode: "same-origin",
//             // mode: "cors", // no-cors, cors, *same-origin
//             // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//             // credentials: "same-origin", // include, *same-origin, omit
//             headers: {
//                 "Content-Type": "application/json",
//                 // "Content-Type": "application/x-www-form-urlencoded",
//             },
//             // redirect: "follow", // manual, *follow, error
//             // referrer: "no-referrer", // no-referrer, *client
//             // body: postBody, // body data type must match "Content-Type" header
//         })
//         .then(response => {
//             console.log("here")
//             // console.log("RESPONSE")
//             // console.log(response.data)
//             resolve(response.json())
//         }); // parses response to JSON
//     })

// }

// //need to get all data
// //damnit need to consolidate this code 
// async function loadBudgetInit(callback) {
//     //probably get cookie from browser here 
//     //getting account_tbl data 

//     var budget = await loadBudgetAsync()

//     //object to return 
//     var allData = {"budget": budget}// , "expense": expense }//, "income": income}

//     //callback
//     callback && callback(allData)

//     // return allData

// }

// //updating graphs 
// //globl chart 
// // var chart;
// function addData(chart, newItem) {
//     //need to get chart from html 
//     var chart = document.getElementById("expenseBreakdown").getContext('2d');
//     // console.log(chart)
//     // console.log("IN UPDATE CHART")
//     // console.log(chart)
//     // console.log(newItem)

//     // console.log(data)

//     // chart.data.labels.push(newItem.expense_type);
//     chart.data.datasets.forEach((dataset) => {
//         // dataset.data.push(data);
//         // console.log(dataset.data)
//     });
//     chart.update();
// }
