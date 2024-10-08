import langchain
import streamlit as st
import logging
from langchain_community.llms import Ollama

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize langchain attributes if they don't exist
if not hasattr(langchain, 'debug'):
    langchain.debug = False

if not hasattr(langchain, 'llm_cache'):
    langchain.llm_cache = None

# Initialize the language model
llm = Ollama(model="llama2:13b")

# Function to generate response from language model
def generate_response(prompt):
    try:
        response = llm.invoke(prompt)
        return response
    except TimeoutError:
        return "Request timed out"
    except Exception as e:
        return f"An error occurred: {e}"

# Streamlit app
def main():
    st.title("Chat with LLM (Llama2 Model)")

    user_input = st.text_input("You:", "")

    if st.button("Send"):
        if user_input.strip() == "":
            st.error("Please enter a message.")
        else:
            response = generate_response(user_input)
            st.text_area("LLM:", value=response, height=200, max_chars=None)

if __name__ == "__main__":
    main()
