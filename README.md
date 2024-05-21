# ResumeGPT - Art Kreimer's Resume bot

## Overview
This Streamlit application is an interactive chatbot showcasing your professional background and qualifications. Leveraging large language models (LLMs) and a Retrieval Augmented Generation (RAG) framework, it delivers accurate and context-aware answers based on your resume and other data stored in a CSV file. The chatbot utilizes a FAISS vector store for efficient information retrieval and the OpenAI GPT-3.5-turbo model for answer generation. Streamlit provides a user-friendly interface for seamless interaction.

## Features

- **RAG-based:** Employs a Retrieval Augmented Generation approach, ensuring responses are both relevant and grounded in the information provided.
- **Interactive Q&A:** Enables users to ask questions and receive informative answers directly derived from the CSV data.
- **Conversation History:** Retains conversations in MongoDB Atlas for later review and analysis, enhancing user engagement.
- **Knowledge Awareness:** Gracefully handles situations where the chatbot lacks the information to answer a question, ensuring a smooth user experience.
- **Question Suggestions:** Offers prompts to guide users and encourage meaningful conversations, promoting deeper exploration of your qualifications.

## Link to the Streamlit app

This is my ResumeGPT demo Wesbite : [https://art-career-bot.streamlit.app/](https://art-career-bot.streamlit.app/)

## Link to the blog post 

This is a detailed post about the logic behind this chatbot and explanations how it works: [www.artkreimer.com/](https://www.artkreimer.com/How-To-Build-Resume-Bot-powered-by-llm/)


## Prerequisites

- Python 3.9 or higher
- OpenAI API key
- MongoDB Atlas account
- Streamlit account to host the app

## Installation

1. Fork my repository and change the name to your desired name
2. Clone the repository:

```
git clone https://github.com/{username}/{yourGPT}.git && cd {yourGPT}
```

2. Create virtual env

```
python3 -m venv venv
source venv/bin/activate
```

3. Install the required dependencies:

```
pip install -r requirements.txt
```

3. Update the following files:
   * Replace all instance of the name `Art Kreimer` or `Art` with your name and nickname in the following files:
     * `app.py`
     * ``templates/template.json``
   * Change the following in the `data` folder
     * `about_me.csv` with relevant questions about you

4. Add OPENAI_API_KEY key to your shell variables
```
export OPENAI_API_KEY="your_openai_api_key"
```

## Usage

1. Run the Streamlit application:

```
streamlit run app.py
```

2. The application will open in your default web browser. First time it will run a bit longer indexing the csv file and storing it in a FAISS vector store. 
3. Ask questions about your background and qualifications, and the chatbot will provide relevant responses.

## Publishing your app

1. Once you commit all your files to **GitHub**, create an account in [**Streamlit.io** ](https://share.streamlit.io/)preferably with your GitHub account.

2. Click on the `New app` option:

3. Input your `OPENAI_API_KEY`  using the **Advanced settings...** option

4. Click on **Deploy** button

### Note

You can also deploy the same on **[HuggingFace Spaces](https://huggingface.co/spaces)**. You can find more documentation on the same [here](https://huggingface.co/docs/hub/en/spaces-sdks-streamlit).

## Configuration

- The application uses a FAISS index to store the CSV and PDF data embeddings. If the index file (`faiss_index`) does not exist, it will be created automatically and it will take several minutes to generate all embeddings. 
- The CSV data file path is set in the `data_source` variable, and the PDF resume file path is set in the `pdf_source` variable.


## Acknowledgements

This project is highly influence by the Repository created by [Art Kreimer](https://github.com/kredar) and is dependent on the following libraries and tools:

- [Streamlit](https://streamlit.io/) for building the web application
- [LangChain](https://langchain.com/) for integrating the language model and retrieval chain
- [OpenAI API](https://openai.com/) for the language model
- [FAISS](https://github.com/facebookresearch/faiss) for the vector database
- [Firebase](https://firebase.google.com/) for storing the conversation history

## License

This project is licensed under the [MIT License](LICENSE).