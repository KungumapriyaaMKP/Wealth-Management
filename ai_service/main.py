from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import requests

app = FastAPI(title="Wealth Management AI Service")

class Asset(BaseModel):
    type: str
    amount: float = 0 # Using generic representation
    value: float = 0

class Summary(BaseModel):
    totalIncome: float
    totalExpense: float
    savings: float

class FinancialData(BaseModel):
    transactions: List[Dict[Any, Any]]
    assets: List[Dict[Any, Any]]
    goals: List[Dict[Any, Any]]
    summary: Summary

# Layer 1: Rule Engine
def run_rule_engine(data: FinancialData):
    alerts = []
    
    summary = data.summary
    if summary.totalExpense > summary.totalIncome:
        alerts.append("Overspending Detected: Your expenses are exceeding your income.")
        
    if summary.savings < 10000: # Threshold example
        alerts.append("Low Savings Alert: Your current savings are dangerously low.")
        
    gold_value = sum([a["current_price"] * a["quantity"] for a in data.assets if a["type"] == "gold"])
    total_assets = sum([a["current_price"] * a["quantity"] for a in data.assets])
    
    if total_assets > 0 and (gold_value / total_assets) > 0.6:
        alerts.append("Diversification Warning: Over 60% of your assets are in Gold.")
        
    return alerts

# Layer 3: Local LLM (Ollama)
def query_ollama(prompt: str) -> str:
    # Assuming Ollama is running locally
    url = "http://localhost:11434/api/generate"
    try:
        response = requests.post(url, json={
            "model": "mistral", # fallback to llama3 if needed
            "prompt": prompt,
            "stream": False
        }, timeout=10)
        
        if response.status_code == 200:
            return response.json().get("response", "No response generated.")
        else:
            return "Local LLM returned an error."
    except Exception as e:
        return f"Could not connect to Local LLM at {url}. Ensure Ollama is running."

@app.post("/analyze")
def analyze_financials(data: FinancialData):
    
    # Layer 1 Insights
    alerts = run_rule_engine(data)
    
    # Simple predictive insights (Mock for now, would use scikit-learn in Layer 2)
    predictions = {
        "future_savings_1_month": data.summary.savings * 1.05, # assuming 5% growth
        "goal_achievement_prob": "75%"
    }
    
    # Compile prompt for Layer 3 (Human Explanation)
    prompt = f"""
    You are an AI financial advisor. Provide a simple, conversational advice paragraph.
    User's total income: {data.summary.totalIncome}
    User's total expense: {data.summary.totalExpense}
    Alerts: {', '.join(alerts) if alerts else 'No immediate alerts, doing great!'}
    keep it short, maximum 2 sentences.
    """
    
    llm_advice = query_ollama(prompt)
    
    return {
        "alerts": alerts,
        "predictions": predictions,
        "advisory": llm_advice
    }

@app.get("/")
def health_check():
    return {"status": "AI Service Running"}
