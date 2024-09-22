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
    """
    A custom transformer that applies sentence embeddings using a pre-trained 
    NLP model and scales the results to a 0-1 range.

    Attributes:
        scaler (MinMaxScaler): Scaler to normalize the embeddings between 0 and 1.
    
    Methods:
        fit(X, y=None):
            Fits the transformer. Does not perform any actions but is required for compatibility.
        transform(X):
            Transforms the input data by encoding each element using the NLP model and scaling 
            the embeddings to the range [0, 1].
    """
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
    """
    A custom transformer for handling multi-label data, applying embeddings to each label,
    averaging the embeddings, and scaling the result.

    Attributes:
        scaler (MinMaxScaler): Scaler to normalize the embeddings between 0 and 1.

    Methods:
        fit(X, y=None):
            Fits the transformer. Does not perform any actions but is required for compatibility.
        transform(X):
            Transforms multi-label input data by applying embeddings to each label, averaging 
            the embeddings, and scaling the result to the range [0, 1].
    """
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
    """
    A custom transformer that binarizes multi-label categorical data based on the provided classes.

    Attributes:
        classes (list): List of possible classes for multi-label binarization.
        mlb (MultiLabelBinarizer): Internal instance of sklearn's MultiLabelBinarizer.

    Methods:
        fit(X, y=None):
            Fits the binarizer on the input data X.
        transform(X):
            Transforms the input data into a binary (one-hot encoded) vector representation based on the fitted classes.
    """
    def __init__(self, classes):
        self.classes = classes
        self.mlb = MultiLabelBinarizer(classes=self.classes)

    def fit(self, X, y=None):
        self.mlb.fit(X)
        return self

    def transform(self, X):
        return self.mlb.transform(X)

# Form groups using Greedy approach based on personality scores
# TODO: Change the below method to form groups using Greedy approach based on the remaining attributes (gpa, major, minor, courses_taken, technical_skills)
def form_groups_greedy(data, group_size):
    """
    Forms groups of students within each cluster using a greedy approach based on non-dealbreaker attributes
    Args:
        data (DataFrame): DataFrame containing student profiles, including personality scores.
        group_size (int): The number of students to include in each group.

    Returns:
        None: The function updates the input DataFrame with a 'group' column indicating group membership.
    """
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
    """
    Finds the best number of clusters (k) for K-means clustering using silhouette scores.

    Args:
        X: The transformed array of student embeddings
        clustering_features: A subset of X that only contains the student embeddings for dealbreaker attributes
        k_range: A range of k values to evaluate.

    Returns:
        best_k: The optimal number of clusters that gives the highest silhouette score.
        best_labels: The cluster labels corresponding to the best k.
    """
    silhouette_scores = []
    labels = []
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=0).fit(clustering_features)
        labels.append(kmeans.labels_)
        score = silhouette_score(X, kmeans.labels_)
        silhouette_scores.append(score)
    best_index = np.argmax(silhouette_scores)
    return k_range[best_index], labels[best_index]

def cluster_and_match_students(data, schedule_categories, group_size):
    """
    Clusters students based on multiple attributes and forms groups using a greedy approach.

    Args:
        data (DataFrame): DataFrame containing student data with attributes; each row corresponds to a student, each column corresponds to an attribute
        schedule_categories (list): List of possible schedule categories for one-hot encoding
        group_size (int): The number of students in each group. #TODO: allow specifying a range for group_size

    Returns:
        None: The function modifies the input DataFrame by adding 'cluster' and 'group' columns.
    """
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

    # Apply transformations and convert the dataframe into a list of embeddings, where each student is represented by a single embedding vector
    X = preprocessor.fit_transform(data)

    # Select only certain columns (features) for clustering, also called 'dealbreakers'
    clustering_features = data[['areas_of_interest', 'schedule', 'meeting_freq']]
    # Convert into list of embeddings
    dealbreakers = dealbreakers_preprocessor.fit_transform(clustering_features)

    # Cluster students using k-means clustering, using the 'best' k value from a given range
    k_range = range(2, 10) 
    best_k, best_labels = find_best_k(X, dealbreakers, k_range)

    # Assign clusters to students
    data['cluster'] = best_labels

    # Form groups of 'group_size' students within each cluster using Greedy approach
    form_groups_greedy(data, group_size)
