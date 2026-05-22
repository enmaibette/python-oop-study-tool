import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout
import main

class TestBasketDunders(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_class_exists(self):
        """Basket must be defined as a class.
        Expected: isinstance(main.Basket, type) is True"""
        self.assertIsInstance(main.Basket, type)

    def test_attributes_set(self):
        """Basket(['Apple', 'Banana']) sets items.
        Expected: b.items == ['Apple', 'Banana']"""
        b = main.Basket(["Apple", "Banana"])
        self.assertEqual(b.items, ["Apple", "Banana"])

    def test_str(self):
        """__str__ returns comma-joined items with prefix.
        Expected: str(Basket(['Apple', 'Banana', 'Milk'])) == 'Basket: Apple, Banana, Milk'"""
        b = main.Basket(["Apple", "Banana", "Milk"])
        self.assertEqual(str(b), "Basket: Apple, Banana, Milk")

    def test_repr(self):
        """__repr__ returns the developer representation.
        Expected: repr(Basket(['Apple', 'Banana', 'Milk'])) == \"Basket(items=['Apple', 'Banana', 'Milk'])\""""
        b = main.Basket(["Apple", "Banana", "Milk"])
        self.assertEqual(repr(b), "Basket(items=['Apple', 'Banana', 'Milk'])")

    def test_eq_true(self):
        """__eq__ returns True for baskets with the same items.
        Expected: Basket(['Apple', 'Banana']) == Basket(['Apple', 'Banana'])"""
        b1 = main.Basket(["Apple", "Banana"])
        b2 = main.Basket(["Apple", "Banana"])
        self.assertEqual(b1, b2)

    def test_eq_false(self):
        """__eq__ returns False for baskets with different items.
        Expected: Basket(['Apple']) != Basket(['Banana'])"""
        b1 = main.Basket(["Apple"])
        b2 = main.Basket(["Banana"])
        self.assertNotEqual(b1, b2)

    def test_len(self):
        """__len__ returns the number of items.
        Expected: len(Basket(['Apple', 'Banana', 'Milk'])) == 3"""
        b = main.Basket(["Apple", "Banana", "Milk"])
        self.assertEqual(len(b), 3)

    def test_add(self):
        """__add__ returns a new Basket combining both item lists.
        Expected: str(Basket(['Apple']) + Basket(['Eggs'])) == 'Basket: Apple, Eggs'"""
        b1 = main.Basket(["Apple"])
        b2 = main.Basket(["Eggs"])
        result = b1 + b2
        self.assertIsInstance(result, main.Basket)
        self.assertEqual(str(result), "Basket: Apple, Eggs")

    def test_add_does_not_modify_original(self):
        """__add__ must not modify the original baskets.
        Expected: b1.items == ['Apple'] after addition"""
        b1 = main.Basket(["Apple"])
        b2 = main.Basket(["Eggs"])
        _ = b1 + b2
        self.assertEqual(b1.items, ["Apple"])

    def test_getitem(self):
        """__getitem__ returns the item at the given index.
        Expected: Basket(['Apple', 'Banana', 'Milk'])[1] == 'Banana'"""
        b = main.Basket(["Apple", "Banana", "Milk"])
        self.assertEqual(b[1], "Banana")

    def test_print_uses_str(self):
        """Calling print on the instance triggers __str__.
        Expected: stdout contains 'Basket: Apple, Banana, Milk'"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            print(main.Basket(["Apple", "Banana", "Milk"]))
        self.assertIn("Basket: Apple, Banana, Milk", captured.getvalue())

run_tests(TestBasketDunders)