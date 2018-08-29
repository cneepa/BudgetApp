var budgetController = (function () {
    
    var Income = function ( id, desc, value ) {
        this.id = id;
        this.description = desc;
        this.value = value;
    }
    
    var Expense = function ( id, desc, value ) {
        this.id = id;
        this.description = desc;
        this.value = value;
    }
    
   //the data striucture that will hold all the records
    var data = {
        listItems: {
            inc: [],
            dec: []
        },
        totals: {
            inc: 0,
            dec: 0
        },
        budget: 0,
        percentage: -1
    }
    
    var calculateTotals = function(type) {
        var sum = 0;
        data.listItems[type].forEach(function(curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }
    
    return {
       addItems: function( type, desc, val ) {
           var newItem, ID;
           //Generate a new id
           // we can use the type to determine which array as it matches the names of the arrays
           if( data.listItems[type].length > 0 ) {
              ID = data.listItems[type][data.listItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
           
           
           
           //Determine whether its expense or income depending on type
           if ( type === 'inc' ) {
               newItem = new Income (ID, desc, val);
           } else if ( type === 'dec') {
               newItem = new Expense (ID, desc, val);
           }
           
           //Add it to existing data structure
           data.listItems[type].push( newItem );
           
           //return the newly created item
           return newItem;
       },
        
       calculateBudget: function () {
           calculateTotals('inc');
           calculateTotals('dec');
           
           data.budget = data.totals.inc - data.totals.dec;
           if ( data.totals.inc > 0 ) {
               data.percentage = Math.round(data.totals.dec / data.totals.inc * 100);
           } 
           
       },
        
       getBudget: function () {
           return {
               income: data.totals.inc,
               expenses: data.totals.dec,
               budget: data.budget,
               percentage: data.percentage
               
           };
       },
        
       testing: function() {
           console.log(data);
       }    
    };
    
}) ();



var UIController = (function() {
    
    var DOMStrings = {
        addType: '.add__type',
        addDesription: '.add__description',
        addValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budget: '.budget__available',
        incomeElement: '.budget__incomes--value',
        expenseElement: '.budget__expenses--value',
        percentageElement: '.budget__expenses--percentage'
    }
    
    return {
        getInputData: function() {
            return {
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesription).value,
                value: parseFloat(document.querySelector(DOMStrings.addValue).value)
            };
        },
        
        addItemsToList: function( obj, type ) {
            var element, newHtml;
            
            if ( type === 'inc' ) {
                element = DOMStrings.incomeContainer;
                newHtml = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if ( type === 'dec' ){
                element = DOMStrings.expenseContainer;
                newHtml = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = newHtml.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%val%', obj.value);
            //console.log(document.querySelector(element));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearInputFields: function () {
            var fields = document.querySelectorAll( DOMStrings.addDesription + ', ' + DOMStrings.addValue );
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function ( current, index, array) {
                current.value = '';
            });
            
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(budgetObj) {
            document.querySelector(DOMStrings.budget).textContent = budgetObj.budget;
            document.querySelector(DOMStrings.incomeElement).textContent = budgetObj.income;
            document.querySelector(DOMStrings.expenseElement).textContent = budgetObj.expenses;
            if(budgetObj.percentage > 0) {
                document.querySelector(DOMStrings.percentageElement).textContent = budgetObj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageElement).textContent = '---';
            }
        },
        
        getDOMStrings : function () {
            return DOMStrings;
        }
    };
    
}) ();


var controller = (function ( bgContrl, uiCntrl) {
    
    var handleEventListeners = function () {
        var DOM = uiCntrl.getDOMStrings();
        document.querySelector( DOM.addBtn ).addEventListener('click', inputData);
        document.addEventListener('keypress', function(event) {
        if( event.keyCode === 13 || event.which === 13) {
            inputData();
        }
        });
    }
    
    
    var updateBudget = function(inputObj) {
        //Calculate budget
        bgContrl.calculateBudget();
        
        //return budget
        var budget = bgContrl.getBudget();
        
        //Display budget
        uiCntrl.displayBudget(budget);
    }
    
    
    var inputData = function() {
        
        // Get input data from form
        var inputData = uiCntrl.getInputData();
        
        // Add to budget cntrl
        
        if( inputData.description !== '' && !isNaN(inputData.value) && inputData.value > 0) {
            var item = bgContrl.addItems( inputData.type, inputData.description, inputData.value );

            // Add to ui list

            uiCntrl.addItemsToList( item, inputData.type );

            //Clear the input form fields
            uiCntrl.clearInputFields();

            updateBudget(inputData);
        }
        
        
        
        
    }
    
    return {
        init: function () {
            handleEventListeners();
        }
    };
    
    
})(budgetController, UIController);


controller.init();