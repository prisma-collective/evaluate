import requests
import json
import os

API_KEY = ""
GUEST_LIST_URL = "https://public-api.lu.ma/public/v1/event/get-guests"
API_IDS_FILE = "all-events-api-ids.txt"
OUTPUT_FILE = "accra-alj-unique-attendees.json"

def obscure_email(email):
    try:
        local, domain = email.split("@")
        if len(local) <= 3:
            obscured_local = local[0] + "...."
        else:
            obscured_local = local[:3] + "...."
        return f"{obscured_local}@{domain}"
    except Exception:
        # If email invalid format, just return as-is
        return email

def load_api_ids(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]

def get_guests_for_event(api_id):
    headers = {
        "accept": "application/json",
        "x-luma-api-key": API_KEY,
    }
    params = {
        "event_api_id": api_id
    }
    try:
        response = requests.get(GUEST_LIST_URL, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        print(f"Response for event {api_id} received, keys: {list(data.keys())}")
        entries = data.get("entries", [])
        print(f"Number of entries for event {api_id}: {len(entries)}")
        guests = []
        for entry in entries:
            guest = entry.get("guest")
            if guest:
                guests.append(guest)
        return guests
    except Exception as e:
        print(f"Error fetching guests for event {api_id}: {e}")
        return []

def main():
    api_ids = load_api_ids(API_IDS_FILE)
    print(f"Loaded {len(api_ids)} event api_ids")

    unique_guests = {}
    for api_id in api_ids:
        print(f"\nFetching guests for event: {api_id}")
        guests = get_guests_for_event(api_id)
        print(f"Got {len(guests)} guests from event {api_id}")

        for guest in guests:
            email = guest.get("email") or guest.get("user_email")
            name = guest.get("name") or guest.get("user_name") or guest.get("user_first_name")
            if email:
                if email not in unique_guests:
                    unique_guests[email] = {"name": name, "email": obscure_email(email)}
                else:
                    print(f"Duplicate guest email found: {email} (skipping)")
            else:
                print(f"Guest without email found, skipping: {guest}")

    print(f"\nTotal unique guests collected: {len(unique_guests)}")

    # Save to JSON file
    attendees_list = list(unique_guests.values())
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        json.dump(attendees_list, outfile, indent=2)
    print(f"Unique attendees saved to {os.path.abspath(OUTPUT_FILE)}")

if __name__ == "__main__":
    main()
