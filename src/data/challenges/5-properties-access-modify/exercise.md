---
id: '5'
title: 'Accessing and Modifying Properties'
canvas: 'false'
---

# Accessing and Modifying Properties

## Description
**Instance properties** (also called instance attributes) are the values that belong to one specific object. You interact with them through **dot notation**.

### Reading
```python
print(animal.name)
```

Python looks up `name` first on the instance, then on the class. If neither has it, you get `AttributeError`.

### Writing
```python
animal.name = "Rex"
```

This creates or replaces an instance attribute. The class is not affected.

### Per-instance independence
Each instance has its own set of attribute values. Modifying one does not touch any other instance:

```python
a = Animal("A", 5)
b = Animal("B", 10)
a.age = 999
print(a.age)   # 999
print(b.age)   # 10  -> unaffected
```

Internally, every instance has a `__dict__` mapping attribute names to values. Reading/writing properties simply reads/writes that dict.

```python
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

b = Animal("Rex", 10)
print(b.__dict__)   # {'name': 'Rex', 'age': 10}
```

## Requirements
- Define a class `Book`
- `__init__(self, title, pages)` assigns both as instance attributes
- Create `book = Book("1984", 328)`
- Print `book.title`
- Print `book.pages`
- Reassign `book.pages = 350`
- Print `book.pages` again to show the new value
