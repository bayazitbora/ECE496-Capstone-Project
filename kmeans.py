import pandas as pd
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, MultiLabelBinarizer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.cluster import KMeans

class CustomMultiLabelBinarizer(BaseEstimator, TransformerMixin):
    def __init__(self, classes):
        self.classes = classes
        self.mlb = MultiLabelBinarizer(classes=self.classes)
        
    def fit(self, X, y=None):
        self.mlb.fit(X)
        return self
    
    def transform(self, X):
        return self.mlb.transform(X)

# Sample data
data = pd.DataFrame({
    'GPA': [3.5, 3.8, 3.2, 3.9, 3.1, 4.0, 3.5, 2.5],
    'major': ['CS', 'CS', 'EE', 'ME', 'EE', 'CE', 'CE', 'INDY'],
    'minor': ['Math', 'Physics', 'None', 'Chem', 'Econ', 'Business', 'None', 'None'],
    'courses_taken': [['CSC101', 'CSC102'], ['CSC101', 'CSC103'], ['ECE201', 'ECE202'], ['ME101', 'ME102'], ['ECE201', 'ME101'], ['ECE202'], ['ME101'], ['CSC101', 'CSC102']],
    'areas_of_interest': [['AI', 'ML'], ['AI', 'Robotics'], ['Circuits', 'Signal Processing'], ['Thermodynamics', 'Fluid Mechanics'], ['AI'], ['Circuits'], ['Thermodynamics'], ['ML']],
    'technical_skills': [['Python', 'Java'], ['Python', 'C++'], ['MATLAB', 'VHDL'], ['SolidWorks', 'AutoCAD'], ['Python'], ['C++'], ['SolidWorks'], ['C++']],
    'schedule': [['Mon', 'Wed', 'Fri'], ['Tue', 'Thu'], ['Mon', 'Wed', 'Fri'], ['Tue', 'Thu'], ['Mon'], ['Wed', 'Thu'], ['Tue', 'Fri'], ['Mon', 'Wed']]
})

# Define predefined categories
major_categories = ['CS', 'EE', 'ME', 'CE', 'INDY']
minor_categories = ['Math', 'Physics', 'Chem', 'Econ', 'Business', 'None']
courses_categories = ['CSC101', 'CSC102', 'CSC103', 'ECE201', 'ECE202', 'ME101', 'ME102']
interests_categories = ['AI', 'ML', 'Robotics', 'Circuits', 'Signal Processing', 'Thermodynamics', 'Fluid Mechanics']
skills_categories = ['Python', 'Java', 'C++', 'MATLAB', 'VHDL', 'SolidWorks', 'AutoCAD']
schedule_categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', MinMaxScaler(), ['GPA']),
        ('major', OneHotEncoder(categories=[major_categories]), ['major']),
        ('minor', OneHotEncoder(categories=[minor_categories]), ['minor']),
        ('courses', CustomMultiLabelBinarizer(classes=courses_categories), 'courses_taken'),
        ('interests', CustomMultiLabelBinarizer(classes=interests_categories), 'areas_of_interest'),
        ('skills', CustomMultiLabelBinarizer(classes=skills_categories), 'technical_skills'),
        ('schedule', CustomMultiLabelBinarizer(classes=schedule_categories), 'schedule')
    ])

# Apply transformation
X = preprocessor.fit_transform(data)


# Clustering
kmeans = KMeans(n_clusters=2, random_state=0).fit(X)

# Assign clusters to students
data['cluster'] = kmeans.labels_
print(data)
