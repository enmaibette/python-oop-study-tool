# Challenge Content Structure

Each challenge lives in its own folder. 
Each folder name starts with a numeric id followed by a dash and the title of the challenge in kebab-case. 
For example: `1-class-definition`. 
The order is then defined by numerical comparison of the id. 
The id in the folder name and the `exercise.md` file must be the same.

Required files per challenge:
- `exercise.md`
  ```markdown
    ---
    id: '<numeric id>'
    title: '<Title of the challenge>'
    canvas: 'true' | 'false'  # true if the learner must use python_oop_canvas in this challenge
    ---
    
    # Title
    ## Description
    ...
    
    ## Requirements
    - Requirement text
    
    ## Example
    ```python
    print('hello')
    ```
- `hints.md`
  - a list of hints
  - format:
    ```markdown
    - Hint 1
    - Hint 2
    ...
    ```
- `templateCode/*.py`
  - starter code for the challenge
  - file name is not important, but it must be a `.py` file and contain valid python
- `testcase.py`
  - must call the function `run_tests(Classname)` that runs all the test cases and returns the results
  - unit tests
  - each test case needs a docstring that describes the test case (title) and the expected output
  - each test class contains the following `setUp` method:
    ```python
    def setUp(self):
        importlib.reload(main)
    ```
  - Test with canvas must contain the following:
    ```python
    _REAL_CANVAS = builtins.canvas # save the real canvas to restore later
    class TestInheritanceShapes(unittest.TestCase):
        def setUp(self):
            self.fake_canvas = MagicMock()
            builtins.canvas = self.fake_canvas
            importlib.reload(main)
            self.fake_canvas.reset_mock() # remove the calls form the main class
        
        def tearDown(self):
            builtins.canvas = _REAL_CANVAS
    ```

Check the challenge `src/data/challenges/1-class-definition` for an example of the required structure and files.

The runtime aggregator is `src/data/challenges/index.ts`.




