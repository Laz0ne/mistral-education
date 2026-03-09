import { ChatMessage } from '../types';

const SYSTEM_PROMPT = `Tu es un assistant éducatif Mistral Education. Tu aides les élèves à comprendre leurs cours. Tu donnes des explications claires, pédagogiques et adaptées au niveau lycée/collège. Tu ne donnes jamais directement les réponses mais tu guides l'élève vers la compréhension. Réponds toujours en français.`;

const MOCK_RESPONSES = [
  "Bonne question ! Pour comprendre ce concept, partons d'un exemple concret. Réfléchis d'abord à ce que tu sais déjà sur ce sujet. Qu'est-ce qui te semble flou dans la définition ?",
  "Je vais t'aider à y voir plus clair ! Ce sujet peut sembler complexe au premier abord, mais en le décomposant étape par étape, tu vas comprendre. Quelle partie te pose le plus de difficultés ?",
  "Excellente réflexion ! Pour maîtriser ce concept, il est important de bien poser les bases. Voici comment je t'invite à aborder le problème : commence par identifier les données dont tu disposes, puis cherche ce qu'on te demande de trouver.",
  "C'est un sujet que beaucoup d'élèves trouvent difficile, mais avec la bonne méthode, ça devient accessible ! La clé est de **procéder méthodiquement**. Dis-moi, est-ce que tu as déjà essayé de l'aborder d'une certaine façon ?",
  "Très bonne question ! Pour t'expliquer cela, imagine une situation de la vie quotidienne : c'est comme quand tu dois... Cela te parle-t-il ? N'hésite pas à me demander plus de détails si tu veux qu'on approfondisse ensemble.",
  "Je vois que tu travailles sérieusement, c'est super ! Pour ce type de problème, voici une **méthode en 3 étapes** :\n1. Lis attentivement l'énoncé et identifie les données\n2. Cherche les formules ou règles applicables\n3. Applique-les en vérifiant chaque étape\n\nQuelle étape te semble la plus difficile ?",
  "Bonne initiative de poser la question ! La compréhension profonde d'un concept passe par la pratique. Je te conseille de faire des exercices progressifs : commence par les cas simples avant d'attaquer les cas complexes. Tu veux qu'on travaille ensemble sur un exemple ?",
];

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
    { role: 'system', content: SYSTEM_PROMPT },
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
    throw new Error(`Erreur API Mistral: ${errorMessage}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? "Je suis désolé, je n'ai pas pu générer une réponse. Réessaie dans quelques instants.";
}

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('fraction') || lower.includes('math') || lower.includes('calcul') || lower.includes('équation')) {
    return "Les mathématiques, c'est comme un puzzle ! Pour les fractions, rappelle-toi que le numérateur est **en haut** et le dénominateur **en bas**. Pour additionner des fractions, il faut d'abord les mettre au **même dénominateur**. Par exemple : 1/2 + 1/3 = 3/6 + 2/6 = 5/6. Est-ce que tu veux qu'on travaille sur un exemple précis ensemble ?";
  }

  if (lower.includes('révolution') || lower.includes('histoire') || lower.includes('guerre')) {
    return "L'histoire est fascinante ! Pour bien retenir les événements historiques, je te conseille de les **contextualiser** : qui ? quoi ? quand ? pourquoi ? Crée une frise chronologique dans ta tête. Quel aspect de ce sujet te pose problème ?";
  }

  if (lower.includes('verbe') || lower.includes('conjugaison') || lower.includes('grammaire') || lower.includes('français')) {
    return "La langue française est riche ! Pour la conjugaison, identifie d'abord le **groupe** du verbe (1er, 2ème ou 3ème groupe), puis applique les terminaisons correspondantes. La pratique régulière est la clé. Quel temps ou mode te pose problème ?";
  }

  if (lower.includes('physique') || lower.includes('chimie') || lower.includes('formule')) {
    return "En physique-chimie, la compréhension des **unités** est essentielle. Avant d'appliquer une formule, vérifie que toutes tes grandeurs sont dans les bonnes unités du SI. Ensuite, isole la variable cherchée. Sur quel concept travailles-tu ?";
  }

  if (lower.includes('anglais') || lower.includes('english') || lower.includes('vocabulary')) {
    return "Pour progresser en anglais, l'immersion est très efficace ! Écoute des podcasts, des séries en VO. Pour la grammaire, mémorise les **structures de phrases** plutôt que les règles abstraites. Qu'est-ce qui te pose le plus de difficultés ?";
  }

  const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[randomIndex] ?? MOCK_RESPONSES[0];
}
