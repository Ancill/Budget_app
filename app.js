
//#################Budget controller#######################
var budgetController = (function () {
    var Expense = function(id, description, value) { //constuctor function
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome )* 100)

        } else {
            this.percentage = -1;
        }
    }
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
        data.allItems[type].forEach(function (cur) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        },
        budget: 0,
        percentage: -1
    }
    //methods that allowed to point out of budgetcontroller
    return {
       addItem: function(type,des,val) {
            var newItem, ID;
            //[1,2,3,4,5] next id = 6
            // ID = last ID +1
            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            
            } else {
                ID = 0;
            }
           
            

            //Create new item based on 'inc'or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //push it into  our data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type,id) {
            ids = data.allItems[type].map(function(current) {
                return current.id;
            })

            index = ids.indexOf(id);
            if (index !== -1 ) {
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calc the % of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

            //expense = 100 and income 200, spent 33.33% = 100/200 *100
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage();

            })
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();

            })  
            return allPerc;
        },
        // last function to returning data for implementation in DOM/ call it after calculateBudget();
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    }
})();








//###############UI controller#######################
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
        
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either exp or inc
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItem: function(obj, type) {
            var html,element, newHtml;
            // Create HTML string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                
                html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div> 
                <div class="right clearfix"> <div class="item__value">%value%</div>
                <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;

                html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }
            //raplace the placeholder text wtih some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%' , obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

             //insert the html into the DOM
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },
    
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
    
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +
            DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields); // create sliced array with selectors

            fieldsArr.forEach(function(current,index , array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();

        },
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
       
      
    }
})();





//###################Global app conteroller##############################

var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {


        // 1.Calculate budget
        budgetCtrl.calculateBudget();
        // 2.return the budget
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function() {
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();

        //2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update UI with new percentages
        console.log(percentages);
    }

    var ctrlAddItem = function() {
        var input, newItem;

        //1. Get the field input data
        var input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. ADD the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the Ui
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the field
            UICtrl.clearFields();
            
            // 5. Calculate and update budget
            updateBudget();

            //6. Update perentages
            updatePercentages();
        }
    }


    var ctrlDeleteItem = function(event) {
        var itemID, type,splitID, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete the item from the data sructure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);
            // 3 update and show new budget
            updateBudget();
        }
    }

    
    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
})(budgetController,UIController);

controller.init();