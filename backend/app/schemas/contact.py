from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=10, max_length=5000)


class ContactResponse(ContactCreate):
    id: int
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}

