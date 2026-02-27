import torch
import numpy as np

class NPUInterface:
    def __init__(self, model_path="npu_emotion_cnn.dlc"):
        """
        Simulated Interface for SNPE (Snapdragon Neural Processing Engine).
        In a real deployment, this would load the .dlc file and run on the NPU.
        Here, we use a lightweight CPU surrogate to emulate the 15-dim vector output.
        """
        self.model_path = model_path
        print(f"[NPU] Initializing Emotion CNN from {model_path} on Neural Processing Unit...")
        # Placeholder for actual SNPE runtime initialization
        self.ready = True

    def process_frame(self, frame_data):
        """
        Input: Image frame (numpy array or tensor)
        Output: 15-dimensional emotion vector (EEV format)
        """
        # SIMULATION: Generate a 15-dim vector.
        # In real life: self.snpe.execute(frame)
        
        # 15 EEV Emotions (Approximate list from dataset):
        # [Amusement, Anger, Anxiety, Awe, Concentration, Confusion, Contempt, 
        #  Contentment, Disappointments, Disgust, Excitement, Happiness, Interest, Pain, Sadness]
        
        # We'll generate semi-random noise to simulate "detection"
        vector = np.random.dirichlet(np.ones(15), size=1)[0]
        return vector

    def process_question_answers(self, answers):
        """
        Interface for mapping Questionnaire answers -> EEV Vector Space.
        This allows the same Temporal Model to run on Question data.
        """
        # Answers is a list of 10 integers (0-3)
        # We verify we have answers
        if not answers:
            return np.zeros(15)

        # Map aggregate score to "Sadness" (idx 14) vs "Happiness" (idx 11) weights
        score = sum(answers) / (len(answers) * 3) # 0.0 to 1.0 (1.0 = High Stress/Negative)
        
        # Construct a synthetic vector based on valid answers
        vector = np.zeros(15)
        
        # High score -> High Anxiety(2), Sadness(14), Disgust(9)
        # Low score -> High Contentment(7), Happiness(11)
        
        if score > 0.6:
            vector[2] = 0.4  # Anxiety
            vector[14] = 0.4 # Sadness
            vector[9] = 0.2  # Disgust
        else:
            vector[7] = 0.5  # Contentment
            vector[11] = 0.5 # Happiness
            
        # Add some noise/variance
        vector += np.random.normal(0, 0.05, 15)
        vector = np.maximum(vector, 0)
        vector /= vector.sum() # Normalize
        
        return vector
