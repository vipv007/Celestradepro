import pandas as pd
import matplotlib.pyplot as plt
from io import StringIO

# Sample commodity prices data
commodity_data_csv = """
Date,Open,High,Low,Close,Adj Close,Volume
2023-01-01,1800,1850,1790,1830,1830,100000
2023-01-02,1830,1870,1820,1850,1850,150000
2023-01-03,1850,1900,1840,1890,1890,200000
2023-01-04,1890,1920,1880,1910,1910,250000
2023-01-05,1910,1950,1900,1940,1940,300000
"""

# Sample economic indicators data
economic_data_csv = """
DATE,GDP
2023-01-01,2.5
2023-02-01,2.6
2023-03-01,2.7
2023-04-01,2.8
2023-05-01,2.9
"""

def fetch_data():
    # Create DataFrames from sample data
    commodity_data = pd.read_csv(StringIO(commodity_data_csv))
    print("Commodity Data Columns:", commodity_data.columns)  # Print column names for inspection
    
    # Convert the 'Date' column to datetime
    commodity_data['Date'] = pd.to_datetime(commodity_data['Date'])
    commodity_data.set_index('Date', inplace=True)
    commodity_data.rename(columns={'Close': 'Commodity_Price'}, inplace=True)

    # Create DataFrame for economic data
    economic_data = pd.read_csv(StringIO(economic_data_csv))
    print("Economic Data Columns:", economic_data.columns)  # Print column names for inspection

    # Convert the 'DATE' column to datetime
    economic_data['Date'] = pd.to_datetime(economic_data['DATE'])
    economic_data.set_index('Date', inplace=True)
    economic_data.rename(columns={'GDP': 'GDP_Growth'}, inplace=True)

    return commodity_data, economic_data

def analyze_and_display(commodity_data, economic_data):
    # Calculate volatility (standard deviation of returns)
    commodity_data['Price_Return'] = commodity_data['Commodity_Price'].pct_change()
    commodity_data['Volatility'] = commodity_data['Price_Return'].rolling(window=2).std()  # Use smaller window for sample data

    # Create subplots
    fig, axs = plt.subplots(3, 1, figsize=(14, 12), sharex=True)

    # Plot commodity prices
    axs[0].plot(commodity_data.index, commodity_data['Commodity_Price'], color='tab:blue')
    axs[0].set_title('Commodity Prices')
    axs[0].set_ylabel('Price')
    axs[0].grid(True)

    # Plot volatility
    axs[1].plot(commodity_data.index, commodity_data['Volatility'], color='tab:orange')
    axs[1].set_title('Commodity Price Volatility')
    axs[1].set_ylabel('Volatility')
    axs[1].grid(True)

    # Plot economic indicators (e.g., GDP Growth)
    axs[2].plot(economic_data.index, economic_data['GDP_Growth'], color='tab:green', label='GDP Growth')
    axs[2].set_title('Economic Indicators')
    axs[2].set_ylabel('Rate (%)')
    axs[2].legend()
    axs[2].grid(True)

    # Format the x-axis date
    plt.xlabel('Date')
    plt.tight_layout()
    plt.show()

# Fetch sample data
commodity_data, economic_data = fetch_data()

# Analyze and display data
analyze_and_display(commodity_data, economic_data)
