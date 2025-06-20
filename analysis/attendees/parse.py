import json
import os
import sys

def load_events_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            print(f"Loading JSON data from '{file_path}'...")
            data = json.load(f)
            print(f"Successfully loaded JSON data.")
            return data
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse JSON.\nDetails: {e}")
        sys.exit(1)

def extract_api_ids_with_tag(data, target_tag):
    entries = data.get("entries", [])
    print(f"Total entries found: {len(entries)}")

    filtered_ids = []
    matched_tag_count = 0
    missing_api_id_count = 0

    for i, entry in enumerate(entries, 1):
        tags = entry.get("tags", [])
        # Check if any tag dict has name == target_tag
        has_target_tag = any(tag.get("name") == target_tag for tag in tags)

        if has_target_tag:
            matched_tag_count += 1
            event = entry.get("event", {})
            api_id = event.get("api_id")
            if api_id:
                filtered_ids.append(api_id)
                print(f"[Entry {i}] Found api_id: {api_id}")
            else:
                missing_api_id_count += 1
                print(f"[Entry {i}] WARNING: 'api_id' missing in event with tag '{target_tag}'")
        else:
            print(f"[Entry {i}] Tag '{target_tag}' not found in {[tag.get('name') for tag in tags]}")

    print(f"Entries with tag '{target_tag}': {matched_tag_count}")
    print(f"Entries missing 'api_id': {missing_api_id_count}")
    print(f"Total api_id collected: {len(filtered_ids)}")

    return filtered_ids


def main():
    file_path = os.path.join(os.path.dirname(__file__), 'all-events.json')
    data = load_events_json(file_path)
    api_ids = extract_api_ids_with_tag(data, target_tag="ALJ-accra")

    print("\nFiltered api_id results:")
    for api_id in api_ids:
        print(api_id)

if __name__ == "__main__":
    main()
