SimpleSelect: a lightweight DOM element selector
=============

SimpleSelect is a lightweight (3KB) library for selecting DOM elements by node, class, or ID that works in most major browsers, including IE6+. It's useful when you want to select elements easily but can't afford to add the download time of a full framework.

## Tested Browsers

Works in:

* Google Chrome 25.0.1364.160 (Mac OSX, Windows 7, Windows XP, iOS 6.0.2)
* Safari 6.0.2 (Mac OSX and iOS 6.0.2)
* Internet Explorer 9 and 10 (Windows 7)
* Internet Explorer 6, 7, and 8 (Windows XP)
* Firefox 19.0.2 (Mac OSX and Windows 7)

The only major platform I haven't been able to test yet is Android. I'm working on it.

## How to Use

1) Download the source (https://github.com/lauren/simple-select/blob/master/simple-select.min.js) and include it in your HTML as follows:

**Before the ending `</body>`:**

```html
<script src="js/simple-select-1.1.0.min.js"></script>
```
		
2) Use SimpleSelect in your JavaScript like this: 

```javascript
simpleSelect("div");
simpleSelect("#id");
simpleSelect(".class");
```

3) simpleSelect will return an array of all matching elements. If there is only a single matching element, it will still be in an array.

### Selector Details

Here's how each type of selector works:

Returns all divs:

```javascript
simpleSelect("div");
```

Returns all links that are direct descendants of divs. Does NOT return links that are non-direct descendants of divs:

```javascript
simpleSelect("div a");
```

Returns all divs with the class ".class":

```javascript
simpleSelect("div.class");
```

Returns all divs AND all elements of any type with the class ".class":

```javascript
simpleSelect("div .class");
```

Returns all divs that have BOTH the class ".class" AND the class ".anotherClass":

```javascript
simpleSelect("div.class.anotherClass");
```

Returns the div with the ID "#id":

```javascript
simpleSelect("div#id");
```

Returns the div with the ID "#id" AND all elements of any type with the class ".class":

```javascript
simpleSelect("div#id .class");
```

Returns the link with the ID "#anotherId" that is the direct descendant of the div with the ID "#id":

```javascript
simpleSelect("div#id a#anotherId");
```

Returns the element with the ID "#id":

```javascript
simpleSelect("#id");
```

Returns the element with the ID "#id" AND any element with the class ".class":

```javascript
simpleSelect("#id .class");
```

Returns any element with the class ".class":

```javascript
simpleSelect(".class");
```

Returns any element that has BOTH the ID ".class" AND the class ".anotherClass":

```javascript
simpleSelect(".class.anotherClass");
```

Returns any element that has EITHER the class ".class" OR the class ".anotherClass":

```javascript
simpleSelect(".class .anotherClass");
```