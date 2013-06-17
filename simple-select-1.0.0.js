/*
 * Copyright 2013 Lauren Sperber
 * https://github.com/lauren/simple-select/blob/master/LICENSE
 */

;(function (exports) {
  var simpleSelect = function (selectors) {
    var selectors = parseSelectors(selectors),
        elements = document.getElementsByTagName("*");
      
    return checkAndPushElements(elements,matchToSelectors,selectors);
  };

  var parseSelectors = function (selectors) {
    selectors = selectors.split(" ");
    // change each selector into object with ID/class/node property based
    // on first character
    // we're going from ["node.class", "node#id", "#id.class.class", ".class.class"] to
    // [{node: 'node.class'}, {node: 'node#id'}, {id: #id.class.class}, {classes: ["class.class"]}]
    for (var i = 0; i < selectors.length; i++) {
      switch(selectors[i].charAt(0)) {
      case "#":
          selectors[i] = {id: selectors[i]};
          break;
      case ".":
          selectors[i] = {classes: [selectors[i]]};
          break;
      default:
          selectors[i] = {node: selectors[i]};
      }
    };
      
    // find additional classes and IDs in the main selector to flush out the object
    // we're going from 
    // [{node: 'node.class'}, {node: 'node#id'}, {id: #id.class.class}, {classes: ["class.class"]}] to
    // [{node: "node", classes: [".class"]}, {node: "node", id: "#id"}, 
    // {id: "#id", classes: [".class", ".class"]}, {classes: [".class", ".class"]}]
    // TODO: make an object with all the functions that happen for each case, then call it from another function like
    // var handler = function (stuff) {
    // return handlers[thing]();
    //}
    // use map instead of looping var result = [0,1,2].map(function () {}) ? won't work in IE6 :(
    for (var i = 0; i < selectors.length; i++) {
      if (selectors[i].classes) {
        selectors[i].classes = findClasses(selectors[i].classes[0]);
      }
      if (selectors[i].node) {
        if (/#/.test(selectors[i].node)) {
          selectors[i] = findNodeIds(selectors[i].node);
        }
        if (/\./.test(selectors[i].node)) {
          selectors[i].classes = findClasses(selectors[i].node);
          selectors[i].node = selectors[i].node.split(".")[0];
        }
      }
      if (selectors[i].id) {
        if (/\./.test(selectors[i].id)) {
          selectors[i].classes = findClasses(selectors[i].id);
          selectors[i].id = selectors[i].id.split(".")[0];
        }
      }
    };
    return selectors;
  }
  
  // takes a string like "node#id" and returns an object like {node: node, id: id}
  var findNodeIds = function (string) {
    var nodeAndId = string.split("#");
    return {
      node: nodeAndId[0], 
      id: "#" + nodeAndId[1]
    };
  };
  
  // takes a astring like "node.class.class" and returns an array like "[class, class]"
  var findClasses = function (string) {
    var classes = string.split(".");
    classes.shift();
    for (var i = 0; i < classes.length; i++) {
      classes[i] = "." + classes[i];
    }
    return classes;
  };
  
  // iterates over array of elements and checks them against provided function
  // with provided array of selectors. if result === true, push to matchingElements
  var checkAndPushElements = function (elements,checkingFunction,selectors) {
    var matchingElements = [];
    for (var i = 0; i < elements.length; i++) {   
      if (checkingFunction(elements[i],findAllParents(elements[i]),selectors)) {
        matchingElements.push(elements[i]);
      }
    };
    return matchingElements;
  };
  
  var findAllParents = function (thisElement) {
    var parents = [];
    while (thisElement.parentNode) {
      parents.unshift(thisElement.parentNode);
      thisElement = thisElement.parentNode;
    }
    return parents;
  };
  
  
  var matchOneElementToOneSelector = function (element,selector) {
    var elementNode = element.nodeName.toLowerCase(),
        elementClasses = element.className.split(" "),
        elementId = "#" + element.id,
        result;
    for (var i = 0; i < elementClasses.length; i++) {
        elementClasses[i] = "." + elementClasses[i];
      }
    if (selector.node) {
      result = (selector.node === elementNode);
    }
    if (selector.id) {
      result = (selector.id === elementId);
    }
    if (selector.classes) {
      result = isSubset(selector.classes, elementClasses)
    }
    return result;
  };
  
  var matchSelectorToParents = function (theseParents,thisSelector) {
    var closestParent = theseParents.slice(0).pop(),
      currentMatch
    result = {match: false, matchingElement: false};
    if (theseParents.length <= 1) {
      result.match = false;
      return result;
    } else {
      if (matchOneElementToOneSelector(closestParent,thisSelector)) {
        result.match = true
        result.matchingElement = closestParent;
        return result;
      } else {
        matchSelectorToParents(theseParents.slice(0,theseParents.length-1),thisSelector);
      }
    }
    return result;
  };
  
  //change theseParents to ancestors
  var matchToSelectors = function (thisElement,theseParents,theseSelectors) {
    var selectorCount = theseSelectors.length,
        lastSelector = theseSelectors[selectorCount-1],
        penultimateSelector = theseSelectors[selectorCount-2],
        nextMatch,
        nextMatchParents;
    if (selectorCount === 0) {
      return false;
    } else if (selectorCount === 1) {
      return matchOneElementToOneSelector(thisElement,theseSelectors[0]);
    } else {
      if (matchOneElementToOneSelector(thisElement,lastSelector) && theseParents.length > 1) {
        nextMatch = matchSelectorToParents(theseParents,penultimateSelector);
        if (nextMatch.match) {
          nextMatchParents = findAllParents(nextMatch.matchingElement);
          return (theseSelectors.length === 2) ? true : matchToSelectors(nextMatch.matchingElement,nextMatchParents,
            theseSelectors.slice(0,theseSelectors.length-1));
        } else {
          return false;
        }              
      } else {
        return false;
      }
    }
  };
  
  // because IE doesn't like indexOf
  var inArray = function (array,object) {
    for (var i = 0; i < array.length; i++) {
      if(array[i] === object) {
          return i;
      }
    };
    return -1;
  };

  // Check if xs is a subset of ys (every element of xs is an element of ys).
  var isSubset = function(xs, ys) {
    return (xs.length === 0) ? true : (inArray(ys, xs[0]) > -1) && isSubset(xs.slice(1), ys);
  };

  exports.simpleSelect = simpleSelect;
    
})(this);
