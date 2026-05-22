---
id: '4'
title: 'The __init__ Method'
canvas: 'False'
---

# The __init__ Method

## Description
`__init__` is a **dunder** method that Python calls automatically every time you create a new instance. Its job is to set the **initial state** of the object by attaching values to it.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)   # __init__ runs automatically here
```

### The `self` parameter
`self` is a reference to the instance being created. It is always the **first parameter** of any instance method. The name `self` is a convention - technically you could name it differently, but every Python developer expects `self` and breaking that convention will confuse readers and linters.

Inside `__init__`, `self.attribute = value` creates an **instance attribute** that belongs only to this particular object.

### Indentation
Method definitions must be **indented** inside the class body. Indentation is how Python knows the method belongs to the class:

```python
class Point:
    def __init__(self, x, y):   # indented -> method of Point
        self.x = y
        self.y = y

def free_function():            # not indented -> not part of Point
    pass
```

### Default values
Parameters can have defaults, making them optional at call time:

```python
class Point:
    def __init__(self, x, y=1):
        self.x = x
        self.y = y

Point(10)          # x defaults to 1
Point(10, 5)         # y explicitly 5
```

## Requirements
- Define a class named `Dog`
- Implement `__init__(self, name, age)` with `age` defaulting to `1`
- Inside `__init__`, assign `self.name = name` and `self.age = age`
- Create `dog1 = Dog("Rex", 5)`
- Create `dog2 = Dog("Buddy")` so it uses the default age
- Print `dog1.name`, `dog1.age`, `dog2.name`, `dog2.age` each on its own line, in that order
