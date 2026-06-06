const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

const knowledgeBase = [
  {
    question: 'who is art?',
    answer: "Artiom (Art) Kreimer is currently the Director of Product Management AI/ML at Guidepoint (since September 2024), where he leads the design and execution of AI-powered research capabilities, transforming how expert knowledge is synthesized into actionable insights. He's working on exciting projects including the AskGP AI Chatbot (an agentic RAG-based chatbot that analyzes expert interview data), Deep Research (a multi-agent orchestration framework), and an AI Agent Evaluation Framework for performance benchmarking. Art is a seasoned product leader with over a decade of experience leading cross-functional teams to bring digital products to life. His passion lies in Data Analytics, Machine Learning, Artificial Intelligence, and Conversational AI, and he truly enjoys using these technologies to solve customer problems. Before joining Guidepoint, Art was a Product Lead for Data & AI at Scotiabank (2021-2024), where he led the AI Innovation Squad and worked on groundbreaking projects like LLM-based chatbots and Android app enhancements. Prior to that, he was VP of Product and Analytics at Wysdom.AI (acquired by Calabrio). He has a Bachelor's degree in Communication Systems Engineering from Ben-Gurion University (graduated Magna Cum Laude) and has worked across various industries, including ASIC, Consumer Electronics, Telecom, web and mobile apps, Machine Learning and Conversational AI, and Finance. He lives in Ontario, Canada, with his wife, two daughters, and Hungarian Vizsla. He loves spending his free time with his family and enjoying outdoor activities like hiking, running, and exploring nature. He is also an avid reader and lifelong learner. He shares his thoughts and tips on his personal blog at https://www.artkreimer.com."
  },
  {
    question: 'current role',
    answer: "Art is currently the Director of Product Management AI/ML at Guidepoint, a position he started in September 2024. In this role, he leads the design and execution of AI-powered research capabilities, transforming how expert knowledge is synthesized into actionable insights. He's working on cutting-edge projects including the AskGP AI Chatbot (an agentic RAG-based chatbot), Deep Research (a multi-agent orchestration framework), and an AI Agent Evaluation Framework. He also established an AI Product Roundtable to foster collaboration and knowledge sharing across teams."
  },
  {
    question: 'guidepoint projects',
    answer: "At Guidepoint, Art serves as Director of Product Management AI/ML. He directed development of the AskGP AI Chatbot, an agentic RAG-based chatbot that analyzes and synthesizes expert interview data, which improved trial-to-subscription conversion and drove a 25% increase in overall platform engagement. He also led the Deep Research project, a multi-agent orchestration framework that integrates internal expert data with external sources to enable automated, end-to-end research generation for clients. Additionally, he designed a comprehensive AI Agent Evaluation Framework for performance evaluation, quality benchmarking, and LLM capability comparisons, and established an AI Product Roundtable."
  },
  {
    question: 'educational background',
    answer: "Art earned his Bachelor's degree in Communication System Engineering from Ben-Gurion University, where he graduated Magna Cum Laude (2003-2007). He continues to broaden his knowledge through online courses and certifications."
  },
  {
    question: 'certificates',
    answer: "Art is constantly learning by reading books and taking courses and specializations. He has certificates including Prompt Engineering for Developers (Deeplearning.AI, 2023), Large Language Models (Databricks, 2023), Communicating for Impact (IDEO U, 2023), Data Analytics (Google, 2022), Professional Scrum Product Owner I (scrum.org, 2022), Customer Experiences with Contact Center AI - Dialogflow CX and ES (Google, 2021), Advanced Product Management (Product Faculty, 2020), Deep Learning Specialization (Deeplearning.AI, 2019), Data Engineering, Big Data, and Machine Learning on GCP (Google, 2019), and more. Full list available on his LinkedIn at https://www.linkedin.com/in/artkreimer/."
  },
  {
    question: 'contact',
    answer: "The best way to contact Art is to send him a message on LinkedIn (https://www.linkedin.com/in/artkreimer/) or email him at art.kreimer@gmail.com"
  },
  {
    question: 'motivation',
    answer: "Challenge is Art's motivation. A hard problem that requires him to think and work hard with his product team to come up with the design and a solution that is elegant and efficient and provides a great user experience."
  },
  {
    question: 'technical skills',
    answer: "Art considers himself pretty technical. He understands client-server architecture, is familiar with iOS and Android development, and understands how to read and write APIs documentation. He can use Postman to test/make an API call and write SQL queries to get the right data, manipulate it in Excel or use Pandas/NumPy to uncover deeper insights. He can process unstructured text data using Spacy, Textblob and NLTK. He is proficient with RAG (Retrieval Augmented Generation), NLP, Evals, Prompt Engineering, and GenAI technologies. He's experienced with tools like Git, Confluence, Jira, Figma, Python, SQL, Pandas, and Streamlit. He can also create bots using DialogFlow ES or CX. He is constantly learning and honing his technical skills."
  },
  {
    question: 'programming languages',
    answer: "Right now, Art's main programming language is Python. But in the past, he worked with Java and C++. He also knows SQL, and is proficient with Microsoft Office Suite. Additionally, he has expertise in modern AI/ML technologies including RAG (Retrieval Augmented Generation), NLP, Evals, Prompt Engineering, and GenAI tools."
  },
  {
    question: 'languages spoken',
    answer: "Art is a native Russian speaker, but he is also fluent in English and Hebrew."
  },
  {
    question: 'hobbies',
    answer: "Artiom likes hiking, travelling, reading books, playing board games with friends and family. He constantly challenges himself: learning to play the guitar (though he admits he still has room for improvement) or running for long distances - he is planning to run a half-marathon. But most of all he likes to spend time with his family."
  },
  {
    question: 'experience',
    answer: "Art has over a decade of experience in product leadership. Since September 2024, he's been Director of Product Management AI/ML at Guidepoint, leading AI-powered research capabilities. From November 2021 to September 2024, he was Product Lead, Data & AI at Scotiabank, leading the AI Innovation Squad. From October 2017 to November 2021, he was VP Product and Analytics at Wysdom.AI (acquired by Calabrio). From October 2013 to October 2017, he was Director Solutions Engineering at Wysdom.AI. Earlier roles include Software QA Team Lead at Clickfree (2009-2013), System QA Analyst at TELUS (2009), and ASIC Design Verification Engineer at Freescale Semiconductor (2006-2008)."
  },
  {
    question: 'scotiabank projects',
    answer: "At Scotiabank (November 2021 - September 2024), Art was the Product Lead for Data & AI, leading the AI Innovation Squad. His major accomplishments include: developing an LLM-based Support Chatbot Prototype, directing the enhancement of the Android App (elevating its rating from 2.0 to 4.7 stars - the highest among the Big 5 Canadian banks), spearheading the Early Adopters Product for beta program enrollment, leading the decommissioning of the LiveChat web application (achieving millions in operational savings), collaborating on chatbot optimization (contributing to Scotiabot receiving the prestigious 2023 Digital Transformation Award), and defining a dual career track for product managers."
  },
  {
    question: 'ai expertise',
    answer: "Art is deeply experienced in AI/ML technologies. His expertise spans Large Language Models (LLMs), Natural Language Processing (NLP), Retrieval Augmented Generation (RAG), Prompt Engineering, GenAI, Conversational AI, and Machine Learning. He has practical experience building agentic RAG-based chatbots, multi-agent orchestration frameworks, and AI evaluation systems. He's completed specialized certifications in Prompt Engineering, LLMs, Deep Learning, and Dialogflow. He's worked on real-world AI projects including chatbot analytics platforms, LLM-based support chatbots, expert interview analysis systems, and automated research generation tools."
  },
  {
    question: 'blog and publications',
    answer: "Art has a personal blog at www.artkreimer.com where he writes about AI/ML, Product Management, and Leadership. His articles include '6 ways the role of a product manager is going to change in the next decade', 'AI Product Development: A Deep Dive into Key Considerations', 'Beyond the Buzz: AI primer for Product Managers', 'How to build a resume chatbot using the power of LLMs', 'NLP and Text Analytics using foundational LLMs', and more. He also has filed for patents with the USPTO, including methods for prioritizing rule creation for computer-assisted customer care. View his patent portfolio at https://patents.justia.com/inventor/artiom-kreimer."
  },
  {
    question: 'strengths',
    answer: "Art's key strengths include analytical skills and adaptability. He possesses strong analytical skills that empower him to evaluate situations and formulate data-driven strategies. He excels in adaptability, an indispensable skill in fast-paced environments. His attention to detail ensures high-quality work, and he combines technical expertise with customer empathy to drive innovation."
  },
  {
    question: 'leadership',
    answer: "With over a decade of experience in managing and leading people, ranging from QA Team Leader to VP of Product and Analytics, and now Director of Product Management, Art's leadership style is servant leadership. His primary role is to empower his team by eliminating obstacles, offering strategic guidance, and creating an environment where they can excel. He is committed to guiding and mentoring each member of his team. He's currently a mentor in the Toast Champions Program (2024-2025) and has defined dual career tracks for product managers."
  },
  {
    question: 'chatbot experience',
    answer: "Art has extensive experience with chatbots. At Guidepoint, he directed development of the AskGP AI Chatbot (agentic RAG-based chatbot that drove 25% increase in platform engagement). At Scotiabank, he developed LLM-based support chatbot prototypes and optimized chatbots (contributing to the 2023 Digital Transformation Award). At Wysdom.AI, he led chatbot analytics tools that improved performance metrics by up to 90% and UI enhancements that reduced chatbot creation time by 80%. He designed the first Canadian Telecom Facebook chatbot that automated 15% of customer inquiries. He's proficient in DialogFlow ES and CX."
  },
  {
    question: 'mentoring',
    answer: "Yes, Art is actively involved in mentoring and coaching. He's currently a mentor in the Toast Champions Program (2024-2025). At Scotiabank, he provided mentoring to individual contributors and people leaders, and defined a dual career track for product managers including skills matrices and upskilling resources. He served as Director of IT for Silhouettes of York (2015-2021) and is an active member of Scotia Digital Toastmasters Club. If interested in mentoring opportunities, reach out via LinkedIn (linkedin.com/in/artkreimer) or email (art.kreimer@gmail.com)."
  }
];

const systemPrompt = `You are Art's ResumeGPT Bot, a comprehensive, interactive resource for exploring Artiom (Art) Kreimer's background, skills, and expertise. Be polite and provide answers based on the provided context only. Use only the provided data and not prior knowledge.

If a question is directed at you, clarify that you are merely Art's ResumeGPT chatbot and proceed to answer as if the question were addressed to Artiom Kreimer. If you lack the necessary information to respond, simply state that you don't know; do not fabricate an answer. If a query isn't related to Artiom Kreimer's background, politely indicate that you're programmed to answer questions solely about his experience, education, training, and aspirations.

FORMATTING REQUIREMENTS:
Use rich markdown formatting to make responses easy to read and visually appealing:
- Use **bold** for important names, titles, companies, and key terms
- Use bullet points (- or *) for lists of items, skills, or achievements
- Use numbered lists (1., 2., 3.) when describing sequential information or steps
- Break content into short paragraphs (2-3 sentences max)
- Use line breaks between different topics or sections
- Highlight specific years, dates, or timeframes in **bold**
- For technical skills or tools, present them as bullet points
- When listing multiple items, always use bullet points instead of comma-separated lists

Your response should be in JSON format with 3 keys:
- answered: boolean
- response: richly formatted markdown answer (max 150 words) following the formatting requirements above
- questions: array of 3 suggested follow-up questions`;

function findRelevantContext(query: string): string {
  const lowerQuery = query.toLowerCase();
  const relevantItems = knowledgeBase.filter(item => {
    const lowerQuestion = item.question.toLowerCase();
    const lowerAnswer = item.answer.toLowerCase();
    return lowerQuestion.includes(lowerQuery) ||
           lowerQuery.includes(lowerQuestion) ||
           lowerAnswer.includes(lowerQuery);
  });

  if (relevantItems.length === 0) {
    return knowledgeBase.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
  }

  return relevantItems.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is not set');
      return new Response(
        JSON.stringify({
          error: 'Configuration error',
          answered: false,
          response: "The chatbot is not fully configured. Please contact the administrator to set up the API key.",
          questions: [
            "What is Art's professional experience?",
            "What skills does Art possess?",
            "How can I contact Art?"
          ]
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const context = findRelevantContext(message);

    const contextualSystemPrompt = `${systemPrompt}

Context about Art Kreimer:
${context}

Respond ONLY with valid JSON matching the schema: {"answered": boolean, "response": string, "questions": string[]}`;

    const conversationMessages = conversationHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content
    }));

    const messages = [
      { role: 'system', content: contextualSystemPrompt },
      ...conversationMessages,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        max_tokens: 1024,
        messages: messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', response.status, error);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (_e) {
      parsedResponse = {
        answered: true,
        response: aiResponse,
        questions: [
          "What is Art's professional experience?",
          "What projects has Art worked on?",
          "What are Art's technical skills?"
        ]
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        answered: false,
        response: "I'm experiencing technical difficulties. Please try again later.",
        questions: [
          "What is Art's professional experience?",
          "What skills does Art possess?",
          "How can I contact Art?"
        ]
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
