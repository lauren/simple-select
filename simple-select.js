/*
* Copyright 2013 Lauren Sperber
* https://github.com/lauren/simple-select/blob/master/LICENSE
*/

var simpleSelect = function () {
  
  var matchingElements = [];
  
  var methods = {
        
    selectElements: function (selectors) {
        matchingElements = []; // make sure matchingElements is empty
        selectors = selectors.split(" ");
        var classSelectors = [],
            idSelectors = [],
            nodeSelectors = [],
            elements = document.getElementsByTagName("*");
                    
        // put selectors in ID/class/node selector arrays based on first character
        for (var i = 0; i < selectors.length; i++) {
          if (selectors[i].charAt(0) === "#") {
            idSelectors.push(selectors[i]);
          }
          else if (selectors[i].charAt(0) ===".") {
            classSelectors.push(selectors[i]);
          } else {
            nodeSelectors.push(selectors[i]);
          }
        };
              
        // check node selectors for additional class or ID selectors
        // if there are any, make the selector into an object 
        // consisiting of node, id, and as many class names as needed       
        for (var i = 0; i < nodeSelectors.length; i++) {
          if (nodeSelectors[i].match(/#/)) {
            var nodeAndId = nodeSelectors[i].split("#");
            nodeSelectors[i] = {
              node: nodeAndId[0], 
              id: "#" + nodeAndId[1]
            };
          } else if (nodeSelectors[i].match(/\./)) {
            var nodeAndClass = nodeSelectors[i].split("."),
                classes = [];
            for (var j = 1; j < nodeAndClass.length; j++) {
              classes.push("." + nodeAndClass[j]);
            }
            nodeSelectors[i] = {
              node: nodeAndClass[0],
              classes: [classes]
            }
          }
        };
                
        // check class selectors for multiple classes
        // if they exist, make each into an array
        for (var i = 0; i < classSelectors.length; i++) {
          var classes = classSelectors[i].split(".");
          classes = classes.slice(1,classes.length);
          if (classes.length > 1) {
            classSelectors[i] = [];
            for (var j = 0; j < classes.length; j++) {
              classSelectors[i].push("." + classes[j]);
            }
          }
        };        
        
        methods.checkElements(elements,methods.matchToNodeSelectors,nodeSelectors);
        methods.checkAndPushElements(elements,methods.matchToIdSelectors,idSelectors);
        methods.checkAndPushElements(elements,methods.matchToClassSelectors,classSelectors);
        return matchingElements;
    },
    
    // iterates over array of elements and checks them against provided function
    // with provided array of selectors
    checkElements: function (elements,checkingFunction,selectors) {
      for (var i = 0; i < elements.length; i++) {
        checkingFunction(elements[i],selectors);
      };
    },
    
    // iterates over array of elements and checks them against provided function
    // with provided array of selectors. if result === true, push to matching elements
    checkAndPushElements: function (elements,checkingFunction,selectors) {
      for (var i = 0; i < elements.length; i++) {   
        if (checkingFunction(elements[i],selectors)) {
          matchingElements.push(elements[i]);
        }
      };
    },
    
    // pushes elements that match the node pattern to the matchingElements array
    matchToNodeSelectors: function (element,theseNodeSelectors) {
      var elementNode = element.nodeName.toLowerCase();
      if (theseNodeSelectors.length === 0) {
        return false;
      } else if (theseNodeSelectors.length === 1) {
        // if node selector doesn't have any class or id specified, just match to element nodeName
        if (typeof theseNodeSelectors[0] === "string") {
          if (elementNode === theseNodeSelectors[0]) {
            matchingElements.push(element);
          }           
        } else {
          var thisNodeSelector = theseNodeSelectors[0].node;
          if (elementNode === thisNodeSelector) {
            if (theseNodeSelectors[0].hasOwnProperty("classes") &&
              methods.matchToClassSelectors(element,theseNodeSelectors[0].classes)) {
                matchingElements.push(element);
              }
            if (theseNodeSelectors[0].hasOwnProperty("id") &&
              methods.matchToIdSelectors(element,[theseNodeSelectors[0].id])) {
              matchingElements.push(element);
            }
          }
        }
      } else {
        var remainingSelectors = theseNodeSelectors.slice(1,theseNodeSelectors.length);
        if (typeof theseNodeSelectors[0] === "string") {
          if (elementNode === theseNodeSelectors[0]) {
            for (var i = 0; i < element.children.length; i++) {
              methods.matchToNodeSelectors(element.children[i],remainingSelectors);                
            }
          }
        } else {
          var thisNodeSelector = theseNodeSelectors[0].node;
          if (elementNode === thisNodeSelector) {
            if (theseNodeSelectors[0].hasOwnProperty("classes") &&
              methods.matchToClassSelectors(element,theseNodeSelectors[0].classes)) {
                for (var i = 0; i < element.children.length; i++) {
                  methods.matchToNodeSelectors(element.children[i],remainingSelectors);                
                };
              }
            if (theseNodeSelectors[0].hasOwnProperty("id") && 
              methods.matchToIdSelectors(element,[theseNodeSelectors[0].id])) {
              for (var i = 0; i < element.children.length; i++) {
                methods.matchToNodeSelectors(element.children[i],remainingSelectors);                
              };
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      }
    },
    
    // pushes elements that match the ID pattern to the matchingElements array
    matchToIdSelectors: function (element,theseIdSelectors) {
      var elementId = "#" + element.id;
      // there can only be one ID in the selector statement, so use first item in array
      if (elementId === theseIdSelectors[0]) { 
        return true; 
      }
    },
    
    matchToClassSelectors: function (element,theseClassSelectors) {
      var elementClasses = element.className.split(" "),
          result;
      for (var i = 0; i < elementClasses.length; i++) {
        elementClasses[i] = "." + elementClasses[i];
      };
      var matchToClasses = function (classSelectors) {
        if (classSelectors.length === 0) {
          result = false;
        } else if (classSelectors.length === 1) {
          if (typeof classSelectors[0] === "string") {
            if (methods.inArray(elementClasses,classSelectors[0]) > -1) {
              result = true;
            }
          } else {
            if (methods.allInArray(elementClasses,classSelectors[0])) {
              result = true;
            }
          }
        } else {
          if (typeof classSelectors[0] === "string") {
            if (methods.inArray(elementClasses,classSelectors[0]) > -1) {
              result = true;
            } else {
              matchToClasses(classSelectors.slice(1,classSelectors.length));
            }
          } else {
            if (methods.allInArray(elementClasses,classSelectors[0])) {
              result = true;
            } else {
              matchToClasses(classSelectors.slice(1,classSelectors.length));
            }
          }
        }
      }
      matchToClasses(theseClassSelectors);
      return result;
    },
    
    // because IE doesn't like indexOf
    inArray: function (array,object) {
      for (var i = 0; i < array.length; i++) {
        if(array[i] === object) {
          return i;
        }
      };
      return -1;
    },
    
    // returns true if all the elements in arrayToCheckAgainst also
    // exist in arrayToCheckIn
    allInArray: function (arrayToCheckIn, arrayToCheckAgainst) {
			var result;
			var checkArray = function (checkIn,checkAgainst) {
				if (checkAgainst.length === 0) {
					result = false;
				} else if (checkAgainst.length === 1) {
					if (methods.inArray(checkIn,checkAgainst[0]) > -1) {
						result = true;
					} else {
						result = false;
					}
				} else {
		    	if (methods.inArray(checkIn,checkAgainst[0]) > -1) {
		    		checkArray(checkIn,checkAgainst.slice(1,(checkAgainst.length)));
		    	} else {
						result = false;
					}
				}
		  }
			checkArray(arrayToCheckIn,arrayToCheckAgainst);
			return result;
		}
  }
  
  var draggable = function (element,container) {
  }
  
  return methods.selectElements
  
}();