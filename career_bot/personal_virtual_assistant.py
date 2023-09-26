import os
import streamlit as st
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.vectorstores import FAISS
# from langchain.vectorstores import Chroma
# from langchain.prompts import PromptTemplate
from langchain.prompts import load_prompt
from streamlit import session_state as ss
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import uuid

import datetime




if "mongodB_pass" in os.environ:
    mongodB_pass = os.getenv("mongodB_pass")
else: mongodB_pass = st.secrets["mongodB_pass"]
#HUTta2fUrfqSb2C
# Setting up a mongo_db connection to store conversations for deeper analysis
uri = "mongodb+srv://dbUser:"+mongodB_pass+"@cluster0.wjuga1v.mongodb.net/?retryWrites=true&w=majority"

@st.cache_resource
def init_connection():
    return MongoClient(uri, server_api=ServerApi('1'))
client = init_connection()


db = client['conversations_db']
conversations_collection = db['conversations']


if "OPENAI_API_KEY" in os.environ:
    openai_api_key = os.getenv("OPENAI_API_KEY")
else: openai_api_key = st.secrets["OPENAI_API_KEY"]
    
# else:
#     openai_api_key = st.sidebar.text_input(
#         label="#### Your OpenAI API key 👇",
#         placeholder="Paste your openAI API key, sk-",
#         type="password")
    

#Creating Streamlit title and adding additional information about the bot
st.title("Art Kreimer's resume bot")
with st.expander("⚠️Disclaimer"):
    st.write("""This is a work in progress chatbot based on a large language model. It can answer questions about Art Kreimer""")

path = os.path.dirname(__file__)


# Loading prompt to query openai
prompt_template = path+"/templates/template2.json"
prompt = load_prompt(prompt_template)
#prompt = template.format(input_parameter=user_input)

# loading embedings
faiss_index = path+"/faiss_index"

# Loading CSV file
data_source = path+"/data/about_art_chatbot_data_v3.csv"

# Function to store conversation
def store_conversation(conversation_id, user_message, bot_message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data = {
        "conversation_id": conversation_id,
        "timestamp": timestamp,
        "user_message": user_message,
        "bot_message": bot_message
    }
    conversations_collection.insert_one(data)

embeddings = OpenAIEmbeddings()

#using FAISS as a vector DB
if os.path.exists(faiss_index):
        vectors = FAISS.load_local(faiss_index, embeddings)
    
else:
    # Creating embeddings for the docs
    if data_source :
        loader = CSVLoader(file_path=data_source, encoding="utf-8")
        #loader.
        data = loader.load()
        vectors = FAISS.from_documents(data, embeddings)
        vectors.save_local("faiss_index")

retriever=vectors.as_retriever(search_type="similarity", search_kwargs={"k":6, "include_metadata":True, "score_threshold":0.6})
#Creating langchain retreval chain 
chain = ConversationalRetrievalChain.from_llm(llm = ChatOpenAI(temperature=0.0,model_name='gpt-3.5-turbo', openai_api_key=openai_api_key), 
                                                retriever=retriever,return_source_documents=True,verbose=True,chain_type="stuff",
                                                max_tokens_limit=4097, combine_docs_chain_kwargs={"prompt": prompt})


def conversational_chat(query):
    
    # Be conversational and ask a follow up questions to keep the conversation going"
    result = chain({"system": 
    "You are a Resume Bot, a comprehensive, interactive resource for exploring Artiom (Art) Kreimer's background, skills, and expertise. Be polite and provide answers based on the provided context only. Use only the provided data and not prior knowledge.", 
                    "question": query, 
                    "chat_history": st.session_state['history']})
    st.session_state['history'].append((query, result["answer"]))
    
    if 'I am tuned to only answer questions' in result['answer']:
        store_conversation(st.session_state["uuid"], query, result["answer"])
        return(result["answer"])
    else: 
        store_conversation(st.session_state["uuid"], query, result["answer"])
        return(result["answer"])

if "uuid" not in st.session_state:
    st.session_state["uuid"] = str(uuid.uuid4())

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo"

if "messages" not in st.session_state:
    st.session_state.messages = []

if 'history' not in st.session_state:
    st.session_state['history'] = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Ask me about Art's skills, background, or education!"):
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
