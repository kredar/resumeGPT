import os
import streamlit as st
# Import LangChain components
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import load_prompt
from langchain_community.document_loaders import PyPDFLoader, CSVLoader
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain_community.vectorstores.faiss import FAISS
# from langchain.vectorstores import Chroma
# from langchain.prompts import PromptTemplate
from streamlit import session_state as ss
# MongoDB imports for conversation storage
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import uuid
import json
import time
import datetime
import langchain_openai

# Utility function to validate JSON responses
def is_valid_json(data):
    try:
        json.loads(data)
        return True
    except json.JSONDecodeError:
        return False

# Get MongoDB credentials from environment or secrets
if "mongodB_pass" in os.environ:
    mongodB_pass = os.getenv("mongodB_pass")
else: mongodB_pass = st.secrets["mongodB_pass"]

# MongoDB connection string
uri = "mongodb+srv://dbUser:"+mongodB_pass+"@cluster0.wjuga1v.mongodb.net/?retryWrites=true&w=majority"

# Initialize MongoDB connection with caching
@st.cache_resource
def init_connection():
    return MongoClient(uri, server_api=ServerApi('1'))
client = init_connection()

# Set up database and collection
db = client['conversations_db']
conversations_collection = db['conversations']

# Get OpenAI API key from environment or secrets
if "OPENAI_API_KEY" in os.environ:
    openai_api_key = os.getenv("OPENAI_API_KEY")
else: openai_api_key = st.secrets["OPENAI_API_KEY"]
    
# else:
#     openai_api_key = st.sidebar.text_input(
#         label="#### Your OpenAI API key 👇",
#         placeholder="Paste your openAI API key, sk-",
#         type="password")
    

#Creating Streamlit title and adding additional information about the bot
st.title("Art Kreimer's resumeGPT")
with st.expander("⚠️Disclaimer"):
    st.write("""This is a work in progress chatbot based on a large language model. It can answer questions about Art Kreimer""")

# Set up file paths
#path = os.path.dirname(__file__)
path = os.getcwd()  # Current working directory
filepath = os.path.join(path, "data", "resume.pdf")

# Loading prompt to query openai
prompt_template = "./template.json"
prompt = load_prompt(prompt_template)
#prompt = template.format(input_parameter=user_input)

# loading embedings
#faiss_index = path+"/faiss_index"
faiss_index = os.path.join(path,"faiss_index")

# Loading CSV file
# data_source = path+"/data/about_me.csv"
# pdf_source = path+"/data/resume.pdf"

pdf_source = os.path.join(path, "data", "resume.pdf")
data_source = os.path.join(path, "data", "about_me.csv")

# Function to store conversation history in MongoDB
def store_conversation(conversation_id, user_message, bot_message, answered):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "conversation_id": conversation_id,
        "timestamp": timestamp,
        "user_message": user_message,
        "bot_message": bot_message,
        "answered": answered
    }
    conversations_collection.insert_one(data)

# Initialize OpenAI embeddings
embeddings = OpenAIEmbeddings()

#using FAISS as a vector DB
if os.path.exists(faiss_index):
        vectors = FAISS.load_local(faiss_index, embeddings,allow_dangerous_deserialization=True)
else:
    # Creating embeddings for the docs
    if data_source:
        # Load data from PDF and CSV sources
        pdf_loader = PyPDFLoader(pdf_source)
        pdf_data = pdf_loader.load_and_split()
        print(pdf_data)
        csv_loader = CSVLoader(file_path=data_source, encoding="utf-8")
        #loader.
        csv_data = csv_loader.load()
        data = pdf_data + csv_data
        vectors = FAISS.from_documents(data, embeddings)
        vectors.save_local("faiss_index")

retriever=vectors.as_retriever(search_type="similarity", search_kwargs={"k":6, "include_metadata":True, "score_threshold":0.6})
#Creating langchain retreval chain 
chain = ConversationalRetrievalChain.from_llm(llm = ChatOpenAI(temperature=0.0,model_name='gpt-4', openai_api_key=openai_api_key), 
                                                retriever=retriever,return_source_documents=True,verbose=True,chain_type="stuff",
                                                max_tokens_limit=4097, combine_docs_chain_kwargs={"prompt": prompt})

# Main conversation function
def conversational_chat(query):
    with st.spinner("Thinking..."):
        # time.sleep(1)
        # Be conversational and ask a follow up questions to keep the conversation going"
        result = chain({"system": 
        "You are a Art's ResumeGPT chatbot, a comprehensive, interactive resource for exploring Artiom (Art) Kreimer's background, skills, and expertise. Be polite and provide answers based on the provided context only. Use only the provided data and not prior knowledge.", 
                        "question": query, 
                        "chat_history": st.session_state['history']})
    
    if (is_valid_json(result["answer"])):              
        data = json.loads(result["answer"])
    else:
        data = json.loads('{"answered":"false", "response":"Hmm... Something is not right. I\'m experiencing technical difficulties. Try asking your question again or ask another question about Art Kreimer\'s professional background and qualifications. Thank you for your understanding.", "questions":["What is Art\'s professional experience?","What projects has Art worked on?","What are Art\'s career goals?"]}')
    # Access data fields
    answered = data.get("answered")
    response = data.get("response")
    questions = data.get("questions")

    full_response="--"

    st.session_state['history'].append((query, response))
    
    if ('I am tuned to only answer questions' in response) or (response == ""):
        full_response = """Unfortunately, I can't answer this question. My capabilities are limited to providing information about Art Kreimer's professional background and qualifications. If you have other inquiries, I recommend reaching out to Art on [LinkedIn](https://www.linkedin.com/in/artkreimer/). I can answer questions like: \n - What is Art Kreimer's educational background? \n - Can you list Art Kreimer's professional experience? \n - What skills does Art Kreimer possess? \n"""
        store_conversation(st.session_state["uuid"], query, full_response, answered)
        
    else: 
        markdown_list = ""
        for item in questions:
            markdown_list += f"- {item}\n"
        full_response = response + "\n\n What else would you like to know about Art? You can ask me: \n" + markdown_list
        store_conversation(st.session_state["uuid"], query, full_response, answered)
    return(full_response)

# Initialize session state variables
if "uuid" not in st.session_state:
    st.session_state["uuid"] = str(uuid.uuid4())

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo"

# Initialize chat interface
if "messages" not in st.session_state:
    st.session_state.messages = []
    with st.chat_message("assistant"):
        message_placeholder = st.empty()

        welcome_message = """
            Welcome! I'm **Art's ResumeGPT**, specialized in providing information about Art Kreimer's professional background and qualifications. 
            
            Feel free to ask me questions such as:

            - What is Art Kreimer's educational background?
            - Can you outline Art Kreimer's professional experience?
            - What skills and expertise does Art Kreimer bring to the table?

            I'm here to assist you. What would you like to know?
            """
        message_placeholder.markdown(welcome_message)
        

if 'history' not in st.session_state:
    st.session_state['history'] = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Handle new chat inputs
if prompt := st.chat_input("Ask me about Art Kreimer"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        
        user_input=prompt
        st.markdown(prompt)

    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        full_response = conversational_chat(user_input)
        message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})
