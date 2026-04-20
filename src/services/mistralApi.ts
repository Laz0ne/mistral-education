import { ChatMessage } from '../types';
import i18n from '../i18n';

function getSystemPrompt(): string {
  if (i18n.resolvedLanguage === 'en') {
    return 'You are a Mistral Education tutoring assistant. You help students understand their lessons. You provide clear, educational explanations adapted to middle/high school level. You never give direct answers; instead, you guide the student to understanding. Always answer in English.';
  }

  return "Tu es un assistant éducatif Mistral Education. Tu aides les élèves à comprendre leurs cours. Tu donnes des explications claires, pédagogiques et adaptées au niveau lycée/collège. Tu ne donnes jamais directement les réponses mais tu guides l'élève vers la compréhension. Réponds toujours en français.";
}

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    return getMockResponse(lastUserMessage?.content ?? '');
  }

  const apiMessages = [
    { role: 'system', content: getSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = (errorData as { message?: string }).message ?? response.statusText;
    throw new Error(i18n.t('mistral.apiError', { message: errorMessage }));
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? i18n.t('mistral.fallback');
}

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('fraction') || lower.includes('math') || lower.includes('calcul') || lower.includes('équation')) {
    return i18n.t('mistral.topic.math');
  }

  if (lower.includes('révolution') || lower.includes('histoire') || lower.includes('guerre')) {
    return i18n.t('mistral.topic.history');
  }

  if (lower.includes('verbe') || lower.includes('conjugaison') || lower.includes('grammaire') || lower.includes('français')) {
    return i18n.t('mistral.topic.french');
  }

  if (lower.includes('physique') || lower.includes('chimie') || lower.includes('formule')) {
    return i18n.t('mistral.topic.physics');
  }

  if (lower.includes('anglais') || lower.includes('english') || lower.includes('vocabulary')) {
    return i18n.t('mistral.topic.english');
  }

  const responses = i18n.t('mistral.mockResponses', { returnObjects: true }) as string[];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex] ?? responses[0] ?? i18n.t('mistral.fallback');
}
