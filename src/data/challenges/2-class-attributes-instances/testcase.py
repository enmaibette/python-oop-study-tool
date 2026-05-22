import io
import sys
import importlib
import unittest
from runner import run_tests
from contextlib import redirect_stdout

import main


class TestClassAttributesAndInstances(unittest.TestCase):
    def setUp(self):
        importlib.reload(main)

    def test_dog_is_class(self):
        """Dog must be defined as a class.
        Expected: isinstance(main.Dog, type) is True"""
        self.assertTrue(hasattr(main, "Dog"))
        self.assertIsInstance(main.Dog, type)

    def test_class_attribute_species(self):
        """Dog has class attribute `species` equal to 'Canis familiaris'.
        Expected: Dog.species == 'Canis familiaris'"""
        self.assertEqual(main.Dog.species, "Canis familiaris")

    def test_two_instances_distinct(self):
        """Two Dog instances are different objects in memory.
        Expected: dog1 is dog2 evaluates to False"""
        d1 = main.Dog()
        d2 = main.Dog()
        self.assertIsNot(d1, d2)

    def test_instance_reads_class_attribute(self):
        """Each instance reads species through dot access.
        Expected: instance.species == 'Canis familiaris'"""
        d = main.Dog()
        self.assertEqual(d.species, "Canis familiaris")

    def test_printed_output(self):
        """Module prints species twice and the identity comparison result.
        Expected: stdout contains 'Canis familiaris' at least twice and 'False'"""
        captured = io.StringIO()
        with redirect_stdout(captured):
            importlib.reload(main)
        output = captured.getvalue()
        self.assertGreaterEqual(output.count("Canis familiaris"), 2)
        self.assertIn("False", output)


run_tests(TestClassAttributesAndInstances)
