---
id: '6'
title: 'Deleting and Adding Properties'
canvas: 'false'
---

# Deleting and Adding Properties

## Description
Python is a **dynamically typed** language. The set of attributes an object has is not fixed at class definition time - you can add or remove attributes at runtime, **per instance**.

### Adding a property dynamically
```python
class Dog:
    def __init__(self, name):
        self.name = name

dog1 = Dog("Rex")
dog1.age = 5 # new attribute, only on dog1
```

The new attribute exists **only on that one instance**. Another instance of the same class does not magically gain `age`.

### Deleting a property
The `del` statement also works on attributes:

```python
del dog1.age     # removes age from dog1
print(dog1.age)   # AttributeError
```

Like with adding, deletion is per-instance: other instances are untouched.

### Checking existence safely
Rather than catching `AttributeError`, you can use `hasattr(obj, "name")` which returns `True` or `False`.

### When (not) to use this
Dynamic attributes are powerful but easy to abuse. They make a class hard to reason about because the attribute set is no longer documented in `__init__`. Use them sparingly - typically for caches, plugin hooks, or quick scripts. For clear, maintainable code, declare every attribute in `__init__`.

## Requirements
- Define `User` with `__init__(self, name)` that assigns `self.name = name`
- Create `u1 = User("Nina")` and `u2 = User("Rolf")`
- Add attribute `email` to `u1` with value `"nina@example.com"`
- Delete the `name` attribute from `u2` using `del`
- Print `hasattr(u1, "email")`  (expected `True`)
- Print `hasattr(u2, "email")`  (expected `False`)
- Print `hasattr(u2, "name")`   (expected `False`)
