from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.models import ContactMessage, User
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/contact", tags=["contact"])
admin_router = APIRouter(prefix="/admin/messages", tags=["admin-messages"])


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_message(payload: ContactCreate, db: Session = Depends(get_db)) -> ContactMessage:
    message = ContactMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@admin_router.get("", response_model=list[ContactResponse])
def list_messages(
    db: Session = Depends(get_db), _: User = Depends(get_current_user)
) -> list[ContactMessage]:
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@admin_router.patch("/{message_id}/read", response_model=ContactResponse)
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ContactMessage:
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not message:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Message not found")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message

