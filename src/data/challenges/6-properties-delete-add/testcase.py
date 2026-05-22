import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestDeleteAddProperties(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_user_is_class(self):
        """User must be defined as a class.
        Expected: isinstance(main.User, type) is True"""
        self.assertIsInstance(main.User, type)

    def test_email_added_only_to_u1(self):
        """email exists on u1 only, not on freshly created u2.
        Expected: hasattr(u1, 'email') True, hasattr(u2, 'email') False"""
        u1 = main.User("Nina")
        u2 = main.User("Rolf")
        u1.email = "nina@example.com"
        self.assertTrue(hasattr(u1, "email"))
        self.assertFalse(hasattr(u2, "email"))

    def test_delete_name_per_instance(self):
        """del u2.name removes name from u2 only, u1 still has it.
        Expected: hasattr(u2, 'name') False, hasattr(u1, 'name') True"""
        u1 = main.User("Nina")
        u2 = main.User("Rolf")
        del u2.name
        self.assertFalse(hasattr(u2, "name"))
        self.assertTrue(hasattr(u1, "name"))

    def test_printed_output(self):
        """Module prints the three hasattr results.
        Expected: stdout contains 'True' at least once and 'False' at least twice"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        self.assertGreaterEqual(output.count("True"), 1)
        self.assertGreaterEqual(output.count("False"), 2)


run_tests(TestDeleteAddProperties)
