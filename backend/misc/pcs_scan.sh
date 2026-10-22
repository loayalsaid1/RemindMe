#!/usr/bin/bash

# Set the root directory and the command to run
root_dir="."
command="pycodestyle"  # Change this to 'pycodestyle' if you're not using an alias

# Find all .py files and run the command on each
find "$root_dir" -name "*.py" | while read -r file; do
    echo "Running $command on $file"
    $command "$file"
done

