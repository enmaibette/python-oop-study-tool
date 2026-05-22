import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestAccessModifyProperties(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_book_is_class(self):
        """Book must be defined as a class.
        Expected: isinstance(main.Book, type) is True"""
        self.assertIsInstance(main.Book, type)

    def test_init_sets_attributes(self):
        """Book('1984', 328) sets title and pages.
        Expected: book.title == '1984' and book.pages == 328"""
        b = main.Book("1984", 328)
        self.assertEqual(b.title, "1984")
        self.assertEqual(b.pages, 328)

    def test_modify_pages(self):
        """Reassigning book.pages changes its value on that instance.
        Expected: book.pages == 350 after reassignment"""
        b = main.Book("1984", 328)
        b.pages = 350
        self.assertEqual(b.pages, 350)

    def test_modification_per_instance(self):
        """Modifying one instance does not change another.
        Expected: changes affect only the modified instance"""
        a = main.Book("A", 100)
        b = main.Book("B", 200)
        a.pages = 999
        self.assertEqual(a.pages, 999)
        self.assertEqual(b.pages, 200)

    def test_printed_output(self):
        """Module prints title, original pages, then updated pages.
        Expected: stdout contains '1984', '328', '350' with '350' after '328'"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        self.assertIn("1984", output)
        self.assertIn("328", output)
        self.assertIn("350", output)
        self.assertLess(output.index("328"), output.index("350"))


run_tests(TestAccessModifyProperties)
