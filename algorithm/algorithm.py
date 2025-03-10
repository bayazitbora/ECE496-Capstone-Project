from typing import List, Tuple, Optional
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, MultiLabelBinarizer, normalize
from sklearn.compose import ColumnTransformer
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans
import spacy
import numpy as np
from sklearn.metrics import silhouette_score
from yellowbrick.cluster import KElbowVisualizer
import itertools
from typing import List, Dict, Optional
from sklearn.mixture import GaussianMixture

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
    def __init__(self) -> None:
        self.scaler: MinMaxScaler = MinMaxScaler()
    
    def fit(self, X: pd.Series, y: Optional[np.ndarray] = None) -> "EmbeddingTransformer":
        return self

    def transform(self, X: pd.Series) -> np.ndarray:
        transformed: np.ndarray = np.array([nlp(val).vector for val in X.squeeze()])
        normalized: np.ndarray = self.scaler.fit_transform(transformed)
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
    def __init__(self) -> None:
        self.scaler: MinMaxScaler = MinMaxScaler()

    def fit(self, X: List[List[str]], y: Optional[np.ndarray] = None) -> "CustomMultiLabelEmbeddingTransformer":
        return self

    def transform(self, X: List[List[str]]) -> np.ndarray:
        transformed: np.ndarray = np.array([np.mean([nlp(val).vector for val in vals], axis=0) for vals in X])
        normalized: np.ndarray = self.scaler.fit_transform(transformed)
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
    def __init__(self, classes: List[str]) -> None:
        self.classes: List[str] = classes
        self.mlb: MultiLabelBinarizer = MultiLabelBinarizer(classes=self.classes)

    def fit(self, X: List[List[str]], y: Optional[np.ndarray] = None) -> "CustomMultiLabelBinarizer":
        self.mlb.fit(X)
        return self

    def transform(self, X: List[List[str]]) -> np.ndarray:
        return self.mlb.transform(X)

# #TDO add exception cases
# # Changed the below method to form groups using Greedy approach based on the remaining attributes (preferred traits)
# def form_groups_greedy(data: pd.DataFrame, group_size: int, student_embeddings: np.ndarray) -> Dict[int, List[int]]:
#     groups_dict: Dict[int, List[int]] = {} #dict to store by group number ex: 0: [1,2,10]
#     groups_num: int = 0

#     for cluster in data['cluster'].unique():  # iterate through clusters
#         cluster_data: pd.DataFrame = data[data['cluster'] == cluster]
#         remaining_indices: List[int] = list(cluster_data.index)
        
#         similarity_array: List[List[float]] = []
#         for student1 in range(len(remaining_indices)):
#             for student2 in range(student1 + 1, len(remaining_indices)):
#                 # compare the similarity of student embeddings
#                 sim: float = np.linalg.norm(student_embeddings[remaining_indices[student1]] - student_embeddings[remaining_indices[student2]])
#                 similarity_array.append([remaining_indices[student1], remaining_indices[student2], sim])  # collect all similarity scores in an array for each student
                
#         sorted_sim_array: List[List[float]] = sorted(similarity_array, key=lambda x: x[2])  # array in ascending order according to score

#         while len(remaining_indices) >= group_size:
#             group: List[int] = []
            
#             first: List[float] = sorted_sim_array[0]  # take lowest score (closest students)
#             group.extend(first[:2])  # put those two students in the group
#             # update indices, take out the 2 students just added.
#             remaining_indices.remove(first[0])
#             remaining_indices.remove(first[1])
#             sorted_sim_array.pop(0)  # remove that entry

#             # when group not full (if group size is 2, do not enter the loop)
#             while len(group) < group_size:

#                 # Initialize
#                 closest_student: Optional[int] = None
#                 closest_student_dist: float = float('inf')

#                 # calculate the average point of all student embeddings in the group
#                 embedding_average: np.ndarray = np.mean(student_embeddings[group], axis=0)  # axis 0 for mean for all features across all students
                
#                 for student in remaining_indices:
#                     # Euclidean distance between each student and the mean of embeddings already in the group
#                     distance: float = np.linalg.norm(student_embeddings[student] - embedding_average)
                    
#                     # find the student with the smallest distance
#                     if distance < closest_student_dist:
#                         closest_student_dist = distance
#                         closest_student = student
                
#                 # add closest student to the group and remove from indices
#                 if closest_student is not None:
#                     group.append(closest_student)
#                     remaining_indices.remove(closest_student)

#                 # remove all the other entries containing the student pair you added to the group
#                 sorted_sim_array = [entry for entry in sorted_sim_array if entry[0] not in group and entry[1] not in group]
                
#             for student in group:  # assigning group numbers to students
#                 data.loc[student, 'group'] = groups_num

#             groups_dict[groups_num] = group 

#             groups_num += 1

#         if remaining_indices:  # to deal with remaining students if can't fill the last group
#             groups_dict[groups_num] = remaining_indices
#             for student in remaining_indices:
#                 data.loc[student, 'group'] = groups_num
#             groups_num += 1

#     return groups_dict


#TODO need to add a way to stop the algo mid way and get student input for pairs!!!


#mixture of gaussians according to highest prob of being in a cluster
def form_groups_gmm(data: pd.DataFrame, group_size: int, student_embeddings: np.ndarray)->Dict[int, List[int]]:
    groups_dict: Dict[int, List[int]] = {}  # Dictionary to store by group number ex: 0: [1, 2, 10]
    groups_num: int = 0  # Counter for group numbers

    unique_clusters = data['cluster'].unique() #output of stage 1 as input

    for id in unique_clusters:
        c_data = data[data['cluster'] == id]
        students_in_c = c_data.index
        embeddings_c = student_embeddings[students_in_c]

        gmm = GaussianMixture(n_components=len(students_in_c) // group_size, random_state=42) #gmm to previous students embeddings
        gmm.fit(embeddings_c)
        gmm_probs = gmm.predict_proba(embeddings_c) #probabilities of each student belonging to each gmm cluster
        for idx in range(gmm_probs.shape[1]):
            data.loc[students_in_c, f'gmm_prob_cluster_{idx}'] = gmm_probs[:,idx] #store prob

        # student_probabilities: List[Tuple[int, int, float]] = [] #student index, cluster index, probability
        student_probabilities  = [(idx, np.argmax(prob), prob[np.argmax(prob)]) for idx, prob in zip(students_in_c, gmm_probs)]
        student_probabilities.sort(key=lambda x: x[2], reverse=True)

        
        grouped_students = set()
        while len(grouped_students) < len(students_in_c):
            group = []
            current_cluster = None

            for student_idx, cluster_idx, prob in student_probabilities:
                if student_idx in grouped_students:
                    continue
                if len(group) == 0:
                    current_cluster = cluster_idx

                if cluster_idx == current_cluster and len(group) < group_size:
                    group.append(student_idx)
                    grouped_students.add(student_idx)

                if len(group) == group_size:
                    break

            if len(group) < group_size and len(grouped_students) == len(students_in_c) - 1:
                remaining_student = set(students_in_c) - grouped_students
                group.append(remaining_student.pop())
                grouped_students.add(group[-1])

            # Assign group number to students
            for student in group:
                data.loc[student, 'group'] = groups_num

            groups_dict[groups_num] = group
            groups_num += 1 

        # #for each student find the most likely cluster
        # for student_idx in students_in_c:
        #     most_likely_cluster_idx = np.argmax(gmm_probs[student_idx]) #cluster with max probability
        #     most_likely_prob = gmm_probs[student_idx][most_likely_cluster_idx]
        #     student_probabilities.append((student_idx, most_likely_cluster_idx, most_likely_prob))
    
        # #sort students highest prob to lowest
        # # student_probabilities.sort(key=lambda x: x[2], reverse=True)

        # #note unavailbale students
        # grouped_students: set = set()

        # #group assignments
        # while len(grouped_students)<len(students_in_c):
        #     group: List[int] = []
        #     current_cluster = None
        
        #     for student_idx, cluster_idx, prob in student_probabilities:
        #         if student_idx in grouped_students: #if not alredy in a group
        #             continue
                
        #         if len(group) == 0: #if we are looking at the first student, set the cluster number to their most likely cluster
        #             current_cluster = cluster_idx
                
        #         #students are added if they have the same high prob cluster as the current one and if there is space
        #         if cluster_idx == current_cluster and len(group) < group_size:
        #             group.append(student_idx)
        #             grouped_students.add(student_idx)


        #         #*** TODO
        #         #check if a student from the selected pair was added to the group
        #         #TODO should we take the len restriction out here??? and have an option to have 1 more person?

        #         # if selected_pair:
        #         #     #if the selected pair's first student is in the group add the second one if space 
        #         #     if selected_pair[0] in group and selected_pair[1] not in grouped_students and len(group) < group_size:
        #         #         group.append(selected_pair[1])
        #         #         grouped_students.add(selected_pair[1])
        #         #     #if the selected pair's second student is in the group add the first one if space
        #         #     elif selected_pair[1] in group and selected_pair[0] not in grouped_students and len(group) < group_size:
        #         #         group.append(selected_pair[0])
        #         #         grouped_students.add(selected_pair[0])

        #         #***
                
        #         if len(group) == group_size:
        #             break
        
        #     #give group num and strore
        #     for student in group: #note that this is looking at the current cluster which can be diff than the group number assigned
        #         data.loc[student, 'group'] = groups_num
            
        #     groups_dict[groups_num] = group
        #     groups_num += 1

        # #reamining studenrs
        # remaining_students = [student_idx for student_idx in students_in_c if student_idx not in grouped_students]

        # if remaining_students:
        #     if len(remaining_students) == 1:
        #         remaining_student_idx = remaining_students[0]
        #         most_likely_cluster_idx = np.argmax(gmm_probs[remaining_student_idx])
        #         bestgroup = None
        #         max_overlap = -1

        #         for group_num, group in groups_dict.items():
        #             group_probs = [gmm_probs[student_idx][most_likely_cluster_idx] for student_idx in group]
        #             avg_prob = np.mean(group_probs)
        #             if avg_prob > max_overlap:
        #                 bestgroup  = group_num
        #                 max_overlap = avg_prob
                
        #         if bestgroup is not None:
        #             data.loc[remaining_student_idx, 'group'] = bestgroup
        #             groups_dict[bestgroup].append(remaining_student_idx)
        #         else:
        #             data.loc[remaining_student_idx, 'group'] = group_num
        #             groups_dict[group_num] = [remaining_student_idx]
        #             group_num +=1
        #     else: #more than 1
        #         for s in remaining_students:
        #             data.loc[s, 'group'] = groups_num
        #         groups_dict[groups_num] = remaining_students
        #         groups_num +=1




            ##################################
            # #if only one student left put them in their most likely cluster's group
            # if len(remaining_students) == 1:
            #     remaining_student_idx = remaining_students[0]
            #     most_likely_cluster_idx = np.argmax(gmm_probs[remaining_student_idx])
                
            #     #find the group of the associated most likely cluster
            #     best_group = None
            #     for group_num, group in groups_dict.items():
            #         group_clusters = [np.argmax(gmm_probs[student_idx]) for student_idx in group]
            #         if most_likely_cluster_idx in group_clusters:
            #             best_group = group_num
            #             break
                
            #     if best_group is not None:
            #         #add the remaining student to their most likely cluster's group
            #         data.loc[remaining_student_idx, 'group'] = best_group
            #         groups_dict[best_group].append(remaining_student_idx)
            # else:
            #     #for the last group with remaining studenrs
            #     #note: currently prioritizing having the best possible groups until the last group
            #     for student in remaining_students:
            #         data.loc[student, 'group'] = groups_num
                
            #     groups_dict[groups_num] = remaining_students
            #     groups_num += 1

    return groups_dict


def find_best_k(X: np.ndarray, clustering_features: np.ndarray, k_range: range) -> Tuple[int, np.ndarray]:
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
    silhouette_scores: List[float] = []
    labels: List[np.ndarray] = []
    for k in k_range:
        kmeans = KMeans(n_clusters=k, random_state=0).fit(clustering_features)
        labels.append(kmeans.labels_)
        score: float = silhouette_score(X, kmeans.labels_)
        silhouette_scores.append(score)
    best_index: int = np.argmax(silhouette_scores)
    return k_range[best_index], labels[best_index]

def cluster_and_match_students(data: pd.DataFrame, group_size: int,  schedule_categories: Optional[List[str]] = None) -> Dict[int, List[int]]:
    """
    Clusters students based on multiple attributes and forms groups using a greedy approach.

    Args:
        data (pd.DataFrame): DataFrame containing student data with attributes; each row corresponds to a student, each column corresponds to an attribute
        group_size (int): The number of students in each group. #TODO: allow specifying a range for group_size
        schedule_categories (Optional(list)): List of possible schedule categories for one-hot encoding


    Returns:
        Dict[int, List[int]]: A dictionary of groups where keys are group numbers, and and the values are lists that contain student profile ID's
    """

    if not schedule_categories:
        # Days from Monday to Saturday
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        # Hours from 9:00 to 21:00
        hours = [f"{hour:02d}:00" for hour in range(9, 22)]

        # Create the schedule categories for each day and each hour
        schedule_categories = [f"{day}_{hour}" for day, hour in itertools.product(days, hours)]

    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', MinMaxScaler(), ['GPA']),
            ('major', EmbeddingTransformer(), 'major'),
            ('minor', EmbeddingTransformer(), 'minor'),
            ('courses', CustomMultiLabelEmbeddingTransformer(), 'courses_taken'),
            ('interests', CustomMultiLabelEmbeddingTransformer(), 'areas_of_interest'),
            ('skills', CustomMultiLabelEmbeddingTransformer(), 'technical_skills'),
        #    ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
            ('freq', MinMaxScaler(), ['meeting_freq']),
        ])

    dealbreakers_preprocessor = ColumnTransformer(
        transformers=[
            ('interests', CustomMultiLabelEmbeddingTransformer(), 'areas_of_interest'),
            ('major', EmbeddingTransformer(), 'major'),
        #    ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule'),
            ('freq', MinMaxScaler(), ['meeting_freq']),
        ])

    # Obtain student embeddings
    student_embeddings: np.ndarray = preprocessor.fit_transform(data)
    
    # Select only certain columns (features) for clustering, also called 'dealbreakers'
    #TODO: Add schedule column
    clustering_features = data[['areas_of_interest', 'major', 'meeting_freq']]
    # Convert into list of normalized embeddings
    dealbreakers: np.ndarray = dealbreakers_preprocessor.fit_transform(clustering_features)
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
    groups_dict = form_groups_gmm(data, group_size, student_embeddings)
    return groups_dict
