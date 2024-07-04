from openbb import obb

def main():
    # Fetch historical price data for AAPL for a specific date range
    output = obb.equity.price.historical("AAPL", start_date="2023-01-01", end_date="2023-01-10")
    
    # Print the full output to debug
    print("Full Output:", output)
    
    # Check if 'results' key exists in output and iterate over it
    if 'results' in output and output.results:
        for idx, data in enumerate(output.results, start=1):
            print(f"\nData Point {idx}:")
            print(f"Date: {data.date}")
            print(f"Open: {data.open}")
            print(f"High: {data.high}")
            print(f"Low: {data.low}")
            print(f"Close: {data.close}")
            print(f"Volume: {data.volume}")
            print(f"VWAP: {data.vwap if data.vwap else 'N/A'}")
            print(f"Split Ratio: {data.split_ratio}")
            print(f"Dividend: {data.dividend}")
    else:
        print("No results found.")

if __name__ == "__main__":
    main()
