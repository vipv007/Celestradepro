# from langchain_community.document_loaders import TextLoader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.chains import load_chain
# from langchain.llms import OpenAI

# # Set your OpenAI API key as an environment variable
# import os
# os.environ["OPENAI_API_KEY"] = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU" 

# # Load the document
# loader = TextLoader('artical.txt')  # Replace with the actual path to your text file
# documents = loader.load()

# # Split the document into smaller chunks
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
# texts = text_splitter.split_documents(documents)

# # Create an OpenAI LLM
# llm = OpenAI(temperature=0.7)

# # Create a summarization chain
# chain = load_chain("summarize", llm=llm, chain_type="stuff")

# # Summarize the text chunks
# summary = chain.run(texts)

# # Print the summary
# print(summary)