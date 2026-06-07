import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestInstanceMethods(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_class_exists(self):
        """Book must be defined as a class.
        Expected: isInstance(main.Book, type) is True"""
        self.assertIsInstance(main.Book, type)

    def test_init_sets_title_and_author(self):
        """Constructor stores the initial balance.
        Expected: book1 = Book('Project Hail Mary','Andy Weir'); book1.title == Project Hail Mary && book2.author == Andy Weir"""
        book1 = main.Book('Project Hail Mary', 'Andy Weir')
        self.assertEqual(book1.title, 'Project Hail Mary')
        self.assertEqual(book1.author, 'Andy Weir')


    def test_change_title(self):
        """change book title
        Expected: book1.change_title('The Martial'); book1.title == 'The Martian'"""
        book1 = main.Book('Project Hail Mary', 'Andy Weir')
        book1.change_title('The Martian')
        self.assertEqual(book1.title, 'The Martian')


    def test_describe_print(self):
        """describe prints {title} by {author}.
        Expected: stdout contains '{title} by {author}'"""
        book1 = main.Book('Project Hail Mary', 'Andy Weir')
        captured = io.StringIO()
        with redirect_stdout(captured):
            book1.describe()
        output = captured.getvalue()
        self.assertIn("Project Hail Mary by Andy Weir", output)


run_tests(TestInstanceMethods)
