import requests 
from openbb import obb
import pandas as pd
from datetime import datetime, timedelta
from pymongo import MongoClient

# Define the API key and endpoint for economic calendar events
api_key = "RA4m73XR6p2GqrldYIOf7yl01ineGiZY"
endpoint = f"https://financialmodelingprep.com/api/v3/economic_calendar?apikey={api_key}"

# Make the request to the API
response = requests.get(endpoint)
data = response.json()

# Convert the data to a DataFrame
df = pd.DataFrame(data)

# Convert the 'date' column to datetime format
df['date'] = pd.to_datetime(df['date'])

# Get today's date and the date one month from now
today = datetime.today()
one_month_later = today + timedelta(days=7)

# Filter the DataFrame for events in the next one month
next_month_events = df[(df['date'] >= today) & (df['date'] <= one_month_later)]

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection string
db = client['FinanceDB']  # Database name
collection = db['events']  # Collection name

# Convert the DataFrame to a list of dictionaries and insert into MongoDB
events_list = next_month_events.to_dict('records')
if events_list:
    collection.insert_many(events_list)
    print(f"Inserted {len(events_list)} documents into the collection.")
else:
    print("No events to insert.")

# Optional: Display the inserted documents
for event in collection.find():
    print(event)
