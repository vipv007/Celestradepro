from flask import Flask, request, jsonify
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.llms import Ollama
import streamlit as st
import requests
import time
import threading

# Function to retry a function call with exponential backoff
def retry_with_backoff(func, max_retries=3, initial_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            delay = initial_delay * 2 ** attempt
            time.sleep(delay)

# Define default port number for Flask server
FLASK_PORT = 5000
OLLAMA_PORT = 11434

# Flask app for the server
app = Flask(__name__)

# Define the ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. Your name is Sivashree's Assistant"),
    ("user", "User query: {query}")
])

# Initialize the Ollama language model with correct parameters
llm = Ollama(model="llama2", base_url=f"http://localhost:{OLLAMA_PORT}")

# Initialize the output parser
output_parser = StrOutputParser()

# Create the processing chain
chain = prompt | llm | output_parser

@app.route('/api/generate', methods=['POST'])
def generate():
    if request.method == 'POST':
        try:
            # Extract data from the request
            data = request.json
            input_txt = data.get("query")

            # Process the input and generate the response
            result = chain.invoke({"query": input_txt})

            # Return the response
            return jsonify({"response": result})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Method Not Allowed"}), 405

def run_flask():
    app.run(port=FLASK_PORT)

# Streamlit app for the client
def run_streamlit():
    st.title("ChatBot AI")

    # Ensure a unique key for the text input widget
    input_txt = st.text_input("Please enter your queries here...")

    # Process the input and display the output if there's any input
    if input_txt:
        def invoke_chain():
            return chain.invoke({"query": input_txt})

        try:
            # Attempt to invoke the chain with retry and backoff
            result = retry_with_backoff(invoke_chain)
            st.write(result)
        except requests.ConnectionError as e:
            st.error("Failed to establish a connection:")
            st.error(str(e))
            st.error(f"Please ensure that the server is running and reachable on port {OLLAMA_PORT}.")
        except Exception as e:
            st.error("An error occurred while processing the input:")
            st.error(str(e))

if __name__ == '__main__':
    # Run the Flask server in a separate thread
    flask_thread = threading.Thread(target=run_flask)
    flask_thread.start()

    # Run the Streamlit app
    run_streamlit()
