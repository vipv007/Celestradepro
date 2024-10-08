import pandas as pd
import matplotlib.pyplot as plt
import requests
from io import StringIO

# Define public URLs for CSV files of multiple commodities
# Example URLs for Gold, Silver, and Oil prices
COMMODITY_URLS = {
    'Gold': 'https://query1.finance.yahoo.com/v7/finance/download/GC=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Silver': 'https://query1.finance.yahoo.com/v7/finance/download/SI=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Oil': 'https://query1.finance.yahoo.com/v7/finance/download/CL=F?period1=0&period2=9999999999&interval=1d&events=history'
}

def fetch_data(url):
    """Fetch commodity data from a URL and return as DataFrame."""
    commodity_data = pd.read_csv(url)
    print(f"Columns in fetched data: {commodity_data.columns}")  # Print column names for inspection
    commodity_data['Date'] = pd.to_datetime(commodity_data['Date'])
    commodity_data.set_index('Date', inplace=True)
    commodity_data.rename(columns={'Close': 'Commodity_Price'}, inplace=True)
    return commodity_data

def calculate_swings(data):
    """Calculate price swings based on price returns."""
    data['Price_Swing'] = data['Commodity_Price'].pct_change() * 100  # Percentage change in price
    return data

def plot_swings(commodities_data):
    """Plot price swings for multiple commodities."""
    fig, ax = plt.subplots(figsize=(14, 7))
    
    for name, data in commodities_data.items():
        ax.plot(data.index, data['Price_Swing'], label=name)
    
    ax.set_title('Commodity Price Swings')
    ax.set_xlabel('Date')
    ax.set_ylabel('Price Swing (%)')
    ax.legend()
    ax.grid(True)
    plt.tight_layout()
    plt.show()

def main():
    commodities_data = {}
    
    for name, url in COMMODITY_URLS.items():
        print(f"Fetching data for {name}...")
        data = fetch_data(url)
        data = calculate_swings(data)
        commodities_data[name] = data
    
    plot_swings(commodities_data)

if __name__ == '__main__':
    main()
