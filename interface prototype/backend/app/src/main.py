from fastapi import FastAPI

from api import router as default_api_router

app = FastAPI(
    title="Research Skill Seminar - Dummy App",
    description="This is a service to test the deployment of a IVIA app.",
    version="0.0.1",
)

app.include_router(default_api_router)
