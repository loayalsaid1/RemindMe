#!/usr/bin/python3
"""Minimal Unittesting for the as it's mostly testing manually
     and it's not very  crutial for the app now and in the timeframe given
"""

import unittest
from console import RemindMeConsole
from models import storage
from unittest.mock import patch
import io


"""
    console.. take commands. and print output..
    create class  => id
    show class id => str(obj)
    all => get all data in a storage


"""


class TestConsole(unittest.TestCase):
    """Tests for the console"""
    def setUp(self):
        """Initial oberations before each test to add context"""
        self.console = RemindMeConsole()

    def tearDown(self):
        """Clean up after each test"""
        del self.console

    @patch('sys.stdout', new_callable=io.StringIO)
    def test_create(self, mock_stdout):
        """Test Create command"""
        """
            create.. creates a on object..and adds on to the storage
        """
        # test the correct output
        self.console.onecmd('create BaseModel')
        result = mock_stdout.getvalue().strip()
        self.assertEqual(len(result), 36)

        # test adding the object to the storage
        objects_length = len(storage.all())
        self.console.onecmd('create BaseModel')
        self.assertEqual(len(storage.all()), objects_length + 1)

    def test_quit(self):
        """Test quitting the console vie `quit`"""
        result = self.console.onecmd("quit")
        self.assertTrue(result)
