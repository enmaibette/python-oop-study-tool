---
id: '10'
title: 'Inheritance with Shapes'
canvas: 'true'
---

# Inheritance with Shapes

## Description
Inheritance lets you define a class that inherits all the methods and properties from another class.

- **Parent class** (also called **base class**) is the class being inherited from.
- **Child class** (also called **derived class**) is the class that inherits. It can add new methods and properties, or override existing ones.

```python
class Shape:
    def __init__(self, color):
        self.color = color
    def draw(self):
        pass

class Square(Shape):
    def draw(self):
        print(f"Drawing {self.color} square")
```

To create a child class, pass the parent class as a parameter:

```python
class Square(Shape):
    pass
```

The child class now has all the same methods and properties as the parent.

### What the subclass inherits
- `__init__` from `Shape`
- Any methods defined on `Shape`
- Class attributes from `Shape`

### Overriding
If you define a method in the child class with the same name as one in the parent, the child's version replaces the parent's for instances of that subclass. This is how each subclass gives the same operation (`draw`) its own concrete behaviour.

### `super()`
`super()` lets you call the parent's version of a method from inside the child. This is useful when the child defines its own `__init__` but still wants to run the parent's setup:

```python
class Square(Shape):
    def __init__(self, color, size):
        super().__init__(color)  # runs Shape.__init__
        self.size = size
```

It also works for any other method. Use it when you want to extend the parent's behaviour instead of fully replacing it:

```python
class Shape:
    def describe(self):
        return "I am a shape"

class Square(Shape):
    def describe(self):
        base = super().describe()
        return f"{base} and I am a square"

Square().describe()  # "I am a shape and I am a square"
```

The pattern is always the same: store the parent's return value, extend it and return the result. If you're fully replacing the behaviour, skip `super()`.

### Why this is useful
You can write code that works on the general type and have it automatically apply to every subclass:

```python
shapes = [Square("red"), Circle("blue"), Triangle("green")]
for s in shapes:
    s.draw()   # each subclass uses its own draw
```

The one method call with different behaviour is called a **polymorphic method**. In this example, `draw` is polymorphic because it behaves differently for each subclass. This topic will be covered in more depth in the next challenge.

### Vocabulary recap
| Term | Meaning |
|------|---------|
| Parent / base class | The class being inherited from |
| Child / derived class | The class that inherits |
| Override | Replace a parent method in the subclass |
| `super()` | Call the parent's version of a method |

### Canvas API recap
- `canvas.draw_line(0, 0, 300, 0, color='black')`: draws a line from `(0, 0)` to `(300, 0)` in black which is visible in the canvas

## Requirements
- Define a base class `Shape` with `__init__(self, color, x, y)` that assigns `self.color`, `self.x`, and `self.y`
- `Shape.draw(self)` exists but only does `pass`
- Define a subclass `Line(Shape)` with `__init__(self, color, x, y, length)` that calls `super().__init__(color, x, y)` and assigns `self.length`
  - Override `draw(self)` to call `canvas.draw_line(self.x, self.y, self.x + self.length, self.y, color=self.color)`
- Define a subclass `Cross(Shape)` with `__init__(self, color, x, y, size)` that calls `super().__init__(color, x, y)` and assigns `self.size`
  - Override `draw(self)` and call `canvas.draw_line` twice to draw an `X`:
    - `(self.x, self.y)` → `(self.x + self.size, self.y + self.size)` with `color=self.color`
    - `(self.x + self.size, self.y)` → `(self.x, self.y + self.size)` with `color=self.color`
- Create `line = Line("red", 50, 50, 300)` and call `line.draw()`
- Create `cross = Cross("blue", 100, 50, 200)` and call `cross.draw()`. It should look like this:

  ![Example Cross](crossExample.png)