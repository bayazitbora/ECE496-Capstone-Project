This branch contains the algorithm that clusters students and forms optimal groups based on a set of attributes. 

Usage: The backend should import algorithm.py and call 'cluster_and_match_students', providing the following input parameters:
  - data: DataFrame containing student data with attributes; each row corresponds to a student, each column corresponds to an attribute
  - schedule_categories: List of possible schedule categories for one-hot encoding (e.g. ["Monday 9:00", "Monday 10:00", ..., "Saturday 21:00"])
  - group_size: The desired number of students in each group

The function modifies the input DataFrame by adding 'cluster' and 'group' columns, where each student has an integer identifier corresponding to their unique cluster and group.

The algo_test.py and eval_clustering_algos.py are test scripts that will not be used in the final product, and can be described as follows: 
- algo_test.py: Tests the algorithm using a random synthetic student dataset
- eval_clustering_algos.py: Evaluates different clustering algorithms with synthetic student data according to two metrics; latency and silhouette score. Creates a comparison table and saves it to a CSV file (student_comparision.csv)
