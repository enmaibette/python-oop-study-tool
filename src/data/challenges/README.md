# Challenge Content Structure

Each challenge lives in its own folder.

Required files per challenge:
- `exercise.md`
- `hints.md`
- `templateCode/*.py`
- `testcase.py`

`exercise.md` format:

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

The runtime aggregator is `src/data/challenges/index.ts`.






