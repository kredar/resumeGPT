import os
import streamlit as st
import pandas as pd
import numpy as np
import json
import os
import openai
from google_play_scraper import app,Sort, reviews_all


# OPENAI API Key initialization
if "OPENAI_API_KEY" in os.environ:
    openai_api_key = os.getenv("OPENAI_API_KEY")
else: openai_api_key = st.secrets["OPENAI_API_KEY"]

#this is a helper function to call OpenAI API. 
#I am using gpt-3.5-turbo model for this analysis
#--------------------
def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]
#--------------------


#Creating Streamlit title and adding additional information about the bot
st.title("App Review Analysis")

path = os.path.dirname(__file__)

# First lets use the scraper to get all Google App reviews

#--------------------
df_reviews_file = path+'/reviews.csv'
if os.path.exists(df_reviews_file):
    df_reviews=pd.read_csv(df_reviews_file)
else:
    with st.spinner("Getting app reviews from the google play store..."):
        all_reviews = reviews_all(
            'ca.tangerine.clients.banking.app',
            sleep_milliseconds=0, # defaults to 0
            lang='en', # defaults to 'en'
            country='ca', # defaults to 'us'
            sort=Sort.NEWEST, # defaults to Sort.MOST_RELEVANT
        )
        df_reviews = pd.DataFrame(np.array(all_reviews),columns=['review'])
        df_reviews = df_reviews.join(pd.DataFrame(df_reviews.pop('review').tolist()))
        df_reviews['at'] = df_reviews['at'].astype(str)

        df_reviews.to_csv(path+'/reviews.csv')
#--------------------


# let's take last 100 app reviews with rating below 4 stars
df_reviews['date']=df_reviews['at'].astype(str).str.split(' ')
df_reviews['date'].head()
df_reviews[['date','time']]=df_reviews['at'].astype(str).str.split(' ', expand=True)
df_reviews['date'] = pd.to_datetime(df_reviews['date'], format='%Y-%m-%d')
df_reviews['year'] = df_reviews['date'].dt.year
df_reviews['month'] = df_reviews['date'].dt.month
df_reviews['yearmonth'] = df_reviews['year'].astype(str) + df_reviews['month'].astype(str)
df_reviews['repliedbool']=df_reviews['repliedAt'].astype(str)!="NaT"


#df_reviews=df_reviews[df_reviews['score']<4][0:200]
print(df_reviews.head())

#df_reviews.groupby(['year','month']).agg({'score':['mean']}).plot.line()
#print(df_reviews['year','month','score'].head()) #.agg({'score':['mean']})
df=(df_reviews.groupby(['yearmonth']).agg({'score':['mean']}))
print(df.head())
#df = df.reset_index()
st.line_chart(df)
# convert groupby and agg to dataframe
#





#df_reviews.groupby(['year','month']).agg({'score':['mean']}).plot.line()
# # I want to detect the following using openai api
# last_100_reviews_df['summary']=''
# last_100_reviews_df['sentiment']=''
# last_100_reviews_df['emotions']=''
# last_100_reviews_df['anger']=''
# last_100_reviews_df['frustration']=''
# last_100_reviews_df['topics']=''
# last_100_reviews_df['review_response']=''

# import time


# for index, row in last_100_reviews_df.iterrows():
#     review=row['content']
#     prompt = f"""\
# Your task is to perform the following actions on the mobile app review delimited by triple backticks: 
# 1 - Summarize with 1 sentence.
# 2 - Determine the sentiment of the review 
# 3 - Identify a list of emotions in the review. Include no more than \
# five items in the list. Format your answer as a list of \
# lower-case words separated by commas.
# 4 - Identify if the writer of the app review expressing anger?
# 5 - Identify if the writer of the app review expressing frustration?
# 6 - Summarize the review using two words, but don't use the following keywords 'bank', 'banking', 'app',  \

# Output a json object only that contains the following keys: \ 
# summary, sentiment, emotions, anger as a boolean, frustration as boolean, topics.\
#   Make sure output is a valid json format

# Review: ```{review}```
# """
    
#     response = get_completion(prompt)
#     print(response)
#     response_json = json.loads(response)
   
#     #time.sleep(2)
#     last_100_reviews_df.at[index, 'summary']=response_json['summary']
#     last_100_reviews_df.at[index, 'sentiment']=response_json['sentiment']
#     last_100_reviews_df.at[index, 'emotions']=response_json['emotions']
#     last_100_reviews_df.at[index, 'anger']=response_json['anger']
#     last_100_reviews_df.at[index, 'frustration']=response_json['frustration']
#     last_100_reviews_df.at[index, 'topics']=response_json['topics']
