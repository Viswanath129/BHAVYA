from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd
import numpy as np

def train_baseline():
    print("Training Baseline BHAVYA Model...")
    
    # Load Features
    df = pd.read_csv("bhavya_features.csv")
    
    # Binarize Target for Classification (High Stress vs Low Stress)
    # Stress 1-5. Let's say >=3 is High (1), else Low (0)
    df['target'] = (df['stress_label'] >= 3).astype(int)
    
    print(f"Dataset Size: {len(df)} samples")
    print("Class Balance:", df['target'].value_counts().to_dict())

    # X and y
    # Drop non-features
    X = df.drop(columns=['uid', 'date', 'stress_label', 'target'])
    y = df['target']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print("-" * 30)
    print(f"Train Accuracy: {train_score:.4f}")
    print(f"Test Accuracy:  {test_score:.4f}")
    print("-" * 30)
    
    # Feature Importance
    importances = model.feature_importances_
    features = X.columns
    print("Feature Importance:")
    for name, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
        print(f"  {name}: {imp:.4f}")

    # Interpretation
    print("\nInterpretation:")
    if test_score > 0.6: # Relaxed threshold for synthetic data without engineered correlation
        print("✅ BHAVYA Baseline is working. Behavioral features are predictive.")
    else:
        print("⚠️ Accuracy is low. Synthetic data might need stronger signal injection.")

if __name__ == "__main__":
    train_baseline()
