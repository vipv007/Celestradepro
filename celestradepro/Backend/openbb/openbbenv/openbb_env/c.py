import openbb
import obb

def fetch_economic_events_openbb(country="US"):
    try:
        events = openbb.fetch_economic_events(country=country)
        return events
    except Exception as e:
        raise Exception(f"Failed to fetch economic events from openbb: {e}")

def fetch_economic_events_obb(country="US"):
    try:
        events = obb.fetch_economic_events(country=country)
        return events
    except Exception as e:
        raise Exception(f"Failed to fetch economic events from obb: {e}")

def main():
    try:
        # Fetch economic events from openbb
        calendar_openbb = fetch_economic_events_openbb()
        print("Economic events from openbb:")
        print(calendar_openbb)
        
        # Fetch economic events from obb
        calendar_obb = fetch_economic_events_obb()
        print("\nEconomic events from obb:")
        print(calendar_obb)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
