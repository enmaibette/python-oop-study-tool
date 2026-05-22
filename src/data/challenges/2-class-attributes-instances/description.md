---
id: '2'
title: 'Class Attributes and Instances'
canvas: 'false'
---

# Class Attributes and Instances

## Description
A **class attribute** is a value declared directly inside the class body, outside any method. It lives on the class itself and is **shared** by every instance.

```python
class Car:
    wheels = 4   # class attribute, shared by all Cars
```

Each call to the class (`Car()`) produces a **new, independent object** in memory. Even when two instances look identical, they are distinct objects.

**Class vs. object** - keep these terms separate in your head:

| Class | Object (instance) |
|-------|-------------------|
| The blueprint / type | A concrete realisation of the blueprint |
| Created with `class Foo:` | Created with `Foo()` |
| Exists once | Can exist many times |

There are also two different ways to compare two variables:

- `==` checks **equality** of value (overridable via `__eq__`)
- `is` checks **identity** - whether they refer to the same object in memory

For freshly created instances of a plain class, both `==` and `is` return `False` between two different instances.

```python
c1 = Car()
c2 = Car()
print(c1 is c2)   # False  - different objects
```

## Requirements
- Define a class named `Dog`
- Add a class attribute `species` set to `"Canis familiaris"`
- Create two instances of `Dog` named `dog1` and `dog2`
- Print `dog1.species` and `dog2.species` on separate lines
- Print `dog1 is dog2` to show they are different objects
