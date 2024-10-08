import plotly.graph_objs as go
from pymongo import MongoClient

def fetch_from_mongodb(symbols):
    try:
        # Connect to MongoDB
        #client = MongoClient('mongodb://celes-mon-db:Rzp7AmNbss2332G6A6UrumqPhABRvdaOAINjpd2L4kvQ2Ycj7RFxMxcspvB4qnPO1knuW2EkpMcbjspM3aI6sg%3D%3D@celes-mon-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celes-mon-db@')
        #db = client['test']  # Replace 'test' with your database name

        client = MongoClient('mongodb://127.0.0.1/')
        db = client['FinanceDB']  # Replace 'test' with your database name

        collection = db['analyst']  # Replace 'analyst' with your collection name

        chart_data = {}
        for symbol in symbols:
            # Fetch data from MongoDB for each symbol
            document = collection.find_one({'Symbol': symbol})
            print(f"Document for {symbol}:", document)
            if document and 'Data' in document:
                data = document['Data']
                chart_data[symbol] = {
                    'MarketCap': float(data.get('MarketCapitalization', 0)),
                    'PERatio': float(data.get('PERatio', 0)),
                    'EPS': float(data.get('EPS', 0)),
                    'DividendYield': float(data.get('DividendYield', 0))
                }
            else:
                print(f"No data found for symbol: {symbol}")

        client.close()
        return chart_data

    except Exception as e:
        print(f"Error fetching data from MongoDB: {e}")
        return {}

def create_chart(symbols, data):
    labels = ['MarketCap', 'PERatio', 'EPS', 'DividendYield']
    trace_data = {label: [data[symbol][label] for symbol in symbols if symbol in data] for label in labels}

    fig = go.Figure()
    for label in labels:
        fig.add_trace(go.Bar(x=symbols, y=trace_data[label], name=label))

    fig.update_layout(barmode='group', xaxis_title='Symbols', yaxis_title='Values', title='Analytic Consensus and Trends Related Data')
    fig.show()

def main():
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']  # List of stock symbols

    try:
        chart_data = fetch_from_mongodb(symbols)
        if chart_data:
            create_chart(symbols, chart_data)
        else:
            print("No chart data available.")
    except Exception as e:
        print("Error creating chart:", e)

if __name__ == "__main__":
    main()
