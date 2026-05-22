import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestClassDefinition(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_animal_is_class(self):
        """Animal must be defined as a class in main.py.
        Expected: isinstance(main.Animal, type) is True"""
        self.assertTrue(hasattr(main, "Animal"), "Animal is not defined in main.py")
        self.assertIsInstance(main.Animal, type)

    def test_animal_has_no_custom_attributes(self):
        """Animal has no custom attributes beyond Python defaults.
        Expected: no non-dunder names in Animal.__dict__"""
        custom = [k for k in main.Animal.__dict__.keys() if not k.startswith("__")]
        self.assertEqual(custom, [])

    def test_animal_can_be_instantiated(self):
        """Animal can be instantiated with no arguments.
        Expected: Animal() returns an instance of Animal"""
        r = main.Animal()
        self.assertIsInstance(r, main.Animal)

    def test_printed_type(self):
        """Module prints the type of animal1.
        Expected: stdout contains 'Animal' and 'class'"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        self.assertRegex(output, r"<class '.*Animal'>")



run_tests(TestClassDefinition)
