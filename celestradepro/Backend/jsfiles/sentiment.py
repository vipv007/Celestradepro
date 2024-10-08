from yahoo_fin import stock_info as si
import pandas as pd

def fetch_earnings_calendar(start_date, end_date):
    try:
        earnings = si.get_earnings_in_date_range(start_date, end_date)
        print("Raw data retrieved:")
        print(earnings)
        return earnings
    except Exception as e:
        print(f"An error occurred while fetching earnings data: {e}")
        return None

def main():
    start_date = '2024-08-01'
    end_date = '2024-08-15'
    
    earnings_calendar = fetch_earnings_calendar(start_date, end_date)
    
    if earnings_calendar:
        print("Earnings Calendar Data Retrieved:")
        print(pd.DataFrame(earnings_calendar))
    else:
        print("No data retrieved.")

if __name__ == "__main__":
    main()
