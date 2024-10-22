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

# Load the spacy model
nlp = spacy.load('en_core_web_sm')

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
        print(X)
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
        'schedule': random.sample(schedule_categories, k=random.randint(1, len(schedule_categories))),
        'meeting_freq': meeting_freq
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


# similarity of transformed student embeddings
def student_similarity(emb1, emb2):
    return np.linalg.norm(emb1-emb2) #smaller number means more similar

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

    return data


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


preffered_traits_preprocessor = ColumnTransformer(
    transformers=[
        ('num', MinMaxScaler(), ['GPA']),
        ('major', EmbeddingTransformer(), 'major'),
        ('minor', EmbeddingTransformer(), 'minor'),
        ('courses', CustomMultiLabelEmbeddingTransformer(), 'courses_taken'),
        ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
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
