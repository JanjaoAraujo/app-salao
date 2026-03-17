from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
from zoneinfo import ZoneInfo
import os
from urllib.parse import quote_plus

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.environ.get("MONGODB_URI") or "COLE_SUA_STRING_MONGODB_AQUI"

client = MongoClient(MONGODB_URI)
db = client["salao_pro"]

BRAZIL_TZ = ZoneInfo("America/Fortaleza")


def normalize(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc


def normalize_many(items):
    return [normalize(x) for x in items]


def now_br():
    return datetime.now(BRAZIL_TZ)


def parse_appointment_datetime(item):
    datetime_value = item.get("datetime")
    if datetime_value:
        try:
            dt = datetime.fromisoformat(str(datetime_value).strip())
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=BRAZIL_TZ)
            else:
                dt = dt.astimezone(BRAZIL_TZ)
            return dt
        except:
            pass

    date_value = item.get("date")
    time_value = item.get("time")

    if date_value and time_value:
        try:
            date_str = str(date_value).strip()
            time_str = str(time_value).strip()

            if len(time_str) == 5:
                time_str = f"{time_str}:00"

            dt = datetime.fromisoformat(f"{date_str}T{time_str}")
            return dt.replace(tzinfo=BRAZIL_TZ)
        except:
            pass

    return None


@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/debug-now")
def debug_now():
    now = now_br()
    return {
        "now_iso": now.isoformat(),
        "today": str(now.date()),
        "timezone": "America/Fortaleza"
    }

# CLIENTES
@app.get("/clients")
def get_clients():
    items = list(db.clients.find().sort("created_at", -1))
    return normalize_many(items)


@app.post("/clients")
def create_client(payload: dict):
    payload["created_at"] = now_br().isoformat()
    db.clients.insert_one(payload)
    return {"ok": True}


@app.delete("/clients/{client_id}")
def delete_client(client_id: str):
    db.clients.delete_one({"_id": ObjectId(client_id)})
    return {"ok": True}


# SERVIÇOS
@app.get("/services")
def get_services():
    items = list(db.services.find().sort("created_at", -1))
    return normalize_many(items)


@app.post("/services")
def create_service(payload: dict):
    payload["created_at"] = now_br().isoformat()
    db.services.insert_one(payload)
    return {"ok": True}


@app.put("/services/{service_id}")
def update_service(service_id: str, payload: dict):
    db.services.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": {
            "name": payload.get("name"),
            "duration_minutes": payload.get("duration_minutes"),
            "price": payload.get("price"),
        }}
    )
    return {"ok": True}


@app.delete("/services/{service_id}")
def delete_service(service_id: str):
    db.services.delete_one({"_id": ObjectId(service_id)})
    return {"ok": True}


# AGENDAMENTOS
@app.get("/appointments")
def get_appointments():
    items = list(db.appointments.find().sort("created_at", -1))
    return normalize_many(items)


@app.post("/appointments")
def create_appointment(payload: dict):
    payload["created_at"] = now_br().isoformat()
    payload["reminder_sent"] = False
    payload["reminder_sent_at"] = None
    payload["notification_sent"] = False
    payload["notification_sent_at"] = None
    payload["status"] = "agendado"
    db.appointments.insert_one(payload)
    return {"ok": True}


@app.get("/appointments/pending-reminders")
def get_pending_reminders():
    now = now_br()
    today = now.date()

    pending = []

    for item in db.appointments.find({"reminder_sent": False}):
        date_value = item.get("date")
        if not date_value:
            continue

        try:
            appointment_date = datetime.fromisoformat(str(date_value)).date()
        except:
            continue

        if appointment_date == today:
            pending.append(normalize(item))

    return pending


@app.put("/appointments/{appointment_id}/mark-reminder-sent")
def mark_reminder_sent(appointment_id: str):
    db.appointments.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {
            "reminder_sent": True,
            "reminder_sent_at": now_br().isoformat()
        }}
    )
    return {"ok": True}


@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: str):
    db.appointments.delete_one({"_id": ObjectId(appointment_id)})
    return {"ok": True}


# FINANCEIRO
@app.get("/finance")
def get_finance():
    items = list(db.finance.find().sort("created_at", -1))
    return normalize_many(items)


@app.post("/finance")
def create_finance(payload: dict):
    payload["created_at"] = now_br().isoformat()
    db.finance.insert_one(payload)
    return {"ok": True}


@app.delete("/finance/{finance_id}")
def delete_finance(finance_id: str):
    db.finance.delete_one({"_id": ObjectId(finance_id)})
    return {"ok": True}


@app.get("/finance/summary")
def finance_summary():
    income = 0.0
    expense = 0.0
    for item in db.finance.find():
        amount = float(item.get("amount", 0) or 0)
        if item.get("type") == "saida":
            expense += amount
        else:
            income += amount
    return {
        "income": income,
        "expense": expense,
        "balance": income - expense,
    }


# CONFIG
@app.get("/settings")
def get_settings():
    item = db.settings.find_one()
    if not item:
        return {"professional_name": "", "business_name": ""}
    return {
        "professional_name": item.get("professional_name", ""),
        "business_name": item.get("business_name", ""),
    }


@app.post("/settings")
def save_settings(payload: dict):
    db.settings.delete_many({})
    payload["updated_at"] = now_br().isoformat()
    db.settings.insert_one(payload)
    return {"ok": True}


# DASHBOARD
@app.get("/dashboard")
def dashboard():
    today = now_br().date()
    month = now_br().month
    year = now_br().year

    today_revenue = 0.0
    month_revenue = 0.0
    appointments_today = 0

    for item in db.finance.find():
        amount = float(item.get("amount", 0) or 0)
        created_at = item.get("created_at")
        is_income = item.get("type", "entrada") != "saida"

        if created_at and is_income:
            try:
                created_dt = datetime.fromisoformat(str(created_at))
                if created_dt.tzinfo is None:
                    created_dt = created_dt.replace(tzinfo=BRAZIL_TZ)
                else:
                    created_dt = created_dt.astimezone(BRAZIL_TZ)

                if created_dt.month == month and created_dt.year == year:
                    month_revenue += amount
                if created_dt.date() == today:
                    today_revenue += amount
            except:
                pass

    for item in db.appointments.find():
        if item.get("date") == str(today):
            appointments_today += 1

    clients_count = db.clients.count_documents({})

    return {
        "todayRevenue": today_revenue,
        "monthRevenue": month_revenue,
        "clientsCount": clients_count,
        "appointmentsToday": appointments_today,
    }