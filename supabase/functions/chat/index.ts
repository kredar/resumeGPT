import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const knowledgeBase = [
  {
    question: 'who is art?',
    answer: "Artiom Kreimer is a seasoned product leader with nearly two decades of experience, specializing in leading cross-functional teams to develop digital products. His expertise centers on Data Analytics, Machine Learning, Artificial Intelligence, and Conversational AI. He enjoys utilizing these technologies to address customer challenges. As the Product Lead at Scotiabank, he spearheads product strategy and development, collaborating closely with his team to launch innovative products. Prior to Scotiabank, he was instrumental in developing Conversational AI and Chatbot Analytics platforms at Wysdom.AI. Artiom holds a Bachelor's degree in Communication Systems Engineering and has worked across various industries, including ASIC, Consumer Electronics, Telecom, Web and Mobile Apps, and Finance. He resides in Ontario, Canada, with his wife, two daughters, and a Hungarian Vizsla. Artiom is passionate about spending his free time with his family, engaging in outdoor activities such as hiking, running, and nature exploration. He is an avid reader and a lifelong learner. Artiom actively shares his insights and tips on his personal blog, The Art of Product and AI. He welcomes connections to explore potential collaborations, exchange insights, or discuss industry trends. Artiom is always eager to connect with like-minded professionals and contribute to the dynamic fields of technology and product management."
  },
  {
    question: 'what is his educational background',
    answer: "Education: Art earned his Bachelor's degree in Communication System Engineering from Ben-Gurion University in 2007, graduating Magna cum laude. He continues to broaden his knowledge through online courses and certifications."
  },
  {
    question: 'certificates',
    answer: "Art is constantly learning by reading books and taking courses and specializations. He has certificates including: Advanced Product Management Certificate from the Product Faculty, Data Analytics from Google, Impactful Communications from IDEO U and a Deep Learning specialization certificate from Deeplearning.ai. Full list available on his LinkedIn."
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
    answer: "Art considers himself pretty technical. He understands client-server architecture, is familiar with iOS and Android development, understands how to read and write APIs documentation. He can use Postman to test/make an API call and he can write a SQL query to get the right data, manipulate it in Excel or use Pandas/NumPy. He can process unstructured text data using Spacy, Textblob and NLTK. He can also create bots using DialogFlow ES or CX. He is constantly learning and honing his technical skills."
  },
  {
    question: 'programming languages',
    answer: "Right now, Art's main programming language is Python. But in the past, he worked with Java and C++. He also knows SQL, and is proficient with Microsoft Office Suite."
  },
  {
    question: 'languages spoken',
    answer: "Art is a native Russian speaker, but he is also fluent in English and Hebrew."
  },
  {
    question: 'hobbies',
    answer: "Artiom likes hiking, travelling, reading books, playing board games with friends and family. He constantly challenges himself: learning to play the guitar or running for long distances. But most of all he likes to spend time with his family."
  },
  {
    question: 'experience',
    answer: "Since November 2021, Art has been serving as a Product Lead at Scotiabank. From 2017-2021 he was VP Product and Analytics at Wysdom.AI. Previously he held roles as Director Solutions Engineering at Wysdom.AI, Software QA team lead at Clickfree, System QA Analyst at TELUS, and ASIC Design Verification engineer at Freescale Semiconductor."
  },
  {
    question: 'strengths',
    answer: "Art's key strengths include analytical skills and adaptability. He possesses strong analytical skills that empower him to evaluate situations and formulate data-driven strategies. He excels in adaptability, an indispensable skill in fast-paced environments."
  },
  {
    question: 'leadership',
    answer: "With over a decade of experience in managing and leading people, Art's leadership style is servant leadership. His primary role is to empower his team by eliminating obstacles, offering strategic guidance, and creating an environment where they can excel."
  }
];

const systemPrompt = `You are Art's ResumeGPT Bot, a comprehensive, interactive resource for exploring Artiom (Art) Kreimer's background, skills, and expertise. Be polite and provide answers based on the provided context only. Use only the provided data and not prior knowledge.

If a question is directed at you, clarify that you are merely Art's ResumeGPT chatbot and proceed to answer as if the question were addressed to Artiom Kreimer. If you lack the necessary information to respond, simply state that you don't know; do not fabricate an answer. If a query isn't related to Artiom Kreimer's background, politely indicate that you're programmed to answer questions solely about his experience, education, training, and aspirations.

Your response should be in JSON format with 3 keys:
- answered: boolean
- response: markdown formatted answer (max 150 words)
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

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({
          error: 'Configuration error',
          answered: false,
          response: "The chatbot is not fully configured. Please contact the administrator to set up the OpenAI API key.",
          questions: [
            "What is Art's professional experience?",
            "What skills does Art possess?",
            "How can I contact Art?"
          ]
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, previousResponseId } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const context = findRelevantContext(message);

    const inputPrompt = `${systemPrompt}

Context about Art Kreimer:
${context}

User Question: ${message}

Please respond in JSON format with exactly 3 keys:
- answered: boolean
- response: markdown formatted answer (max 150 words)
- questions: array of 3 suggested follow-up questions`;

    const requestBody: any = {
      model: 'gpt-5.2',
      input: inputPrompt,
      reasoning: {
        effort: 'none'
      },
      text: {
        verbosity: 'medium'
      }
    };

    if (previousResponseId) {
      requestBody.previous_response_id = previousResponseId;
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);

      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded');
      }
      throw new Error(`Failed to get response from OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const responseId = data.id;

    const textContent = data.output.find((item: any) => item.type === 'text');
    const aiResponse = textContent ? textContent.content : '';

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      parsedResponse.responseId = responseId;
    } catch (e) {
      parsedResponse = {
        answered: false,
        response: "Hmm... Something is not right. I'm experiencing technical difficulties. Try asking your question again or ask another question about Art Kreimer's professional background and qualifications. Thank you for your understanding.",
        questions: [
          "What is Art's professional experience?",
          "What projects has Art worked on?",
          "What are Art's career goals?"
        ],
        responseId: responseId
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);

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