//vars 
var baseUrl = "http://localhost:8080"
// var baseUrl = "https://ganymede18.herokuapp.com"



// BUDGET CONTROLLLER
var budgetController = (function () {
    // create a function constructor for income and expense types
    var Expense = function (id, description, cost_amount, expense_type_id) {
        this.id = id;
        this.description = description;
        this.cost_amount = cost_amount;
        this.percentage = -1;
        this.expense_type_id = expense_type_id;
        
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

    var Income = function (id, description, value, expense_type) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.expense_type = expense_type
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
        addItem: function (type, desc, val, expense_type_id = -1, addingNewItem = true) {
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
                newItem = new Expense(ID, desc, val, expense_type_id);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val, expense_type_id);
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
            if(addingNewItem == true) {
                saveNewItem(newItem, type)
                //add to graph?
                // loadGraphs(data.allItems.exp)
                updateGraphNewItem(data.allItems.exp)
                // addData('expenseBreakdown', newItem)
            }
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
            // console.log("CHANGED TYPE")
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
                //getting the expense type 
                var expense_type = document.getElementById("select_expense_type").value
                
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
                console.log(expense_type)
                newItem = budgetCntrl.addItem(expense_or_income_sent, expense_income_loaded.description, amountValue, expense_income_loaded.expense_type_id, false);
                console.log("NEW ITEM")
                console.log(newItem)
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
                //get value 
                var expense_type_id = document.getElementById("select_expense_type").selectedIndex;
                //making new item
                newItem = budgetCntrl.addItem(input.type, input.description, input.value, expense_type_id);
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
        console.log("SECOND LOADED")
        console.log(expense)
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
        // var baseUrl = "http://localhost:8080"
        // // var baseUrl = "https://ganymede18.herokuapp.com"
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
        init: function (dataObj) {
            //console.log('Application has begun.');
            UICntrl.displayMonth();

            //just initializing with 0 again 
            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0, //totalExpenses,
                percentage: -1
            });

        
            //event listeners
            setUpEventListeners();

            //james's code 
            //load stuff and add items 
            loadExpenseIncomeTbls(function(dataObj) {
                console.log("Made it this far?...")
                //loaded data 
                var expense = dataObj.expense
                var income = dataObj.income 
                console.log("loaded expenses were:")
                console.log(expense)
                console.log("loaded incomes were:")
                console.log(income)


                //need to call controlAddItem 
                //will just send objects and do formatting there 
                //expenses 
                if (expense.length != 0) {
                    for(let obj of expense) {
                        console.log("loaded expense added")
                        controlAddItem(obj, 'exp', false, )
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

                //load graphs here
                //send it expense and income
                loadGraphs(expense, income)
                
            })
        }
    }



})(budgetController, UIController, window);

//james's added code 
//main
// send it 0 because loading saved expenses/income is done through using the controlAddItem function through the above code
// begin the app or nothing will ever run because the event listeners are in a private function
controller.init();




//Database functions:
//for graphs
var expenseBreakdown;
function loadGraphs(expense, income = -1) {
//TODO: customize more
console.log("In LOAD GRAPHS")
console.log(expense)


    //what charts to load?
    //1: expense category breakdown 
    //2: progress to goal

    //making Expense BreakDown Pie Chart first
    //getting the graph from the html after it's loaded 
    var ctx = document.getElementById("expenseBreakdown").getContext('2d');
   

    //data object 
    // var data = {} //expense values from db // OR 0 if new user!
    var data = processPieChart(expense)

    console.log("AFTER PROCESSING")
    console.log(data)

    
    //creating the chart
    expenseBreakdown = new Chart(ctx,{
        type: 'doughnut',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Expense Breakdown'
            }
        }
    });


    // var myChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Gay"],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 }
    //             }]
    //         }
    //     }
    // });
}

//minor pre processing 
function updateGraphNewItem(expense) {
    console.log("EXPENSE SENT IS ")
    console.log(expense)
    //vars to store
    var newExpense = []
    //need to preprocess 
    var labelObject = {
        "Auto": 1,
        "Home": 2, 
        "Food":3, 
        "Entertainment": 4
    }
    for (let e of expense) {
        e.expense_type = labelObject[e.expense_type]
        //push
        newExpense.push(e)
    }

    //now call function
    console.log("NEW DATA IS")
    console.log(newExpense)

    //updating graphs?
    loadGraphs(newExpense)
}

//updating graphs 
//globl chart 
// var chart;
function addData(chart, newItem) {
    //need to get chart from html 
    var chart = document.getElementById("expenseBreakdown").getContext('2d');
    console.log(chart)
    console.log("IN UPDATE CHART")
    console.log(chart)
    console.log(newItem)
    
    // console.log(data)

    // chart.data.labels.push(newItem.expense_type);
    chart.data.datasets.forEach((dataset) => {
        // dataset.data.push(data);
        console.log(dataset.data)
    });
    chart.update();
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
        nestedData = [0, 0, 0, 0 ] //TODO change if added misc category
        nestedLabels = ["Auto", "Home", "Food", "Entertainment"]
    } else {
        //if there IS data 
        // console.log("Expense data loaded in graph")
        // console.log(dataRows)

        //need to sum data and seperate by category 
        //storing values 
        //labels 
        nestedLabels = ["Auto", "Home", "Food", "Entertainment"]
        var labelObject = {
            1: "Auto",
            2: "Home",
            3: "Food",
            4: "Entertainment"
        }
        //init to 0
        var expenseTypes = [0,0,0,0]
        //iterating
        for ( let indivExpense of dataRows) {
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

    var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Gay"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

    
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
            'cost_amount': newItem.value,
            'account_type':account_type,
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
    
//     var baseUrl = "http://localhost:8080"
//     // var baseUrl = "https://ganymede18.herokuapp.com"
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