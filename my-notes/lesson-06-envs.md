# Lesson 6: Python Environments

- env_setup.sh: all checks passed (added scikit-learn to the course env)
- Isolation test: ~/env-test has numpy 1.26.4, course env has numpy 2.5.4, on the same Mac
- uv caches packages: second install of numpy took 7 ms
- uv init + uv add: created pyproject.toml (the shopping list) and uv.lock (the receipt)
- uv init picked Python 3.15; the course uses 3.12, with no conflict
- torch warned about missing numpy in the new project: proof that environments don't share packages
- uv run runs commands inside the project env without activating it
- Global install (pip --user on system Python 3.9) went to ~/Library/Python/3.9, outside every project; uninstalled after
- Commit pyproject.toml and the lockfile, never .venv
