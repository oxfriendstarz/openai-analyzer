import OpenAI from 'openai';

const openAIToken = "" // add you token here

export const clientOpenAi = new OpenAI({
  apiKey: openAIToken, 
});


export interface ChatMessage {
  user_id: string;
  message: string;
  timestamp: string;
}

export interface ChatBatch {
  messages: ChatMessage[];
}

export async function analyzeMessages(messages: ChatMessage[]): Promise<string> {
  const messageTexts = messages.map((msg) => msg.message).join('\n');
  try {
    const response = await clientOpenAi.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that summarizes and analyzes text for CEO insights.',
        },
        {
          role: 'user',
          content: (
            `Analyze the following messages:\n\n` +
            `${messageTexts}\n\n` +
            '1. Identify the top 3 frequently mentioned topics.\n' +
            '2. Provide a concise summary suitable for the CEO.\n' +
            '3. Perform sentiment analysis by categorizing messages into positive, neutral, or negative.\n' +
            'and the output is json'
          ),
        },
      ],
    });
    return (response.choices[0].message?.content || '').replace('\n', '')
  } catch (error: any) {
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}