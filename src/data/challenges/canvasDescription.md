# Canvas

The `canvas` object lets you draw graphics directly from your Python code. It is **not** part of the standard Python library. It's a custom module injected into the Pyodide runtime for education purposes. Under the hood, the JavaScript worker registers a `canvas` JS object with Pyodide and wraps it in a Python class that is placed on `builtins`, so it is available globally in every script without any import.

> **Note:** `canvas` only exists in this browser-based environment. Code that uses it will not work in a normal Python installation.

---

## Available functions

- `canvas.draw_line(x1, y1, x2, y2, color='black')`
  - Draws a straight line between two points on the canvas.
  - Possible Parameters:
    | Parameter | Type | Description |
    |-----------|------|-------------|
    | `x1` | `int \| float` | X coordinate of the start point |
    | `y1` | `int \| float` | Y coordinate of the start point |
    | `x2` | `int \| float` | X coordinate of the end point |
    | `y2` | `int \| float` | Y coordinate of the end point |
    | `color` | `str` | Any valid CSS color string (e.g. `'red'`, `'#ff0000'`). Defaults to `'black'` |
  - Usage:
     ```python
      canvas.draw_line(0, 0, 200, 200)
      canvas.draw_line(0, 100, 300, 100, color='blue')
      ```
- `canvas.draw_image(path, dx, dy, dw=None, dh=None)`
  - Draws an image file onto the canvas. The file must exist in the virtual filesystem (i.e. it should be included as an asset in the challenge). 
  - Possible Parameters:
    | Parameter | Type | Description |
    |-----------|------|-------------|
    | `path` | `str` | Path to the image file in the virtual filesystem |
    | `dx` | `int \| float` | X coordinate of the top-left corner |
    | `dy` | `int \| float` | Y coordinate of the top-left corner |
    | `dw` | `int \| float \| None` | Optional width to scale the image to |
    | `dh` | `int \| float \| None` | Optional height to scale the image to |
  - Usage:
    ```python
    canvas.draw_image('logo.png', 50, 50) 
    canvas.draw_image('logo.png', 50, 50, dw=100, dh=80)
    ```
