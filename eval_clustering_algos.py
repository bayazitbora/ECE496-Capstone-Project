import pandas as pd
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans, AgglomerativeClustering, Birch, SpectralClustering
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import euclidean_distances
import spacy
import numpy as np
from sklearn.metrics import silhouette_score
import random
import matplotlib.pyplot as plt
import time
# Load the spacy model
nlp = spacy.load('en_core_web_sm')

def find_best_k(clustering_features, k_range, algorithm_name):
    silhouette_scores = []

    for k in k_range:
        if algorithm_name == "KMeans":
            clustering = KMeans(n_clusters=k, random_state=42).fit(clustering_features)
            labels = clustering.labels_
        if algorithm_name == "Spectral":
            clustering = SpectralClustering(n_clusters=k, affinity='nearest_neighbors', random_state=42).fit(clustering_features)
            labels = clustering.labels_
        if algorithm_name == "Agglomerative":
            clustering = AgglomerativeClustering(n_clusters=k).fit(clustering_features)
            labels = clustering.labels_
        if algorithm_name == "Birch":
            clustering = Birch(n_clusters=k).fit(clustering_features)
            labels = clustering.labels_
        score = silhouette_score(clustering_features, labels)
        silhouette_scores.append(score)
    
    print(silhouette_scores)

    best_silhouette = np.argmax(silhouette_scores)
    best_k = k_range[best_silhouette]
    return best_k, silhouette_scores[best_silhouette]

# List to store results (algorithm name, latency, and silhouette score)
results = []

# Run the given clustering algorithm. Record its latency and silhouette score
def run_clustering(algorithm_name, clustering_func, data):

    k_range = range(2, 15)
    k, silhouette = find_best_k(data, k_range, algorithm_name)

    start_time = time.time()
    
    # Run the clustering algorithm
    clustering_func(data, k)
    
    end_time = time.time()
    latency = end_time - start_time
    
    # Append result to list
    results.append([algorithm_name, latency, silhouette])

# Clustering functions

def run_kmeans(data, n_clusters):
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(data)

def run_agglomerative(data, n_clusters):
    agglomerative = AgglomerativeClustering(n_clusters=n_clusters)
    agglomerative.fit(data)

def run_spectral(data, n_clusters):
    spectral = SpectralClustering(n_clusters=n_clusters, affinity='nearest_neighbors', random_state=42)
    spectral.fit(data)

def run_birch(data, n_clusters):
    birch = Birch(n_clusters=n_clusters)
    birch.fit(data)


# List of clustering algorithms to run
algorithms = [
    ("KMeans", run_kmeans),
    ("Agglomerative", run_agglomerative),
    ("Spectral", run_spectral),
    ("Birch", run_birch),
]

# Define predefined categories
major_categories = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Industrial Engineering']
minor_categories = ['Mathematics', 'Physics', 'Chemistry', 'Economics', 'Business', 'None']
courses_categories = ["Electric and Magnetic Fields", "Fields and Waves", "Dynamics", "Communication Systems", "Electric Drives", "Computer Systems Programming", "Physiological Control Systems", "Sensory Communication", "Introduction to Electronic Devices", "Mechanics"]
interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
schedule_categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']



class EmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.scaler = MinMaxScaler()
    
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        transformed = np.array([nlp(val).vector for val in X.squeeze()])
        normalized = self.scaler.fit_transform(transformed)
        normalized = np.clip(normalized, 0, 1)
        return normalized

class CustomMultiLabelEmbeddingTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.scaler = MinMaxScaler()

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        transformed = np.array([np.mean([nlp(val).vector for val in vals], axis=0) for vals in X])
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
        ('major', EmbeddingTransformer(), 'major'),
        ('interests', CustomMultiLabelEmbeddingTransformer(), 'areas_of_interest'),
        ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
        ('freq', MinMaxScaler(), ['meeting_freq']),
    ])

# Example dataset (replace with your actual data)
data = pd.read_pickle('student_data.pkl')

# Apply transformations and convert the dataframe into a list of embeddings, where each student is represented by a single embedding vector
X = preprocessor.fit_transform(data)

# Select only certain columns (features) for clustering, also called 'dealbreakers'
clustering_features = data[['major', 'areas_of_interest', 'schedule', 'meeting_freq']]
# Convert into list of embeddings
dealbreakers = dealbreakers_preprocessor.fit_transform(clustering_features)

# Run each clustering algorithm and record latency
for algo_name, algo_func in algorithms:
    run_clustering(algo_name, algo_func, dealbreakers)

# Save the results to a CSV file
results_df = pd.DataFrame(results, columns=["Algorithm", "Latency", "Silhouette Score"])
results_df.to_csv("clustering_comparision.csv", index=False)

print("Clustering results saved to clustering_comparision.csv")
