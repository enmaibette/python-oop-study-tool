import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestClassPropertyMutation(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_counter_has_class_attribute(self):
        """Counter has a class attribute named `total`.
        Expected: hasattr(Counter, 'total') is True"""
        self.assertTrue(hasattr(main.Counter, "total"))

    def test_class_mutation_affects_all_instances(self):
        """Modifying Counter.total updates every instance that has not shadowed it.
        Expected: a.total == 42 and b.total == 42 after Counter.total = 42"""
        a = main.Counter()
        b = main.Counter()
        main.Counter.total = 42
        self.assertEqual(a.total, 42)
        self.assertEqual(b.total, 42)

    def test_instance_shadowing(self):
        """Assigning a.total creates an instance attribute that shadows the class one.
        Expected: a.total == 99 but b.total still reads the class value"""
        main.Counter.total = 10
        a = main.Counter()
        b = main.Counter()
        a.total = 99
        self.assertEqual(a.total, 99)
        self.assertEqual(b.total, 10)

    def test_printed_output_sequence(self):
        """Module prints 10, 10, 99, 10 in that order.
        Expected: stdout has at least two 10s before the 99 and at least one 10 after"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        nums = [t for t in output.replace("\n", " ").split() if t.lstrip("-").isdigit()]
        self.assertIn("10", nums)
        self.assertIn("99", nums)
        idx_99 = nums.index("99")
        tens_before = sum(1 for n in nums[:idx_99] if n == "10")
        tens_after = sum(1 for n in nums[idx_99 + 1:] if n == "10")
        self.assertGreaterEqual(tens_before, 2)
        self.assertGreaterEqual(tens_after, 1)


run_tests(TestClassPropertyMutation)
