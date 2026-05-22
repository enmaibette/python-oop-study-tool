---
id: '8'
title: 'Instance Methods'
canvas: 'false'
---

# Instance Methods

## Description
An **instance method** is a function defined inside a class. Methods describe the **behaviour** of objects - what they can *do*. While attributes hold an object's state, methods let it act on that state.

```python
class Dog:
    def __init__(self, name, age=0):
        self.name = name
        self.age = age
    def birthday(self):
        self.age += 1
    def bark(self):
        print(self.name + " says woof!")
```

### The role of `self`
Every instance method has `self` as its first parameter. When you call `account.deposit(50)`, Python rewrites that to `BankAccount.deposit(account, 50)` behind the scenes. `self` is how a method knows *which* instance it is operating on.

```python
dog_rolf.birthday()
# is equivalent to:
Dog.birthday(dog_rolf)
```

### Reading vs. modifying state
- A method that only reads `self.x` is **non-mutating** (e.g. `bark`).
- A method that writes `self.x` **mutates** the instance's state (e.g. `birthday`).

### Multiple methods
A class can have as many methods as needed. Each gets `self` and can call any other method via `self.other_method(...)`.

### Methods are class-level
Methods are stored on the class, not on each instance. Every instance shares the same method objects but uses them with its own `self`. That is why adding a thousand instances doesn't multiply method memory cost.

## Requirements
- Define a class `Book` with:
  - `__init__(...)` that takes `title` and `author` and assigns them to `self.title` and `self.author`
  - Method `describe(self)` prints the title and author in the format `"{self.title} by {self.author}"`
  - Method `change_title(self, new_title)` that updates `self.title` to `new_title`
- Create `book1 = Book("1984", "George Orwell")`
- Create `book2 = Book("Hail Mary - Andy Weir", "Andy Weir")`
- Call `book1.describe()` - the printed value must be `1984 by George Orwell`
- Call `book2.describe()` - the printed value must be `Hail Mary - Andy Weir by Andy Weir`
- Call `book2.change_title("Project Hail Mary")`
- Call `book2.describe()` - the printed value must be `Project Hail Mary by Andy Weir`
