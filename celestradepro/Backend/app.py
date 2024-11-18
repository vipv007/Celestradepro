from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Endpoint to fetch live stock data for a given symbol
@app.route('/stock/live/<symbol>', methods=['GET'])
def get_live_stock_data(symbol):
    try:
        # Fetch recent stock data to simulate live data (e.g., last 1 day with 5-minute intervals)
        stock = yf.Ticker(symbol)
        data = stock.history(period='1d', interval='5m')

        if data.empty:
            return jsonify({'error': f'No live data found for stock symbol: {symbol}'}), 404

        data.index = data.index.strftime('%Y-%m-%d %H:%M:%S')
        data_dict = data.to_dict()

        return jsonify(data_dict)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to fetch live forex data for a given symbol
@app.route('/forex/live/<symbol>', methods=['GET'])
def get_live_forex_data(symbol):
    try:
        # Fetch recent forex data to simulate live data (e.g., last 1 day with 5-minute intervals)
        forex = yf.Ticker(symbol)
        data = forex.history(period='1d', interval='5m')

        if data.empty:
            return jsonify({'error': f'No live data found for forex symbol: {symbol}'}), 404

        data.index = data.index.strftime('%Y-%m-%d %H:%M:%S')
        data_dict = data.to_dict()

        return jsonify(data_dict)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to fetch live commodity data for a given symbol
@app.route('/commodity/live/<symbol>', methods=['GET'])
def get_live_commodity_data(symbol):
    try:
        # Fetch recent commodity data to simulate live data (e.g., last 1 day with 5-minute intervals)
        commodity = yf.Ticker(symbol)
        data = commodity.history(period='1d', interval='5m')

        if data.empty:
            return jsonify({'error': f'No live data found for commodity symbol: {symbol}'}), 404

        data.index = data.index.strftime('%Y-%m-%d %H:%M:%S')
        data_dict = data.to_dict()

        return jsonify(data_dict)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
