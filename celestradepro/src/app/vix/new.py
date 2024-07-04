# import requests
# from pymongo import MongoClient

# def fetch_analytic_data(symbol, api_key):
#     url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={api_key}"
#     response = requests.get(url)
#     data = response.json()
#     return data

# def save_to_mongodb(symbol, data):
#     # Connect to MongoDB
#     client = MongoClient('mongodb://127.0.0.1/')
#     db = client['FinanceDB']  # Replace 'FinanceDB' with your database name
#     collection = db['analyst']  # Replace 'StockData' with your collection name
    
#     try:
#         # Insert data into MongoDB
#         collection.insert_one({'Symbol': symbol, 'Data': data})
#         print(f"Data for symbol {symbol} saved successfully.")
#     except Exception as e:
#         print(f"Error saving data for symbol {symbol}: {e}")
#     finally:
#         client.close()

# def main():
#     # Replace 'YOUR_API_KEY' with your Alpha Vantage API key
#     api_key = 'ERH07HR6LA2NWGBT'
#     symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']  # List of stock symbols
    
#     try:
#         for symbol in symbols:
#             analytic_data = fetch_analytic_data(symbol, api_key)
#             print("Analytic Consensus and Trends Related Data for", symbol)
#             for key, value in analytic_data.items():
#                 print(f"{key}: {value}")
#             print()  # Add a blank line between each stock's data
#             save_to_mongodb(symbol, analytic_data)
#     except Exception as e:
#         print("Error fetching analytic data:", e)

# if __name__ == "__main__":
#     main()
import plotly.graph_objs as go
from pymongo import MongoClient

def fetch_from_mongodb(symbols):
    # Connect to MongoDB
    client = MongoClient('mongodb://127.0.0.1/')
    db = client['FinanceDB']  # Replace 'FinanceDB' with your database name
    collection = db['analyst']  # Replace 'StockData' with your collection name
    
    chart_data = {}
    for symbol in symbols:
        # Fetch data from MongoDB for each symbol
        data = collection.find_one({'Symbol': symbol})['Data']
        chart_data[symbol] = {
            'MarketCap': data.get('MarketCapitalization', 0),
            'PERatio': data.get('PERatio', 0),
            'EPS': data.get('EPS', 0),
            'DividendYield': data.get('DividendYield', 0)
        }
    
    client.close()
    return chart_data

def create_chart(symbols, data):
    labels = ['MarketCap', 'PERatio', 'EPS', 'DividendYield']
    trace_data = {label: [data[symbol][label] for symbol in symbols] for label in labels}
    
    fig = go.Figure()
    for label in labels:
        fig.add_trace(go.Bar(x=symbols, y=trace_data[label], name=label))

    fig.update_layout(barmode='group', xaxis_title='Symbols', yaxis_title='Values', title='Analytic Consensus and Trends Related Data')
    fig.show()

def main():
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']  # List of stock symbols
    
    try:
        chart_data = fetch_from_mongodb(symbols)
        create_chart(symbols, chart_data)
    except Exception as e:
        print("Error creating chart:", e)

if _name_ == "_main_":
    main()