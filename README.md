SimpleSelect: a lightweight DOM element selector
=============

SimpleSelect is a lightweight library for selecting DOM elements by node, class, or ID without a framework that works in most major browsers, including IE6+. At only 2.6KB minified, it's useful for selecting elements easily when you can't afford to add the download time of a full framework.

## Tested Browsers

Works in:

* Google Chrome 25.0.1364.160 (Mac OSX, Windows 7, Windows XP, iOS 6.0.2)
* Safari 6.0.2 (Mac OSX and iOS 6.0.2)
* Internet Explorer 9 and 10 (Windows 7)
* Internet Explorer 6, 7, and 8 (Windows XP)
* Firefox 19.0.2 (Mac OSX and Windows 7)

The only major platform I haven't been able to test yet is Android. I'm working on it.

## How to Use

1) Download the source (https://github.com/lauren/simple-select/blob/master/simple-select-1.0.0.min.js) and include it in your HTML as follows:

**Before the ending `</body>`:**

```html
<script src="js/simple-select-1.1.0.min.js"></script>
```
		
2) Use SimpleSelect in your JavaScript like this, anywhere after the DOM has loaded: 

```javascript
simpleSelect("div");
simpleSelect("#id");
simpleSelect(".class");
```

3) SimpleSelect will return an array of all matching elements. If there is only a single matching element, it will still be in an array.

### Selector Details

Here's how each type of selector works:

Returns all divs:

```javascript
simpleSelect("div");
```

Returns all links that are descendants of divs:

```javascript
simpleSelect("div a");
```

Returns all divs with the class ".class":

```javascript
simpleSelect("div.class");
```

Returns all elements with the class .class that are the descendant of a div:

```javascript
simpleSelect("div .class");
```

Returns all divs that the class ".class" AND the class ".anotherClass":

```javascript
simpleSelect("div.class.anotherClass");
```

Returns the div with the ID "#id":

```javascript
simpleSelect("div#id");
```

Returns elements with the class ".class" that are children of the div with the ID "#id":

```javascript
simpleSelect("div#id .class");
```

Returns the link with the ID "#anotherId" that is the descendant of the div with the ID "#id":

```javascript
simpleSelect("div#id a#anotherId");
```

Returns the element with the ID "#id":

```javascript
simpleSelect("#id");
```

Returns elements with the class ".class" that are children of the element with the ID "#id":

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

Returns any element with the class ".anotherClass" that's the descendant of an element with the class ".class":

```javascript
simpleSelect(".class .anotherClass");
```

For more details, check out the sample file: https://github.com/lauren/simple-select/tree/master/sample