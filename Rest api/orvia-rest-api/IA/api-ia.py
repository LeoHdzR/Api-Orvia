from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib

# Cargar modelo y vectorizador
model = joblib.load("modelo_prioridades.pkl")
vectorizer = joblib.load("vectorizador.pkl")

app = FastAPI()

class Entrada(BaseModel):
    motivo: str

@app.post("/clasificar")
def clasificar_prioridad(entrada: Entrada):
    vector = vectorizer.transform([entrada.motivo])
    prioridad = model.predict(vector)[0]
    return {"prioridad": int(prioridad)}
