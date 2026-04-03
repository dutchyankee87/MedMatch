import Anthropic from '@anthropic-ai/sdk';
import type { CvParsedData, RequestCriterion, CriterionResponse } from '@/lib/types/criteria';

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function parseCvText(cvText: string): Promise<{ parsed: CvParsedData; summary: string }> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Analyseer het volgende CV van een Nederlandse zorgmedewerker. Geef de analyse in het onderstaande JSON-formaat terug.

CV tekst:
---
${cvText}
---

Geef je antwoord als JSON met deze structuur (geen markdown, alleen pure JSON):
{
  "parsed": {
    "diplomas": [{"name": "naam diploma", "date": "jaar of datum", "institution": "naam instelling"}],
    "bigRegistration": {"number": "BIG nummer indien gevonden", "status": "actief/verlopen"},
    "workExperience": [{"role": "functie", "organization": "werkgever", "period": "periode", "department": "afdeling"}],
    "lastHospital": "meest recente ziekenhuis/zorginstelling",
    "specializations": ["specialisatie 1", "specialisatie 2"],
    "totalYearsExperience": 5
  },
  "summary": "Korte Nederlandse samenvatting van het profiel (2-3 zinnen)"
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const result = JSON.parse(text);
    return {
      parsed: result.parsed,
      summary: result.summary,
    };
  } catch {
    // If JSON parsing fails, return minimal data
    return {
      parsed: {
        diplomas: [],
        workExperience: [],
        specializations: [],
      },
      summary: 'CV kon niet automatisch worden geanalyseerd.',
    };
  }
}

export function calculateMatchScore(
  criteria: RequestCriterion[],
  responses: CriterionResponse[]
): number {
  if (criteria.length === 0) return 100;

  const required = criteria.filter((c) => c.required);
  const optional = criteria.filter((c) => !c.required);

  const responseMap = new Map(responses.map((r) => [r.criterionId, r]));

  const requiredMet = required.filter((c) => responseMap.get(c.id)?.met).length;
  const optionalMet = optional.filter((c) => responseMap.get(c.id)?.met).length;

  const requiredScore = required.length > 0 ? (requiredMet / required.length) * 70 : 70;
  const optionalScore = optional.length > 0 ? (optionalMet / optional.length) * 30 : 30;

  return Math.round(requiredScore + optionalScore);
}
