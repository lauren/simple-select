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
    // on first character, then parse out additional classes and IDs in 
    // each property in the new object if applicable.
    // we're going from ["node.class", "node#id", "#id.class.class", ".class.class"] to
    // [{node: 'node', classes: ['.class'}, {node: 'node', id: '#id'}, 
    // {id: '#id', classes: ['.class', '.class']}, {classes: ['class', '.class']}]
    for (var i = 0; i < selectors.length; i++) {
      switch(selectors[i].charAt(0)) {
        case "#":
          selectors[i] = {id: selectors[i]};
          break;
        case ".":
          selectors[i] = {classes: findClasses(selectors[i])};
          break;
        default:
          selectors[i] = {node: selectors[i]};
          if (/#/.test(selectors[i].node)) {
            selectors[i] = findNodeIds(selectors[i].node);
          }
        findClassesInObject(selectors[i]);
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

  // takes a selector object like {node: "node.class.class"} or {id: "#id.class.class"} or 
  // {node: "node"} or {id: "#id"} and returns {node: "node", classes: [".class", ".class"]} or 
  // {id: "#id", classes: [".class", ".class"]} or {node: "node"} or {id: "#id"}
  var findClassesInObject = function (object) {
    for (type in object) {
      if (/\./.test(object[type])) {
        object.classes = findClasses(object[type]);
        object[type] = object[type].split(".")[0];
      }
    }
  };
  
  // iterates over array of elements and checks them against provided function
  // with provided array of selectors. if result === true, push to matchingElements
  var checkAndPushElements = function (elements,checkingFunction,selectors) {
    var matchingElements = [];
    for (var i = 0; i < elements.length; i++) {   
      if (checkingFunction(elements[i],findAncestors(elements[i]),selectors)) {
        matchingElements.push(elements[i]);
      }
    };
    return matchingElements;
  };
  
  var findAncestors = function (thisElement) {
    var ancestors = [];
    while (thisElement.parentNode) {
      ancestors.unshift(thisElement.parentNode);
      thisElement = thisElement.parentNode;
    }
    return ancestors;
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
  
  var matchSelectorToParents = function (theseAncestors,thisSelector) {
    var closestParent = theseAncestors.slice(0).pop(),
      currentMatch
    result = {match: false, matchingElement: false};
    if (theseAncestors.length <= 1) {
      result.match = false;
      return result;
    } else {
      if (matchOneElementToOneSelector(closestParent,thisSelector)) {
        result.match = true
        result.matchingElement = closestParent;
        return result;
      } else {
        matchSelectorToParents(theseAncestors.slice(0,theseAncestors.length-1),thisSelector);
      }
    }
    return result;
  };
  
  //change theseAncestors to ancestors
  var matchToSelectors = function (thisElement,theseAncestors,theseSelectors) {
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
      if (matchOneElementToOneSelector(thisElement,lastSelector) && theseAncestors.length > 1) {
        nextMatch = matchSelectorToParents(theseAncestors,penultimateSelector);
        if (nextMatch.match) {
          nextMatchParents = findAncestors(nextMatch.matchingElement);
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
