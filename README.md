# ECE496-Capstone-Project

# k-clusterin to group students according to deal breaker properties
# the considered properties will be asnwers to a questionnaire

import numpy as np
import pandas as pd

#set k, this can be prompted according to the project/class
k=8

#say we have 3 properties for now
#import answers from the questionairre as arrays
#answer_one = []
#answer_two = []
#answer_three = []
#put everything in a np array
#all_answers = np.array(list(zip(answer_one, answer_two, answer_three)

np.random.seed(42) #for testing only
students_data = np.random.rand(200, 3) #200 samples with 3 properties imported

graph = pd.DataFrame(students_data, properties=['dealbreaker1','dealbreaker2','dealbreaker3'])

#scale the data to have equal weight of all propoerties








