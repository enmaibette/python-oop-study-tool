import unittest
from basic_usage import Dog
from runner import run_tests


class TestDog(unittest.TestCase):
    def test_dog_class_exists(self):
        """A class named `Dog` should be defined.
        Expected: Dog should be defined as a class."""
        self.assertTrue(isinstance(Dog, type))

    def test_dog_can_be_instantiated(self):
        """You should be able to create a Dog instance: Dog().
        Expected: an instance of Dog"""
        d = Dog()
        self.assertIsNotNone(d)

    def test_dog_instance_is_dog(self):
        """An instance created from Dog should be of type Dog.
        Expected: a Dog instance"""
        d = Dog()
        self.assertIsInstance(d, Dog)

    def test_dog_method_equals(self):
        """The Dog class should have a method named `method` that returns the string "Woof!".
        Expected: Dog().method() should return "Woof!"."""
        d = Dog()
        self.assertEqual(Dog().method(), "Woof!")


run_tests(TestDog)