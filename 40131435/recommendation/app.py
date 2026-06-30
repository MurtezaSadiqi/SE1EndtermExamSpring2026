from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel
from engine import RecommendationEngine

app = FastAPI(title="HomeStay Recommendation API")

class Request(BaseModel):
    properties: list[dict[str, Any]]
    profile: dict[str, Any] = {}

@app.get('/health')
def health(): return {'status': 'ok'}

@app.post('/recommend')
def recommend(data: Request):
    return RecommendationEngine(data.profile).rank(data.properties)
