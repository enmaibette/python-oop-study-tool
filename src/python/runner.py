import unittest, json

class _Tracker(unittest.TestResult):
    def __init__(self):
        super().__init__()
        self.successes = []
    def addSuccess(self, test):
        self.successes.append(test)

def _id(t): return t._testMethodName
def _doc(t): return (getattr(t, '_testMethodDoc', None) or '').strip()
def _title(t): return _doc(t).split('\n')[0].strip() or _id(t)
def _exp(t):
    lines = _doc(t).split('\n')
    return lines[1].replace('Expected:', '').strip() if len(lines) > 1 else ''

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    result = _Tracker()
    suite.run(result)
    print(json.dumps(
        [{"id": _id(t), "title": _title(t), "expected": _exp(t), "got": _exp(t), "status": "pass"} for t in result.successes] +
        [{"id": _id(t), "title": _title(t), "expected": _exp(t), "got": msg, "status": "fail"} for t, msg in result.failures] +
        [{"id": _id(t), "title": _title(t), "expected": _exp(t), "got": msg, "status": "fail"} for t, msg in result.errors]
    ))
