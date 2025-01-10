from fastapi import (
    APIRouter,
)
from starlette.responses import HTMLResponse

router = APIRouter()


@router.get("/",
            response_class=HTMLResponse,
            tags=["ROOT"])
async def root():
    return """
    <html>
        <head>
            <title>Research Skill Seminar - Dummy App</title>
        </head>
        <body>
            <h1>Research Skill Seminar - Dummy App</h1>
            <p>This is a service to test the deployment of a IVIA app.</p>
        </body>
    </html>
    """


@router.get(
    "/health",
    responses={
        200: {"description": "API is up and running"},
        503: {"description": "Service is unavailable"},
    },
    tags=["default"],
    summary="Checks the health of the API",
    response_model_by_alias=True,
)
async def health_get(
) -> None:
    ...
