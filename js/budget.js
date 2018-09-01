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
        this.percentage = -1;
    }
    
   //the data striucture that will hold all the records
    var data = {
        listItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
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
           } else if ( type === 'exp') {
               newItem = new Expense (ID, desc, val);
           }
           
           //Add it to existing data structure
           data.listItems[type].push( newItem );
           
           //return the newly created item
           return newItem;
       },
    
      deleteItems: function(type, id) {
         var idArr, index;
         
         idArr = data.listItems[type].map( function(curr) {
             return curr.id;
         });
         //console.log('idArr ::' + idArr);
         
         index = idArr.indexOf(id);
         
         if( index !== -1) {
             data.listItems[type].splice(index, 1);
         }
      },
        
       calculateBudget: function () {
           calculateTotals('inc');
           calculateTotals('exp');
           
           data.budget = data.totals.inc - data.totals.exp;
           if ( data.totals.inc > 0 ) {
               data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
           } 
           
       },
        
       getBudget: function () {
           return {
               income: data.totals.inc,
               expenses: data.totals.exp,
               budget: data.budget,
               percentage: data.percentage
               
           };
       },
       
       calculatePercentages: function () {
           data.listItems.exp.forEach(function(curr){
               var totalIncome = data.totals.inc;
               if( totalIncome > 0){
                   curr.percentage = Math.round((curr.value / totalIncome) * 100);
               } else {
                   curr.percentage = -1;
               }
           });
           
       },
        
       getPercentages: function() {
           var percArr;
           percArr = data.listItems.exp.map( function(curr) {
               return curr.percentage;
           });
           return percArr;
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
        percentageElement: '.budget__expenses--percentage',
        container: '.container',
        expPercentage: '.item__percentage'
    }
    
    var formatNumbers = function (num, type){
        var splitArr, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitArr = num.split('.');
        int = splitArr[0];
        dec = splitArr[1];
        //25340.00
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        
        return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec;
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
                newHtml = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if ( type === 'exp' ){
                element = DOMStrings.expenseContainer;
                newHtml = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = newHtml.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.description);
            newHtml = newHtml.replace('%val%', formatNumbers(obj.value, type));
            //console.log(document.querySelector(element));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        removeItemsFromList: function(itemId) {
            var el;
            
            el = document.getElementById(itemId);
            el.parentNode.removeChild(el);
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
            if(budgetObj.budget > 0) {
                document.querySelector(DOMStrings.budget).textContent = formatNumbers(budgetObj.budget, 'inc');
            } else {
                document.querySelector(DOMStrings.budget).textContent = formatNumbers(budgetObj.budget, 'exp');
            }
            
            document.querySelector(DOMStrings.incomeElement).textContent = formatNumbers(budgetObj.income, 'inc');
            document.querySelector(DOMStrings.expenseElement).textContent = formatNumbers(budgetObj.expenses, 'exp');
            if(budgetObj.percentage > 0) {
                document.querySelector(DOMStrings.percentageElement).textContent = budgetObj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageElement).textContent = '---';
            }
        },
        
        displayPercentage: function(percentages) {
            var fields, nodeListForEach;
            
            fields = document.querySelectorAll(DOMStrings.expPercentage);
            nodeListForEach = function(fieldsArr, callback){
                for( var i = 0; i < fieldsArr.length; i++ ){
                    callback(fieldsArr[i], i);
                }
            };
            
            nodeListForEach(fields, function(curr, index){
                if(percentages[index] > 0) {
                   curr.textContent = percentages[index] + '%'; 
                } else {
                    curr.textContent = '---';
                }
            });
        
        },
        
        getDOMStrings : function () {
            return DOMStrings;
        }
    };
    
}) ();


var controller = (function ( bgContrl, uiCntrl) {
    
    var handleEventListeners = function () {
        var DOM = uiCntrl.getDOMStrings();
        document.querySelector( DOM.addBtn ).addEventListener('click', inputItem);
        document.addEventListener('keypress', function(event) {
        if( event.keyCode === 13 || event.which === 13) {
            inputItem();
        }
        });
        
        document.querySelector(DOM.container).addEventListener('click', deleteItem);
    };
    
    
    var updateBudget = function() {
        //Calculate budget
        bgContrl.calculateBudget();
        
        //return budget
        var budget = bgContrl.getBudget();
        
        //Display budget
        uiCntrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        var percentages;
        //calculate percentages
        bgContrl.calculatePercentages();
        
        //getPercentages
        percentages = bgContrl.getPercentages();
        
        //displayPercentages
        uiCntrl.displayPercentage(percentages);
    };
    
    
    var inputItem = function() {
        
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
            
            updatePercentages();
        }
    };
    
    var deleteItem = function(event) {
        var itemID, itemIdArr, id, type;
        
        //console.log('in deleteItem method');
        
        //get details about the item being deleted
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        itemIdArr = itemID.split('-');
        type = itemIdArr[0];
        id = parseInt(itemIdArr[1]);
        
        //delete the inc or exp object from the data structure
        bgContrl.deleteItems(type, id);
        
        //update the ui
        uiCntrl.removeItemsFromList(itemID);
        
        //update the budget
        updateBudget();
        
        updatePercentages();
    };  
        
        
    return {
        init: function () {
            uiCntrl.displayBudget( {
                income: 0,
                expenses: 0,
                budget: 0,
                percentage: -1});
            handleEventListeners();
        }
    };
    
    
})(budgetController, UIController);


controller.init();