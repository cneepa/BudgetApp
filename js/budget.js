var budgetController = (function () {
    
    var Income = function ( id, desc, value ) {
        this.id = id,
        this.description = desc,
        this.value = value
    }
    
    var Expense = function ( id, desc, value ) {
        this.id = id,
        this.descriptio = desc,
        this.value = value
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
        }
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
        addBtn: '.add__btn'
    }
    
    return {
        getInputData: function() {
            return {
                type: document.querySelector(DOMStrings.addType).value,
                description: document.querySelector(DOMStrings.addDesription).value,
                value: document.querySelector(DOMStrings.addValue).value
            };
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
    
    
    
    var inputData = function() {
        
        // Get input data from form
        var inputData = uiCntrl.getInputData();
        
        // Add to budget cntrl
        
        var item = bgContrl.addItems( inputData.type, inputData.description, inputData.value );
        
        // Add to ui list
        
        
        
        //Calculate budget
        
        //Display budget
        
        
    }
    
    return {
        init: function () {
            handleEventListeners();
        }
    };
    
    
})(budgetController, UIController);


controller.init();