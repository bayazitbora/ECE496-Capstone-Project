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
from sentence_transformers import SentenceTransformer

# Use the all-MiniLM-L6-v2 transformer model to obtain embeddings for student attributes
# For more information, refer to documentation: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
nlp_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class EmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.scaler = MinMaxScaler()
    
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        transformed = np.array([nlp_model.encode(val) for val in X.squeeze()])
        normalized = self.scaler.fit_transform(transformed)
        normalized = np.clip(normalized, 0, 1)
        return normalized

class CustomMultiLabelEmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.scaler = MinMaxScaler()

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        transformed = np.array([np.mean([nlp_model.encode(val) for val in vals], axis=0) for vals in X])
        normalized = self.scaler.fit_transform(transformed)
        normalized = np.clip(normalized, 0, 1)
        return normalized

class CustomMultiLabelBinarizer(BaseEstimator, TransformerMixin):
    def __init__(self, classes):
        self.classes = classes
        self.mlb = MultiLabelBinarizer(classes=self.classes)

    def fit(self, X, y=None):
        self.mlb.fit(X)
        return self

    def transform(self, X):
        return self.mlb.transform(X)


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

# Form groups using Greedy approach based on personality scores
# TODO: Change the below method to form groups using Greedy approach based on the remaining attributes (gpa, major, minor, courses_taken, technical_skills)
def form_groups_greedy(data, group_size):
    groups_num = 0

    for cluster in data['cluster'].unique():
        cluster_data = data[data['cluster'] == cluster]
        remaining_indices = list(cluster_data.index)
        while len(remaining_indices) >= group_size:
            group = []

            #below is to be deleted/changed until ***
            #say traits are GPA/major/minor/courses taken/interest/tecchnical skills/scheduele/meeting freq
            #preffered traits to group within clusters according to similirity use: (minor and courses not used for now)
            #GPA/major/interest/tech skill

            #GPA: number btwn 0 and 4
            #major_categories = ['CS', 'EE', 'ME', 'CE', 'INDY']
            #interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
            #skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
            #solution 1 to find similary: use of vectors of dimention 7, sum all vectors for a student and compare euclidean distances to other students
            #solution 2: use embedding from transformers #TODO


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

            # ***    

            groups_num += 1
        if (len(remaining_indices)):
            data.loc[remaining_indices, 'group'] = groups_num
            groups_num += 1

    print("preffered traits grouped")
    data['group'] = data['group'].astype(int)


def find_best_k(X, clustering_features, k_range):
    silhouette_scores = []

    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=0).fit(clustering_features)
        labels = kmeans.labels_
        score = silhouette_score(X, labels)
        silhouette_scores.append(score)
        print(f"Silhouette score for k={k}: {score}")

    best_k = k_range[np.argmax(silhouette_scores)]
    return best_k, silhouette_scores

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
best_k, silhouette_scores = find_best_k(X, dealbreakers, k_range)
print(f"Best k: {best_k}")
clustering = KMeans(n_clusters=best_k).fit(dealbreakers)

# Assign clusters to students
data['cluster'] = clustering.labels_

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
