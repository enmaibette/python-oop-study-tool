import importlib
import unittest
import builtins
from runner import run_tests
import main

class _FakeCanvas:
    def __init__(self):
        self.calls = []
    def draw_line(self, x1, y1, x2, y2, color="black"):
        self.calls.append((x1, y1, x2, y2, color))
    def draw_image(self, *args, **kwargs):
        self.calls.append(("image", args, kwargs))


_FAKE = _FakeCanvas()
builtins.canvas = _FAKE

class TestInheritanceShapes(unittest.TestCase):
    def setUp(self):
        builtins.canvas = _FAKE
        _FAKE.calls.clear()
        importlib.reload(main)

    def test_shape_is_class(self):
        """Shape must be defined as a class.
        Expected: isinstance(main.Shape, type) is True"""
        self.assertIsInstance(main.Shape, type)

    def test_line_is_subclass_of_shape(self):
        """Line inherits from Shape.
        Expected: issubclass(Line, Shape) is True"""
        self.assertTrue(issubclass(main.Line, main.Shape))

    def test_cross_is_subclass_of_shape(self):
        """Cross inherits from Shape.
        Expected: issubclass(Cross, Shape) is True"""
        self.assertTrue(issubclass(main.Cross, main.Shape))

    def test_shape_attributes(self):
        """Shape assigns color, x, y from __init__.
        Expected: Line('red', 50, 50, 300).color == 'red', .x == 50, .y == 50"""
        line = main.Line("red", 50, 50, 300)
        self.assertEqual(line.color, "red")
        self.assertEqual(line.x, 50)
        self.assertEqual(line.y, 50)

    def test_line_length_attribute(self):
        """Line assigns length from __init__.
        Expected: Line('red', 50, 50, 300).length == 300"""
        line = main.Line("red", 50, 50, 300)
        self.assertEqual(line.length, 300)

    def test_cross_size_attribute(self):
        """Cross assigns size from __init__.
        Expected: Cross('blue', 100, 50, 200).size == 200"""
        cross = main.Cross("blue", 100, 50, 200)
        self.assertEqual(cross.size, 200)

    def test_line_draw_uses_canvas(self):
        """Line.draw calls canvas.draw_line once with the correct coordinates.
        Expected: draw_line called with (50, 50, 350, 50, color='red')"""
        _FAKE.calls.clear()
        main.Line("red", 50, 50, 300).draw()
        self.assertEqual(len(_FAKE.calls), 1)
        x1, y1, x2, y2, color = _FAKE.calls[0]
        self.assertEqual((x1, y1, x2, y2), (50, 50, 350, 50))
        self.assertEqual(color, "red")

    def test_cross_draw_uses_canvas_twice(self):
        """Cross.draw calls canvas.draw_line twice for the two diagonals.
        Expected: both diagonals drawn with color='blue'"""
        _FAKE.calls.clear()
        main.Cross("blue", 100, 50, 200).draw()
        self.assertEqual(len(_FAKE.calls), 2)
        coords = sorted([(c[0], c[1], c[2], c[3]) for c in _FAKE.calls])
        expected = sorted([(100, 50, 300, 250), (300, 50, 100, 250)])
        self.assertEqual(coords, expected)
        for call in _FAKE.calls:
            self.assertEqual(call[4], "blue")

    def test_line_uses_super_init(self):
        """Line calls super().__init__ to set color, x, y from Shape.
        Expected: Line('red', 50, 50, 300).color == 'red', .x == 50, .y == 50"""
        line = main.Line("red", 50, 50, 300)
        self.assertEqual(line.color, "red")
        self.assertEqual(line.x, 50)
        self.assertEqual(line.y, 50)

run_tests(TestInheritanceShapes)