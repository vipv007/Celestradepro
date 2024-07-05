import yfinance as yf
import plotly.graph_objects as go
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['stock_data']
collection = db['AAPL']

# Fetch AAPL stock data
aapl = yf.Ticker("AAPL")
data = aapl.history(period="1y")

# Calculate the 50-day and 200-day moving averages
data['50_MA'] = data['Close'].rolling(window=50).mean()
data['200_MA'] = data['Close'].rolling(window=200).mean()

# Store data in MongoDB
collection.insert_many(data.reset_index().to_dict('records'))

# Create a candlestick chart
fig = go.Figure(data=[go.Candlestick(x=data.index,
                open=data['Open'],
                high=data['High'],
                low=data['Low'],
                close=data['Close'],
                name='AAPL')])

# Add closing price, 50-day MA, and 200-day MA to the chart
fig.add_trace(go.Scatter(x=data.index, y=data['Close'], mode='lines', name='Close'))
fig.add_trace(go.Scatter(x=data.index, y=data['50_MA'], mode='lines', name='50-day MA'))
fig.add_trace(go.Scatter(x=data.index, y=data['200_MA'], mode='lines', name='200-day MA'))

# Update layout
fig.update_layout(title='AAPL Stock Data with Moving Averages',
                   xaxis_title='Date',
                   yaxis_title='Price',
                   xaxis_rangeslider_visible=False)

# Show the chart
fig.show()
