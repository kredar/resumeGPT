# Import necessary libraries
from transformers import BertModel, BertTokenizer
import torch
import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

# Load pre-trained BERT model and tokenizer
model_name = "bert-base-uncased"
model_bert = BertModel.from_pretrained(model_name, cache_dir=DA.paths.datasets+"/models")
tokenizer = BertTokenizer.from_pretrained(model_name, cache_dir=DA.paths.datasets+"/models")


# Define two sentences where a word has different meanings
sentence_q4a = "he needs to bank the money"
sentence_q4b = "he is going to the bank of the river"

# Tokenize both sentences

tokens_q4a = tokenizer.tokenize(sentence_q4a)
tokens_q4b = tokenizer.tokenize(sentence_q4b)

#find embeddings for both sentences
inputs_q4a = tokenizer(sentence_q4a, return_tensors="pt")
inputs_q4b = tokenizer(sentence_q4b, return_tensors="pt")

#find embeddings for word bank in both sentences
bank_q4a = model_bert(**inputs_q4a)['last_hidden_state'][0][5]
bank_q4b = model_bert(**inputs_q4b)['last_hidden_state'][0][7]  

#find cosine similarity between the two words
cos = torch.nn.CosineSimilarity(dim=0, eps=1e-6)
cos_sim = cos(bank_q4a, bank_q4b)
print("Cosine similarity between the two words is: ", cos_sim)

# Compute the average embeddings of each sentence
mean_q4a = torch.mean(model_bert(**inputs_q4a)['last_hidden_state'][0], dim=0)
mean_q4b = torch.mean(model_bert(**inputs_q4b)['last_hidden_state'][0], dim=0)

