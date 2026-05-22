---
id: '7'
title: 'Modifying a Class Property'
canvas: 'false'
---

# Modifying a Class Property

## Description
Class attributes live **on the class**, not on the individual instances. They are shared by every instance that hasn't defined its own version. This has two important consequences.

### 1. Modifying the class attribute updates every instance
If you change the value through the class itself, every instance immediately sees the new value:

```python
class Animal:
    species = "Unknown"

animal1 = Animal()
animal2 = Animal()
Animal.species = "Cat"
print(animal1.species, anima2.species)  # Cat Cat
```

### 2. Assigning through an instance creates a shadow
Writing `animal1.species = cat` does **not** change the class attribute. Instead it creates a brand-new instance attribute on `animal1` that *shadows* the class one for that instance only:

```python
animal1.species = "Cat"
print(animal1.species)  # Cat  -> instance attribute
print(animal2.species) # Unknown -> strill reads class attribute
print(Animal.species) # Unknown -> class attribute unchanged

```

### Attribute lookup order
When you read `obj.attr`, Python searches in this order:

1. The instance's `__dict__`
2. The class's `__dict__`
3. The parent classes' `__dict__` (MRO - covered in inheritance)

The first match wins. Writing `obj.attr = value` always goes to the instance dict - that is exactly why shadowing happens.

> **Note:** Never put a mutable value (`[]`, `{}`) directly as a class attribute and then mutate it through `self`. All instances share the same list.

## Requirements
- Define `Counter` with a class attribute `total` set to `0`
- Create instances `a` and `b`
- Set `Counter.total = 10`
- Print `a.total` and `b.total` (both should be `10`)
- Set `a.total = 99` (creates an instance attribute on `a`)
- Print `a.total` and `b.total` again (only `a` is `99`)
