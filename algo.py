import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.decomposition import PCA
import spacy
import numpy as np
from sklearn.metrics import silhouette_score
import random
import matplotlib.pyplot as plt

# Load the spacy model
nlp = spacy.load('en_core_web_sm')

class EmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, categories):
        self.categories = categories
        self.embeddings = {cat: nlp(cat).vector for cat in categories}
        self.scaler = MinMaxScaler()

    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        transformed = np.array([self.embeddings[val] for val in X.squeeze()])
        normalized = self.scaler.fit_transform(transformed)
        normalized = np.clip(normalized, 0, 1)
        return normalized

class CustomMultiLabelEmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, categories):
        self.categories = categories
        self.embeddings = {cat: nlp(cat).vector for cat in categories}
        self.scaler = MinMaxScaler()

    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        transformed = np.array([np.mean([self.embeddings[val] for val in vals], axis=0) for vals in X])
        normalized = self.scaler.fit_transform(transformed)
        normalized = np.clip(normalized, 0, 1)
        return normalized

def generate_random_student():
    gpa = np.clip(np.random.normal(3, 1), 0, 4)  # Normal distribution centered at 3.0, clipped to [0, 4]
    return {
        'GPA': round(gpa, 2),
        'major': random.choice(major_categories),
        'minor': random.choice(minor_categories),
        'courses_taken': random.sample(courses_categories, k=random.randint(1, len(courses_categories))),
        'areas_of_interest': random.sample(interests_categories, k=random.randint(1, len(interests_categories))),
        'technical_skills': random.sample(skills_categories, k=random.randint(1, len(skills_categories))),
        'schedule': random.sample(schedule_categories, k=random.randint(1, len(schedule_categories))),
        'personality_scores': [random.randint(0, 10) for _ in range(20)]
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

# Form groups using Greedy approach based on personality scores
def form_groups_greedy(data, group_size):
    groups_num = 0
    for cluster in data['cluster'].unique():
        cluster_data = data[data['cluster'] == cluster]
        remaining_indices = list(cluster_data.index)
        while len(remaining_indices) >= group_size:
            group = []
            # Greedy approach to find the group with the smallest sum of personality score distances
            for _ in range(group_size):
                if not group:
                    first_index = remaining_indices.pop(0)
                    group.append(first_index)
                else:
                    last_index = group[-1]
                    last_score = data.iloc[last_index]['personality_scores']
                    next_index = min(remaining_indices, key=lambda idx: np.linalg.norm(np.array(last_score) - np.array(data.iloc[idx]['personality_scores'])))
                    remaining_indices.remove(next_index)
                    group.append(next_index)
                data.loc[group, 'group'] = groups_num
            groups_num += 1
        if (len(remaining_indices)):
            data.loc[remaining_indices, 'group'] = groups_num
            groups_num += 1

    data['group'] = data['group'].astype(int)

def find_best_k(X, k_range):
    silhouette_scores = []

    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=0).fit(X)
        labels = kmeans.labels_
        score = silhouette_score(X, labels)
        silhouette_scores.append(score)
        print(f"Silhouette score for k={k}: {score}")

    best_k = k_range[np.argmax(silhouette_scores)]
    return best_k, silhouette_scores
    


# Define predefined categories
major_categories = ['CS', 'EE', 'ME', 'CE', 'INDY']
minor_categories = ['Math', 'Physics', 'Chem', 'Econ', 'Business', 'None']
courses_categories = ['CSC101', 'CSC102', 'CSC103', 'ECE201', 'ECE202', 'ME101', 'ME102']
interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
schedule_categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

# Example usage:
n = 200  # Number of students to generate
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
        ('major', EmbeddingTransformer(major_categories), 'major'),
        ('minor', EmbeddingTransformer(minor_categories), 'minor'),
        ('courses', CustomMultiLabelEmbeddingTransformer(courses_categories), 'courses_taken'),
        ('interests', CustomMultiLabelEmbeddingTransformer(interests_categories), 'areas_of_interest'),
        ('skills', CustomMultiLabelEmbeddingTransformer(skills_categories), 'technical_skills'),
        ('schedule', CustomMultiLabelEmbeddingTransformer(schedule_categories), 'schedule')
    ])

# Apply transformation
X = preprocessor.fit_transform(data)
#print(X)

# Clustering
k_range = range(2, 10)  # Testing k values
best_k, silhouette_scores = find_best_k(X, k_range)
print(f"Best k: {best_k}")
clustering = KMeans(n_clusters=best_k).fit(X)

# Assign clusters to students
data['cluster'] = clustering.labels_

print("Silhouette Score (Average):", silhouette_score(X, data['cluster']))

# Form groups of 3 students within each cluster using Greedy approach
form_groups_greedy(data, group_size)
print(data)

visualize_clusters(X, data['cluster'])






