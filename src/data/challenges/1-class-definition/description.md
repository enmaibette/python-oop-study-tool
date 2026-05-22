---
id: '1'
title: 'Class Definition'
canvas: 'false'
---

# Class Definition
## Description
A **class** is a blueprint that describes what an object should look like and how it should behave. The class itself does nothing on its own; it only becomes "alive" once you create an **instance** (also called an *object*) from it.

In Python, class names use **`CapitalizedWords`** notation (also called PascalCase). This is a strong convention from [PEP 8](https://peps.python.org/pep-0008/) and lets you visually distinguish classes from functions and variables at a glance:

```python
class Point:        # class -> PascalCase
    pass

point1 = Point()  # variable -> snake_case
```

If a class has no attributes or methods yet, Python still requires *something* inside the body. The `pass` keyword is a no operation statement that satisfies the syntax and acts as an explicit placeholder.


When you call `type(obj)`, Python returns the class the object was made from. This is how you can verify that an instance really belongs to your class.

## Requirements
- Define a class named `Animal` using `CapitalizedWords` notation
- The class body must use the `pass` statement (no attributes or methods)
- Create one instance of `Animal` and assign it to `animal1`
- Print `type(animal1)`
