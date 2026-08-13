# app/routes/admin_seed.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_user
from app.models.user import User
from app.seed_demo_data import seed_demo_data

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/seed-demo", status_code=status.HTTP_204_NO_CONTENT)
async def seed_demo(current_user: User = Depends(get_current_user)):
    # For now, allow any authenticated user; adjust role checks later if needed
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    seed_demo_data()
    return