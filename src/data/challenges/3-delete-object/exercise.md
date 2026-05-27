---
id: '3'
title: 'Deleting an Object'
canvas: 'false'
---

# Deleting an Object

## Description
Python manages memory automatically. Each object keeps a **reference count** - the number of names currently pointing at it. When this count drops to zero, the garbage collector destroys the object and reclaims its memory.

The `del` statement explicitly removes a binding between a name and an object:

```python
x = [1, 2, 3]
del x        # the name x is gone
print(x)     # NameError: name 'x' is not defined
```

If `del` causes the last reference to disappear, the object is destroyed. You can hook into that moment with the **`__del__` dunder method** (a *destructor*). Dunder methods will be covered in more detail later, but for now, you can think of `__del__` as a special method that runs when an object is about to be destroyed:

```python
class Point:
    def __del__(self):
        print("being destroyed")
```

> **Note**: `__del__` is rarely needed in idiomatic Python. Use it for diagnostics or to release non-memory resources only. For most cleanup, prefer context managers (`with` blocks) - they are deterministic, while `__del__` timing is not guaranteed.

To make destruction observable in a test without relying on print order, a common pattern is a class-level `deleted` flag that `__del__` flips:

```python
class Point:
    deleted = False
    def __del__(self):
        Point.deleted = True
```

> **Note**: `deleted` is a class attribute, so it reflects the state of all instances. If any instance is deleted, `Item.deleted` becomes `True` and stays `True` for the lifetime of the program unless it would be reset manually.

## Requirements
- Define a class named `Item`
- Add a class attribute `deleted` set to `False`
- Implement `__del__(self)` that sets `Item.deleted = True`
- Create an instance `item1`
- Delete `item1` using the `del` statement
- Print `Item.deleted`
