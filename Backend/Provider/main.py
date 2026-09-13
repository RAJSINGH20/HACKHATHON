import os
import json
import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# =========================================================
# CONFIG
# =========================================================

BOOKINGS_API_URL = "http://localhost:3000/api/bookings/getBookings"

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    print("❌ OPENROUTER_API_KEY not found in .env")
    exit()


# =========================================================
# OPENROUTER
# =========================================================

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)


# =========================================================
# GET ALL BOOKINGS FROM BACKEND
# =========================================================

def get_all_bookings():

    try:

        response = requests.get(
            BOOKINGS_API_URL,
            timeout=10
        )

        print("\nBackend Status:", response.status_code)

        response.raise_for_status()

        data = response.json()

        # Your API returns:
        # {
        #   "success": true,
        #   "bookings": [...]
        # }

        if isinstance(data, dict):

            bookings = data.get("bookings", [])

        elif isinstance(data, list):

            bookings = data

        else:

            bookings = []

        print("✅ Total bookings:", len(bookings))

        return bookings

    except requests.exceptions.ConnectionError:

        print("\n❌ Cannot connect to backend.")
        print("Make sure Node.js is running on port 3000.")

        return []

    except requests.exceptions.Timeout:

        print("\n❌ Backend request timed out.")

        return []

    except Exception as e:

        print("\n❌ Backend Error:", e)

        return []


# =========================================================
# DISPLAY ALL BOOKINGS
# =========================================================

def show_all_bookings(bookings):

    print("\n")
    print("=" * 80)
    print("🌾 ALL FARMER BOOKINGS")
    print("=" * 80)

    if not bookings:

        print("No bookings found.")

        return

    for i, booking in enumerate(bookings, 1):

        print(f"\nBOOKING {i}")
        print("-" * 80)

        print("Booking ID       :", booking.get("_id", "N/A"))

        print(
            "Farmer Name      :",
            booking.get("firstName", ""),
            booking.get("lastName", "")
        )

        print("Phone            :", booking.get("phone", "N/A"))

        print("Product          :", booking.get("product", "N/A"))

        print("Weight           :", booking.get("weight", 0), "kg")

        print("Status           :", booking.get("status", "N/A"))

        print(
            "Verified Quantity:",
            booking.get("verifiedQuantity", 0),
            "kg"
        )

        print(
            "Quality Grade    :",
            booking.get("qualityGrade", "N/A")
        )

        print(
            "Rate             : ₹",
            booking.get("ratePerKg", 0),
            "/kg"
        )

        print(
            "Procurement Amt  : ₹",
            booking.get("procurementAmount", 0)
        )

        print(
            "Decision         :",
            booking.get("procurementDecision", "N/A")
        )

        print(
            "Payment Status   :",
            booking.get("paymentStatus", "N/A")
        )

        print(
            "Procurement Centre:",
            booking.get("procurementCenter", "N/A")
        )

        print(
            "Slot Start       :",
            booking.get("assignedSlotStart", "N/A")
        )

        print(
            "Slot End         :",
            booking.get("assignedSlotEnd", "N/A")
        )


# =========================================================
# CREATE AI DATABASE CONTEXT
# =========================================================

def create_database_context(bookings):

    if not bookings:

        return "No booking information is available."

    context = ""

    for i, booking in enumerate(bookings, 1):

        context += f"""
BOOKING {i}

Booking ID:
{booking.get("_id", "N/A")}

Farmer:
{booking.get("firstName", "")} {booking.get("lastName", "")}

Phone:
{booking.get("phone", "N/A")}

Product:
{booking.get("product", "N/A")}

Weight:
{booking.get("weight", 0)} kg

Status:
{booking.get("status", "N/A")}

Verified Quantity:
{booking.get("verifiedQuantity", 0)} kg

Quality Grade:
{booking.get("qualityGrade", "N/A")}

Rate Per Kg:
₹{booking.get("ratePerKg", 0)}

Procurement Amount:
₹{booking.get("procurementAmount", 0)}

Procurement Decision:
{booking.get("procurementDecision", "N/A")}

Payment Status:
{booking.get("paymentStatus", "N/A")}

Procurement Centre:
{booking.get("procurementCenter", "N/A")}

Procurement Address:
{booking.get("procurementAddress", "N/A")}

Assigned Slot Start:
{booking.get("assignedSlotStart", "N/A")}

Assigned Slot End:
{booking.get("assignedSlotEnd", "N/A")}

Created At:
{booking.get("createdAt", "N/A")}

----------------------------------------
"""

    return context


# =========================================================
# AI
# =========================================================

def ask_ai(question, database_context):

    system_prompt = f"""
You are Setu Sahayak, the AI assistant for the Farmer AI project.

You have access to LIVE booking data from the Farmer AI backend.

FARMER AI:

Farmer can:
- Register
- Login
- Add agricultural products
- Book procurement slots
- Check booking status
- Check payment status

Government/Services can:
- Receive bookings
- Manage procurement
- Verify quantity
- Verify quality
- Accept or reject products
- Allocate slots
- Process payments

Admin can:
- Manage farmers
- Manage bookings
- Manage products
- Manage procurement
- Monitor system activities

FCFS means First Come First Served.
The farmer who books first should be processed first.

LIVE DATABASE BOOKINGS:

{database_context}

IMPORTANT RULES:

1. Answer using the booking data above.
2. You can answer questions about ALL farmers.
3. You can search through all bookings mentally.
4. Never invent booking information.
5. If the requested farmer/product does not exist, say it was not found.
6. Understand English, Hindi, Hinglish and Banglish.
7. Keep answers simple.
8. If asked for total bookings, count them.
9. If asked for total quantity, calculate it.
10. If asked for procurement amount, calculate or use the database value.
11. If asked about a specific farmer, search all bookings.
12. If asked about a specific product, search all bookings.
13. If asked who booked first, use booking creation time when available.
"""


    try:

        response = client.chat.completions.create(

            model="openai/gpt-4o-mini",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": question
                }
            ],

            temperature=0.2,

            max_tokens=700
        )

        return response.choices[0].message.content

    except Exception as e:

        return f"❌ AI Error: {e}"


# =========================================================
# MAIN
# =========================================================

print("=" * 80)
print("🌾 FARMER AI - SETU SAHAYAK")
print("=" * 80)

# Get ALL bookings
bookings = get_all_bookings()


# Show ALL bookings
show_all_bookings(bookings)


# Convert database data to AI context
database_context = create_database_context(bookings)


print("\n")
print("=" * 80)
print("🤖 SETU SAHAYAK READY")
print("=" * 80)

print("\nYou can ask questions like:")

print("• How many bookings are there?")
print("• Show me Raj Singh's booking")
print("• Which farmers booked mustard?")
print("• What is the total wheat quantity?")
print("• What is the procurement amount?")
print("• Who booked first?")
print("• What is the payment status?")
print("• Explain FCFS in my project")
print("\nType 'exit' to stop.")


# =========================================================
# CHAT LOOP
# =========================================================

while True:

    query = input("\nYou: ").strip()

    if query.lower() in ["exit", "quit", "bye"]:

        print("\n🌾 Setu Sahayak: Goodbye!")

        break

    if not query:

        continue

    answer = ask_ai(
        query,
        database_context
    )

    print("\n🤖 Setu Sahayak:")
    print(answer)