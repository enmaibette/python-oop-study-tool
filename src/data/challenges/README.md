# Challenge Content Structure

Each challenge lives in its own folder.

Required files per challenge:
- `description.md`
- `hints.md`
- `templateCode/*.py`
- `testcase.py`

`description.md` format:

```md
---
id: '1'
title: 'Create a Class - Dog'
canvas: false
hasDiagram: false
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






