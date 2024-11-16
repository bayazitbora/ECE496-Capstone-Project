import pandas as pd
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer, normalize
from sklearn.compose import ColumnTransformer
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans
import spacy
import numpy as np
from sklearn.metrics import silhouette_score
import time

# Load the spacy model
nlp = spacy.load('en_core_web_lg')

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
        transformed = np.array([nlp(val).vector for val in X.squeeze()])
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
        transformed = np.array([np.mean([nlp(val).vector for val in vals], axis=0) for vals in X])
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

#TODO add exeption cases
# Changed the below method to form groups using Greedy approach based on the remaining attributes (preffered traits)
def form_groups_greedy(data, group_size):
    groups_num = 0

    for cluster in data['cluster'].unique(): #iterate through clusters
        cluster_data = data[data['cluster'] == cluster]
        remaining_indices = list(cluster_data.index)
        
        #put all student info in transformer and have embeddigns for all students 
        student_embeddings = preffered_traits_preprocessor.fit_transform(cluster_data)

        while len(remaining_indices) >= group_size:
            group = []

            similarity_array = []
            for student1 in range(len(remaining_indices)):
                for student2 in range(student1 + 1 , len(remaining_indices)):
                    #compare the similarity of student embeddings
                    sim = student_similarity(student_embeddings[remaining_indices[student1]],student_embeddings[remaining_indices[student2]])
                    similarity_array.append(remaining_indices[student1], remaining_indices[student2], sim) #collect all similarity scores in an array for each student
                    
            sorted_sim_array = sorted(similarity_array, key=lambda x: x[2]) #array in ascending order according to score
            
            first = sorted_sim_array[0] #take lowest score (closest students)
            group.extend(first[:2]) #put those two students in the group
            #update indeces, take out the 2 students just added.
            #remaining_indices = [index for index in remaining_indices if index not in group] #this takes too much time
            remaining_indices.remove(first[0])
            remaining_indices.remove(first[1])
            sorted_sim_array.pop(0) #remove that entry

            
            #when group not full (if group size is 2, do not enter thhe loop)
            while len(group) < group_size:

                #Initialize
                closest_student = None
                closest_student_dist = float('inf')

                #calculate the average point of all student embeddigns in the group
                embedding_average = np.mean(student_embeddings[group], axis = 0) #axis 0 for mean for all features across all students (consider axis 1?)
                
                for student in remaining_indices:
                    #euclidian distnace between eaxh student and the mean of embeddings alrdy in the group
                    distance = np.linalg.norm(student_embeddings[student] - embedding_average)
                    
                    #find the student with the smallest distance
                    if distance < closest_student_dist:
                        closest_student_dist = distance
                        closest_student = student
                
                #add closest student to the group and remove from indices
                if closest_student is not None:
                    group.append(closest_student)
                    remaining_indices.remove(closest_student)

                #remove all the other entries containing the student pair you added to the group
                #don't need this, will be updated in next iteration
                #sorted_sim_array = [entry for entry in sorted_sim_array if entry[0] not in group and entry[1] not in group]
                

            for student in group: #assigning group numbers to students
                data.loc[student, 'group'] = groups_num

            groups_num += 1

            #update remaining indices
            remaining_indices = [index for index in remaining_indices if index not in group]

        if remaining_indices: #to deal with remaining students if can't fill the last group
            for student in remaining_indices:
                data.loc[student, 'group'] = groups_num
            groups_num += 1 #this might not be necessary

    print("preffered traits grouped")
    data['group'] = data['group'].astype(int) #visualize groups


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
            ('major', EmbeddingTransformer(), 'major'),
            ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
            ('freq', MinMaxScaler(), ['meeting_freq']),
        ])

    # Apply transformations and convert the dataframe into a list of embeddings, where each student is represented by a single embedding vector
    X = preprocessor.fit_transform(data)

    # Select only certain columns (features) for clustering, also called 'dealbreakers'
    clustering_features = data[['areas_of_interest', 'major', 'schedule', 'meeting_freq']]
    # Convert into list of embeddings
    dealbreakers = dealbreakers_preprocessor.fit_transform(clustering_features)
    dealbreakers = normalize(dealbreakers, norm='l2')

    # Clustering
    model = KMeans()

    # Use KElbowVisualizer to find the optimal k
    visualizer = KElbowVisualizer(model, k=(2, 12), metric='silhouette') 
    visualizer.fit(dealbreakers)  
    optimal_k = visualizer.elbow_value_ if visualizer.elbow_value_ is not None else 5

    # Cluster the data using the optimal k
    kmeans = KMeans(n_clusters=optimal_k).fit(dealbreakers)

    # Label the dataframe
    data['cluster'] = kmeans.labels_

    # Form groups of 'group_size' students within each cluster using Greedy approach
    form_groups_greedy(data, group_size)
