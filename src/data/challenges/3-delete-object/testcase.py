import io
import sys
import importlib
import gc
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestDeleteObject(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)
        main.Item.deleted = False
        gc.collect()

    def test_item_is_class(self):
        """Item must be defined as a class.
        Expected: isinstance(main.Item, type) is True"""
        self.assertIsInstance(main.Item, type)

    def test_has_deleted_flag(self):
        """Item has a class attribute `deleted`.
        Expected: hasattr(Item, 'deleted') is True"""
        self.assertTrue(hasattr(main.Item, "deleted"))

    def test_del_triggers_flag(self):
        """Deleting an Item instance flips Item.deleted to True via __del__.
        Expected: Item.deleted == True after del"""
        main.Item.deleted = False
        it = main.Item()
        del it
        gc.collect()
        self.assertTrue(main.Item.deleted)

    def test_printed_output(self):
        """Module prints True after deleting item1.
        Expected: stdout contains 'True'"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        self.assertIn("True", captured.getvalue())


run_tests(TestDeleteObject)
