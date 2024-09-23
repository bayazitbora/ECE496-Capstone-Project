# Student Grouping Algorithm

This branch contains the algorithm that clusters students and forms optimal groups based on a set of attributes.

## Usage

To use the algorithm, the backend should import `algorithm.py` and call the function `cluster_and_match_students`. The following input parameters are required:

- **data**: A DataFrame containing student data with attributes. Each row corresponds to a student, and each column corresponds to an attribute.
- **schedule_categories**: A list of possible schedule categories for one-hot encoding (e.g. `["Monday 9:00", "Monday 10:00", ..., "Saturday 21:00"]`).
- **group_size**: The desired number of students in each group.

### Output

The function modifies the input DataFrame by adding two new columns:

- **cluster**: An integer identifier corresponding to the student's unique cluster.
- **group**: An integer identifier corresponding to the student's assigned group.

## Test Scripts

The following test scripts are provided for testing and evaluation purposes but will not be included in the final product:

- **algo_test.py**: Tests the algorithm using a random synthetic student dataset.
- **eval_clustering_algos.py**: Evaluates different clustering algorithms with synthetic student data according to two metrics:
  - Latency (runtime of the clustering algorithm)
  - Silhouette score

  This script creates a comparison table and saves it to a CSV file (`student_comparision.csv`).
