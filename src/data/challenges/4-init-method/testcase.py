import io
import sys
import importlib
import inspect
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestInitMethod(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_dog_is_class(self):
        """Dog must be defined as a class.
        Expected: isinstance(main.Dog, type) is True"""
        self.assertIsInstance(main.Dog, type)

    def test_init_signature(self):
        """Dog.__init__ accepts (self, name, age=1).
        Expected: parameter names are self, name, age with age default 1"""
        sig = inspect.signature(main.Dog.__init__)
        params = list(sig.parameters.values())
        names = [p.name for p in params]
        self.assertEqual(names[:3], ["self", "name", "age"])
        self.assertEqual(params[2].default, 1)

    def test_attributes_with_both_args(self):
        """Dog('Rex', 5) sets name and age.
        Expected: dog.name == 'Rex' and dog.age == 5"""
        d = main.Dog("Rex", 5)
        self.assertEqual(d.name, "Rex")
        self.assertEqual(d.age, 5)

    def test_default_age(self):
        """Dog('Buddy') uses the default age of 1.
        Expected: dog.age == 1"""
        d = main.Dog("Buddy")
        self.assertEqual(d.age, 1)

    def test_attributes_are_independent(self):
        """Two Dog instances keep their own name and age values.
        Expected: a.name != b.name and a.age != b.age"""
        a = main.Dog("Rex", 5)
        b = main.Dog("Buddy")
        self.assertNotEqual(a.name, b.name)
        self.assertNotEqual(a.age, b.age)

    def test_printed_output(self):
        """Module prints Rex, 5, Buddy, 1 in that order.
        Expected: stdout includes 'Rex', '5', 'Buddy', '1' in order"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        for expected in ["Rex", "5", "Buddy", "1"]:
            self.assertIn(expected, output)
        self.assertLess(output.index("Rex"), output.index("5"))
        self.assertLess(output.index("5"), output.index("Buddy"))
        self.assertLess(output.index("Buddy"), output.index("1"))


run_tests(TestInitMethod)
