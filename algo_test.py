from algorithm import EmbeddingTransformer, CustomMultiLabelBinarizer, CustomMultiLabelEmbeddingTransformer, form_groups_greedy, find_best_k
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import euclidean_distances
import spacy
import numpy as np
from sklearn.metrics import silhouette_score
import random
import matplotlib.pyplot as plt
import time

def evaluate_groups(X, data):
    similarities = []
    for group in data['group'].unique():
        group_data = data[data['group'] == group]
        group_indices = list(group_data.index)
        group_vectors = X[group_indices]
        if len(group_vectors) < 2:  # If the group has fewer than 2 members, skip
            similarities.append(1.0)  # Consider it fully similar
            continue
        # Calculate pairwise Euclidean distances within the group
        distance_matrix = euclidean_distances(group_vectors)
        # Convert distances to similarities (e.g., by taking the inverse)
        similarity_matrix = 1 / (1 + distance_matrix)
        # Take the average of the upper triangle (excluding the diagonal)
        avg_similarity = np.mean(similarity_matrix[np.triu_indices(len(group_vectors), k=1)])
        similarities.append(avg_similarity)
    return np.mean(similarities)

# Generate a list of 8 non-negative integers that add up to 10
def generate_random_list(sum_total, length):
    # Start with a list of zeros
    result = [0] * length
    for _ in range(sum_total):
        # Randomly increment one of the elements
        result[random.randint(0, length - 1)] += 1
    return result

def generate_random_student():
    # Generate random GPA
    gpa = np.clip(np.random.normal(3, 1), 0, 4)  # Normal distribution centered at 3.0, clipped to [0, 4]
    meeting_freq = random.randint(1, 7) 
    return {
        'GPA': round(gpa, 2),
        'major': random.choice(major_categories),
        'minor': random.choice(minor_categories),
        'courses_taken': random.sample(courses_categories, k=random.randint(1, len(courses_categories))),
        'areas_of_interest': random.sample(interests_categories, k=random.randint(1, len(interests_categories))),
        'technical_skills': random.sample(skills_categories, k=random.randint(1, len(skills_categories))),
        'schedule': random.sample(schedule_categories, k=random.randint(1, len(schedule_categories))), # change according to questionnaire
        'meeting_freq': meeting_freq # change according to questionnaire
    }

def generate_students(n):
    return pd.DataFrame([generate_random_student() for _ in range(n)])

# Visualizing the clusters
def visualize_clusters(X, labels):
    pca = PCA(n_components=2)
    principal_components = pca.fit_transform(X)
    plt.figure(figsize=(10, 7))
    plt.scatter(principal_components[:, 0], principal_components[:, 1], c=labels, cmap='viridis', marker='o', edgecolor='k', s=100)
    plt.title('Cluster Visualization')
    plt.xlabel('Principal Component 1')
    plt.ylabel('Principal Component 2')
    plt.colorbar(label='Cluster Label')
    plt.show()


# Define predefined categories
major_categories = ['CS', 'EE', 'ME', 'CE', 'INDY']
minor_categories = ['Math', 'Physics', 'Chem', 'Econ', 'Business', 'None']
courses_categories = ["Electric and Magnetic Fields", "Fields and Waves", "Dynamics", "Communication Systems", "Electric Drives", "Computer Systems Programming", "Physiological Control Systems", "Sensory Communication", "Introduction to Electronic Devices", "Mechanics"]
interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
schedule_categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

# Example usage:
n = 10  # Number of students to generate
group_size = 4 # Number of students per group
data = generate_students(n)
# Save the student data to a CSV file
data.to_pickle('student_data.pkl')

# Load the student data from the CSV file for later use
#data = pd.read_pickle('student_data.pkl')
#print(data)

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', MinMaxScaler(), ['GPA']),
        ('major', EmbeddingTransformer(), 'major'),
        ('minor', EmbeddingTransformer(), 'minor'),
        ('courses', CustomMultiLabelEmbeddingTransformer(), 'courses_taken'),
        ('interests', CustomMultiLabelEmbeddingTransformer(), 'areas_of_interest'),
        ('skills', CustomMultiLabelEmbeddingTransformer(), 'technical_skills'),
        ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
        ('freq', MinMaxScaler(), ['meeting_freq']),
    ])

dealbreakers_preprocessor = ColumnTransformer(
    transformers=[
        ('interests', CustomMultiLabelEmbeddingTransformer(), 'areas_of_interest'),
        ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
        ('freq', MinMaxScaler(), ['meeting_freq']),
    ])

start_time = time.time()

# Apply transformations and convert the dataframe into a list of embeddings, where each student is represented by a single embedding vector
X = preprocessor.fit_transform(data)
print(X[0])

# Select only certain columns (features) for clustering, also called 'dealbreakers'
clustering_features = data[['areas_of_interest', 'schedule', 'meeting_freq']]
# Convert into list of embeddings
dealbreakers = dealbreakers_preprocessor.fit_transform(clustering_features)

# Clustering
k_range = range(2, 10)  # Testing k values
best_k, best_labels = find_best_k(X, dealbreakers, k_range)
print(f"Best k: {best_k}")

# Assign clusters to students
data['cluster'] = best_labels

print("Silhouette Score (Average):", silhouette_score(X, data['cluster']))

# Form groups of 4 students within each cluster using Greedy approach
form_groups_greedy(data, group_size)
print(data)

end_time = time.time()
runtime = end_time - start_time
print(f"The algorithm took {runtime} seconds")

avg_similarity = evaluate_groups(X_combined, data)

print(f"Average similarity: {avg_similarity}")

visualize_clusters(X, data['cluster'])
