from datetime import datetime
from pymongo import MongoClient
from openbb import obb

# MongoDB connection details
MONGO_HOST = 'localhost'
MONGO_PORT = 27017
DATABASE_NAME = 'openbb'
COLLECTION_NAME = 'historical_prices'

def main():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_HOST, MONGO_PORT)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Fetch historical price data for AAPL for a specific date range
        output = obb.equity.price.historical("AAPL", start_date="2023-01-01", end_date="2023-01-06")
        
        # Print the full output for debugging
        print("Full Output:", output)
        
        # Inspect the structure of the output
        if hasattr(output, 'results'):
            results = output.results
            if results:
                for idx, data in enumerate(results, start=1):
                    # Prepare document to insert into MongoDB
                    document = {
                        'symbol': 'AAPL',
                        'date': data.date.isoformat(),  # Convert to string
                        'open': data.open,
                        'high': data.high,
                        'low': data.low,
                        'close': data.close,
                        'volume': data.volume,
                        'vwap': data.vwap if data.vwap else None,
                        'split_ratio': data.split_ratio,
                        'dividend': data.dividend,
                        'timestamp': datetime.utcnow()
                    }
                    # Insert document into MongoDB collection
                    collection.insert_one(document)
                    print(f"\nData Point {idx}:")
                    print(f"Date: {data.date.isoformat()}")  # Convert to string for printing
                    print(f"Open: {data.open}")
                    print(f"High: {data.high}")
                    print(f"Low: {data.low}")
                    print(f"Close: {data.close}")
                    print(f"Volume: {data.volume}")
                    print(f"VWAP: {data.vwap if data.vwap else 'N/A'}")
                    print(f"Split Ratio: {data.split_ratio}")
                    print(f"Dividend: {data.dividend}")
            else:
                print("Results list is empty.")
        else:
            print("Output does not have 'results' attribute.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        client.close()

if __name__ == "__main__":
    main()
