# Student Grouping Algorithm

This branch contains the algorithm that clusters students and forms optimal groups based on a set of attributes.

## Usage

The dependencies in requirements.txt are necessary for running the algorithm. They are compatible with Python 3.12.7
To use the algorithm, the backend should import `algorithm.py` and call the function `cluster_and_match_students`. The following input parameters are required:

- **data**: A DataFrame containing student data with attributes. Each row corresponds to a student, and each column corresponds to an attribute.
- **group_size**: The desired number of students in each group.
- **schedule_categories**(optional): A list of possible schedule categories for one-hot encoding (e.g. `["Monday 9:00", "Monday 10:00", ..., "Saturday 21:00"]`).


### Output

The function modifies the input DataFrame by adding two new columns:

- **cluster**: An integer identifier corresponding to the student's unique cluster.
- **group**: An integer identifier corresponding to the student's assigned group.

## Test Scripts

The following test script is provided for testing and evaluation purposes but will not be included in the final product:

- **algo_test.py**: Tests the algorithm using a random synthetic student dataset.



