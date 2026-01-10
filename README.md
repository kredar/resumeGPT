# ResumeGPT - Art Kreimer's AI-Powered Resume Chatbot

A modern, interactive chatbot application that answers questions about Art Kreimer's professional background, built with React, TypeScript, Vite, and Supabase.

## Overview

This application uses RAG (Retrieval Augmented Generation) with OpenAI's GPT-4 to provide accurate, context-aware responses about professional experience, skills, and qualifications. The chatbot is deployed as a serverless application using Supabase Edge Functions and can be hosted on Vercel.

## Features

- **Modern React UI**: Clean, responsive design built with React, TypeScript, and Tailwind CSS
- **Real-time Chat**: Interactive chat interface with suggested follow-up questions
- **AI-Powered Responses**: Uses OpenAI GPT-4 for intelligent, contextual answers
- **Conversation Storage**: All conversations are stored in Supabase for analytics
- **Serverless Architecture**: Edge Functions handle chat logic, scalable and cost-effective
- **Easy Deployment**: Ready to deploy on Vercel with zero configuration

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Database**: Supabase PostgreSQL
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## Prerequisites

- Node.js 18 or higher
- A Supabase account with a project
- OpenAI API key
- Vercel account (for deployment)

## Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/resumegpt.git
cd resumegpt
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Customization

To customize this chatbot for your own resume:

1. **Update the knowledge base** in `supabase/functions/chat/index.ts`:
   - Modify the `knowledgeBase` array with your own Q&A pairs
   - Update references to "Art Kreimer" with your name

2. **Update the system prompt** in the same file:
   - Change the chatbot's personality and instructions
   - Modify the response format if needed

3. **Customize the UI** in `src/App.tsx`:
   - Update the welcome message
   - Change the header title
   - Modify the default suggested questions

4. **Update branding**:
   - Change the title in `index.html`
   - Update the favicon
   - Modify colors in `tailwind.config.js` or component styles

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure environment variables** in Vercel:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**: Vercel will automatically build and deploy your application

## Project Structure

```
resumegpt/
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx       # Message input component
│   │   ├── ChatMessage.tsx     # Individual message display
│   │   └── SuggestedQuestions.tsx  # Suggested questions UI
│   ├── lib/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   ├── types.ts                # TypeScript type definitions
│   └── index.css               # Global styles with Tailwind
├── supabase/
│   └── functions/
│       └── chat/
│           └── index.ts        # Edge Function for chat logic
├── data/                       # Original data files (reference)
├── index.html                  # HTML entry point
├── vercel.json                 # Vercel configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Database Schema

The application uses a single table for storing conversations:

### conversations
- `id` (uuid, primary key)
- `conversation_id` (uuid) - Groups messages from same session
- `user_message` (text) - User's question
- `bot_message` (text) - Bot's response
- `answered` (boolean) - Whether question was answered successfully
- `created_at` (timestamptz) - Timestamp


## Acknowledgements

This project is highly influence by the Repository created by [Art Kreimer](https://github.com/kredar) and is dependent on the following libraries and tools:

- [Streamlit](https://streamlit.io/) for building the web application
- [LangChain](https://langchain.com/) for integrating the language model and retrieval chain
- [OpenAI API](https://openai.com/) for the language model
- [FAISS](https://github.com/facebookresearch/faiss) for the vector database
- [Firebase](https://firebase.google.com/) for storing the conversation history

## License

This project is licensed under the [MIT License](LICENSE).