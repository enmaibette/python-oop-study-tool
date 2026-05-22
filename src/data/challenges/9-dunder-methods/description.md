---
id: '9'
title: 'The Dunder Methods'
canvas: 'false'
---
# Dunder Methods

## Description
Dunder methods ("double underscore") are special methods that Python calls automatically for built-in operations like printing, comparing, or adding objects.

### Important dunder methods

**`__init__`**: called automatically when a new object is created. Used to set up the object's attributes.
```python
def __init__(self, x, y):
    self.x = x
    self.y = y
```

**`__str__`**: defines what `print(obj)` and `str(obj)` return. Used for readable, user-facing output.
```python
def __str__(self):
    return f"Point({self.x}, {self.y})"
```

**`__repr__`**: defines how an object looks when you type it directly into the interactive Python shell or call `repr(obj)`. If `__str__` is missing, Python falls back to this.
```python
def __repr__(self):
    return f"Point(x={self.x}, y={self.y})"
```

**`__eq__`**: defines the `==` operator. Without it, two objects are only equal if they are the same object in memory.
```python
def __eq__(self, other):
    return self.x == other.x and self.y == other.y
```

**`__len__`**: defines what `len(obj)` returns. Must be a non-negative integer.
```python
def __len__(self):
    return len(self.x)
```

**`__add__`**: defines the `+` operator. Should return a new object, not modify `self`.
```python
def __add__(self, other):
    return ClassName(self.x + other.x, self.y + other.y, ...)
```

**`__getitem__`**: defines bracket access `obj[key]`. The value inside the brackets is passed as `index`.
```python
def __getitem__(self, key):
    return self.obj[key]
```

**`__bool__`**: defines the truth value of an object, used in `if obj:` checks and `bool(obj)`. Returns `True` or `False`.
```python
def __bool__(self):
    return len(self.x) > 0
```

**`__del__`**: called when the object is about to be destroyed (garbage collected). Used for cleanup.
```python
def __del__(self):
    print("Object deleted")
```

## Requirements

Define a class `Basket` that represents a shopping basket containing items (each item is a string).

Implement the following:

- **`__init__(self, items)`**: assigns `items` (a list of strings) as an instance attribute
- **`__str__(self)`**: returns `"Basket: <item1>, <item2>, ..."` (items joined by `", "`)  
  Example: `"Basket: Apple, Banana, Milk"`
- **`__repr__(self)`**: returns `"Basket(items=['Apple', 'Banana', 'Milk'])"` (use the actual list repr)
- **`__eq__(self, other)`**: two baskets are equal if they contain the same items in the same order
- **`__len__(self)`**: returns the number of items in the basket
- **`__add__(self, other)`**: returns a **new** `Basket` combining items from both baskets
- **`__getitem__(self, index)`**: returns the item at the given index

Then run the following code to trigger each dunder:

```python
b1 = Basket(["Apple", "Banana", "Milk"])
b2 = Basket(["Eggs", "Butter"])
b3 = Basket(["Apple", "Banana", "Milk"])

print(b1)           # __str__
print(repr(b1))     # __repr__
print(b1 == b3)     # __eq__ → True
print(b1 == b2)     # __eq__ → False
print(len(b1))      # __len__ → 3
print(b1 + b2)      # __add__ → Basket: Apple, Banana, Milk, Eggs, Butter
print(b1[1])        # __getitem__ → Banana
```