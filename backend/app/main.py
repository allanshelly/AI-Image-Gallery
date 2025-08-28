from fastapi import FastAPI, Depends
from app.deps import get_current_user

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from FastAPI 🚀"}

@app.get("/protected")
def protected(user=Depends(get_current_user)):
    return {"message": f"Hello {user['sub']} 👋"}
