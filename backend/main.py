from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from risk_engine import analyze_transaction

app = FastAPI(
    title="MoMoShield API",
    description="Intelligent Trust & Safety for Digital Payments",
    version="1.0.0"
)

# Allow the MoMoShield frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionRequest(BaseModel):
    recipient: str
    amount: float


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "MoMoShield API"
    }


@app.post("/api/risk/analyze")
def analyze(request: TransactionRequest):

    identity_confidence = 0

    # Demo identity confidence
    if request.recipient == "0241234567":
        identity_confidence = 96

    elif request.recipient == "0550000000":
        identity_confidence = 28

    else:
        identity_confidence = 72

    return analyze_transaction(
        recipient=request.recipient,
        amount=request.amount,
        identity_confidence=identity_confidence
    )
@app.get("/api/recipient/verify/{recipient}")
def verify_recipient(recipient: str):

    if recipient == "0241234567":
        return {
            "recipient": recipient,
            "verified": True,
            "identity_confidence": 96,
            "status": "VERIFIED",
            "message": "Recipient information matched successfully."
        }

    elif recipient == "0550000000":
        return {
            "recipient": recipient,
            "verified": False,
            "identity_confidence": 28,
            "status": "UNVERIFIED",
            "message": "Recipient identity could not be confidently verified."
        }

    else:
        return {
            "recipient": recipient,
            "verified": True,
            "identity_confidence": 72,
            "status": "PARTIALLY VERIFIED",
            "message": "Recipient information is available, but additional verification is recommended."
        }