var filter = function(pred) {
  return function(elem) {
    var res = pred(elem) ? [elem] : [];
    var children = Array.prototype.slice.call(elem.children);
    return children.map(function(child) {
      return filter(pred)(child);
    }).reduce(function(res, selections) {
      return res.concat(selections);
    }, res);
  };
};

var starPred = function() { return true; };
var nodePred = function(nodeName) {
  return function(elem) { return elem.nodeName === nodeName.toUpperCase(); };
};
var idPred = function(id) {
  return function(elem) { return elem.id === id; };
};
var classPred = function(className) {
  return function(elem) {
    var classes = elem.className.split(" ");
    return classes.some(function(c) { return c === className; });
  };
};

var nodeSelector = function(nodeName) { return filter(nodePred(nodeName)); };
var idSelector = function(id) { return filter(idPred(id)); };
var classSelector = function(className) { return filter(classPred(className)); };

var nested = function(preds) {
  if (preds.length === 1) {
    return filter(preds[0]);
  }
  else {
    var pred = preds[0];
    return function(elem) {
      var children = Array.prototype.slice.call(elem.children);

      var elemsWithout = children.map(function(child) {
        return nested(preds)(child);
      }).reduce(function(res, elems) { return res.concat(elems); }, []);

      if (pred(elem)) {
        var elemsWith = children.map(function(child) {
          return nested(preds.slice(1))(child);
        }).reduce(function(res, elems) { return res.concat(elems); }, []);
        return _.union(elemsWith, elemsWithout);
      }
      else {
        return elemsWithout;
      }
    };
  }
};

var a = nodeSelector("a");
var div = nodeSelector("div");
var body = nodeSelector("body");
var foo = idSelector("foo");
var barClass = classSelector("barClass");
var quux = classSelector("quux");
var star = filter(function() { return true; });

var aWithinDiv = nestedFilter([nodePred("div"), nodePred("a")]);

var root = document.getElementsByTagName("html")[0];
