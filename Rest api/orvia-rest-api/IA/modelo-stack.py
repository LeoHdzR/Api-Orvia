import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.ensemble import StackingClassifier, RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier
import joblib
from collections import Counter
import numpy as np

# 1. Cargar y verificar dataset
try:
    df = pd.read_csv("https://orvia-bucket.s3.us-east-1.amazonaws.com/dataset_fisioterapia.csv")
    df.columns = ["motivo", "prioridad"]
    df['prioridad'] = df['prioridad'].astype(int)
    
    # Convertir a codificación 0-based
    df['prioridad'] = df['prioridad'] - 1  # Ahora 0,1,2
    
except Exception as e:
    print("Error al cargar el dataset:", e)
    raise

print("\nDistribución de clases original (0-based):")
print(df['prioridad'].value_counts())

# 2. Vectorización
stopwords = ['sesión', 'fisioterapia']
vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),
    max_features=3000,
    min_df=2,
    max_df=0.85,
    stop_words=stopwords
)
X = vectorizer.fit_transform(df['motivo'])
y = df['prioridad']

# 3. División de datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    stratify=y,
    random_state=42
)

print("\nDistribución en entrenamiento (0-based):")
print(pd.Series(y_train).value_counts())

# 4. Configuración de modelos corregida para 0-based
class_weights = {0:1, 1:3, 2:1}  # Pesos para las clases 0,1,2 (originales 1,2,3)

base_models = [
    ('svm', CalibratedClassifierCV(
        LinearSVC(
            C=1.5,
            class_weight=class_weights,
            max_iter=5000,
            random_state=42
        ),
        cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    )),
    
    ('xgb', XGBClassifier(
        max_depth=4,
        learning_rate=0.1,
        scale_pos_weight=[1, 3, 1],  # Pesos para clases 0,1,2
        objective='multi:softprob',
        eval_metric='mlogloss',
        use_label_encoder=False,
        random_state=42
    )),
    
    ('rf', RandomForestClassifier(
        n_estimators=150,
        class_weight=class_weights,
        max_depth=5,
        random_state=42
    ))
]

meta_model = LogisticRegression(
    multi_class='multinomial',
    solver='lbfgs',
    class_weight='balanced',
    max_iter=2000,
    random_state=42
)

stack_model = StackingClassifier(
    estimators=base_models,
    final_estimator=meta_model,
    stack_method='predict_proba'
)

# 5. Entrenamiento y evaluación
try:
    stack_model.fit(X_train, y_train)
except Exception as e:
    print("Error durante el entrenamiento:", e)
    raise

y_pred = stack_model.predict(X_test)

# Convertir a etiquetas originales para reportes
y_test_orig = y_test + 1
y_pred_orig = y_pred + 1

print("\nReporte de clasificación (1,2,3 originales):")
print(classification_report(y_test_orig, y_pred_orig, target_names=['1', '2', '3']))

print("\nMatriz de confusión:")
print(confusion_matrix(y_test_orig, y_pred_orig))

# 6. Guardar modelo
try:
    joblib.dump(stack_model, r'c:\Users\admin\OneDrive\Documentos\Uaq\Sexto p\Orvia\ORVIAProject\Rest api\orvia-rest-api\IA\modelo_prioridades.pkl')
    joblib.dump(vectorizer, r'c:\Users\admin\OneDrive\Documentos\Uaq\Sexto p\Orvia\ORVIAProject\Rest api\orvia-rest-api\IA\vectorizador.pkl')
    print("\nModelo guardado exitosamente.")
except Exception as e:
    print("Error al guardar:", e)