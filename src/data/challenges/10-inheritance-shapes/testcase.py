import importlib
import unittest
import builtins
from runner import run_tests
from unittest.mock import MagicMock
import main


_REAL_CANVAS = builtins.canvas # save the real canvas to restore later

class TestInheritanceShapes(unittest.TestCase):
    def setUp(self):
        self.fake_canvas = MagicMock()
        builtins.canvas = self.fake_canvas
        importlib.reload(main)
        self.fake_canvas.reset_mock() # remove the calls form the main class
        
    def tearDown(self):
        builtins.canvas = _REAL_CANVAS

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
        main.Line("red", 50, 50, 300).draw()
        self.fake_canvas.draw_line.assert_called_once_with(50, 50, 350, 50, color="red")

    def test_cross_draw_uses_canvas_twice(self):
        """Cross.draw calls canvas.draw_line twice for the two diagonals.
        Expected: both diagonals drawn with color='blue'"""
        main.Cross("blue", 100, 50, 200).draw()
        self.assertEqual(self.fake_canvas.draw_line.call_count, 2)
        lines = set()
        for c in self.fake_canvas.draw_line.call_args_list:
            x1, y1, x2, y2 = c.args[:4]
            lines.add(tuple(sorted([(x1, y1), (x2, y2)])))
            self.assertEqual(c.kwargs.get("color"), "blue")
        expected = {
            tuple(sorted([(100, 50), (300, 250)])),
            tuple(sorted([(300, 50), (100, 250)])),
        }
        # comparison of sets -> it compares the content and not the order of the points
        self.assertEqual(lines, expected)

    def test_line_uses_super_init(self):
        """Line calls super().__init__ to set color, x, y from Shape.
        Expected: Line('red', 50, 50, 300).color == 'red', .x == 50, .y == 50"""
        line = main.Line("red", 50, 50, 300)
        self.assertEqual(line.color, "red")
        self.assertEqual(line.x, 50)
        self.assertEqual(line.y, 50)

run_tests(TestInheritanceShapes)