import { Profile, AffinityResult, CategoryAffinity, ProfileMode } from './types';

// Etiquetas legibles para UI
export const INTENT_LABELS: Record<string, string> = {
  amistad: 'Hacer nuevos amigos',
  citas: 'Citas y relaciones',
  conocer_gente: 'Socializar y conocer personas',
  actividades: 'Compartir panoramas y actividades',
  empleo: 'Buscar nuevas oportunidades de empleo',
  clientes: 'Conseguir clientes o proyectos',
  socios: 'Encontrar co-fundadores o socios',
  inversion: 'Levantamiento de capital / Inversionistas',
  colaboradores: 'Colaboración en proyectos técnicos',
};

export function calculateAffinity(
  profileA: Profile,
  profileB: Profile,
  mode: ProfileMode
): AffinityResult {
  const categories: CategoryAffinity[] = [];
  const complementarityNotes: string[] = [];

  if (mode === 'personal') {
    // 1. Intereses personales (Música, hobbies, actividades)
    const interestsA = getAnswerValues(profileA, 'intereses', 'hobbies');
    const interestsB = getAnswerValues(profileB, 'intereses', 'hobbies');

    const commonInterests = interestsA.filter((i) => interestsB.includes(i));
    const allInterests = Array.from(new Set([...interestsA, ...interestsB]));

    let interestScore: number | null = null;
    let interestCoverage = 0;
    let interestStatus: 'optimal' | 'sufficient' | 'insufficient' = 'insufficient';
    let interestExplanation = 'Información insuficiente para comparar intereses.';

    if (allInterests.length > 0) {
      interestCoverage = Math.min(100, Math.round(((interestsA.length + interestsB.length) / 8) * 100));
      if (allInterests.length >= 2) {
        const jaccard = commonInterests.length / allInterests.length;
        interestScore = Math.round(jaccard * 100);
        interestStatus = interestCoverage >= 60 ? 'optimal' : 'sufficient';
        interestExplanation =
          commonInterests.length > 0
            ? `Comparten ${commonInterests.length} afinidades: ${commonInterests.slice(0, 3).join(', ')}.`
            : 'Tienen intereses diversos y complementarios sin coincidencia directa.';
      }
    }

    categories.push({
      category: 'intereses',
      title: 'Intereses y Panoramas',
      score: interestScore,
      coverage: interestCoverage,
      status: interestStatus,
      explanation: interestExplanation,
      highlights: commonInterests,
    });

    // 2. Intención declarada
    const intentA = profileA.intent;
    const intentB = profileB.intent;
    let intentScore = 40;
    let intentExplanation = `Intenciones distintas: uno busca "${INTENT_LABELS[intentA] || intentA}" y otro "${INTENT_LABELS[intentB] || intentB}".`;

    if (intentA === intentB) {
      intentScore = 100;
      intentExplanation = `Ambos buscan exactamente lo mismo: ${INTENT_LABELS[intentA] || intentA}.`;
    } else if (
      (intentA === 'conocer_gente' && (intentB === 'amistad' || intentB === 'citas')) ||
      (intentB === 'conocer_gente' && (intentA === 'amistad' || intentA === 'citas'))
    ) {
      intentScore = 80;
      intentExplanation = 'Altamente compatibles en apertura social y conocer nuevas personas.';
    } else if (
      (intentA === 'amistad' && intentB === 'actividades') ||
      (intentB === 'amistad' && intentA === 'actividades')
    ) {
      intentScore = 85;
      intentExplanation = 'Intereses alineados en compartir tiempo y actividades comunes.';
    }

    categories.push({
      category: 'intencion',
      title: 'Intención del Encuentro',
      score: intentScore,
      coverage: 100,
      status: 'optimal',
      explanation: intentExplanation,
      highlights: intentA === intentB ? [INTENT_LABELS[intentA]] : [],
    });

    // 3. Estilo de vida y hábitos
    const lifestyleA = getAnswerValues(profileA, 'estilo_vida', 'habitos');
    const lifestyleB = getAnswerValues(profileB, 'estilo_vida', 'habitos');
    const commonLife = lifestyleA.filter((l) => lifestyleB.includes(l));
    const allLife = Array.from(new Set([...lifestyleA, ...lifestyleB]));

    let lifeScore: number | null = null;
    let lifeCoverage = 0;
    let lifeStatus: 'optimal' | 'sufficient' | 'insufficient' = 'insufficient';
    let lifeExplanation = 'Información insuficiente sobre estilo de vida.';

    if (allLife.length > 0) {
      lifeCoverage = Math.min(100, Math.round(((lifestyleA.length + lifestyleB.length) / 6) * 100));
      if (allLife.length >= 2) {
        lifeScore = Math.round((commonLife.length / allLife.length) * 100);
        lifeStatus = lifeCoverage >= 50 ? 'optimal' : 'sufficient';
        lifeExplanation =
          commonLife.length > 0
            ? `Hábitos compartidos: ${commonLife.join(', ')}.`
            : 'Ritmos y hábitos de salida variados.';
      }
    }

    categories.push({
      category: 'estilo_vida',
      title: 'Estilo de Vida y Ritmo',
      score: lifeScore,
      coverage: lifeCoverage,
      status: lifeStatus,
      explanation: lifeExplanation,
      highlights: commonLife,
    });
  } else {
    // MODO PROFESIONAL

    // 1. Complementariedad: Qué busca A vs Qué ofrece B
    const offersA = getAnswerValues(profileA, 'ofrece_busca', 'ofrezco');
    const seeksA = getAnswerValues(profileA, 'ofrece_busca', 'busco');

    const offersB = getAnswerValues(profileB, 'ofrece_busca', 'ofrezco');
    const seeksB = getAnswerValues(profileB, 'ofrece_busca', 'busco');

    const aCanHelpB = offersA.filter((skill) => seeksB.includes(skill));
    const bCanHelpA = offersB.filter((skill) => seeksA.includes(skill));

    let compScore: number | null = null;
    let compCoverage = 0;
    let compStatus: 'optimal' | 'sufficient' | 'insufficient' = 'insufficient';
    let compExplanation = 'Información insuficiente sobre necesidades y ofertas profesionales.';

    if (offersA.length + seeksA.length > 0 && offersB.length + seeksB.length > 0) {
      compCoverage = 100;
      const totalOpportunities = aCanHelpB.length + bCanHelpA.length;
      if (totalOpportunities >= 2) {
        compScore = 95;
        compStatus = 'optimal';
        compExplanation = 'Sinergia bidireccional alta: ambos tienen habilidades que el otro necesita.';
      } else if (totalOpportunities === 1) {
        compScore = 80;
        compStatus = 'sufficient';
        compExplanation = 'Oportunidad de colaboración directa en proyectos específicos.';
      } else {
        compScore = 50;
        compStatus = 'sufficient';
        compExplanation = 'No hay cruce inmediato de oferta y demanda, pero sí de red de contactos.';
      }

      if (bCanHelpA.length > 0) {
        complementarityNotes.push(`Puede ayudarte con: ${bCanHelpA.join(', ')}`);
      }
      if (aCanHelpB.length > 0) {
        complementarityNotes.push(`Puedes ayudarle con: ${aCanHelpB.join(', ')}`);
      }
    }

    categories.push({
      category: 'complementariedad',
      title: 'Complementariedad de Negocios',
      score: compScore,
      coverage: compCoverage,
      status: compStatus,
      explanation: compExplanation,
      highlights: [...bCanHelpA, ...aCanHelpB],
    });

    // 2. Habilidades y Sector
    const skillsA = getAnswerValues(profileA, 'habilidades', 'tecnologias');
    const skillsB = getAnswerValues(profileB, 'habilidades', 'tecnologias');
    const commonSkills = skillsA.filter((s) => skillsB.includes(s));

    let skillScore: number | null = null;
    let skillCoverage = Math.min(100, Math.round(((skillsA.length + skillsB.length) / 6) * 100));

    if (skillsA.length > 0 && skillsB.length > 0) {
      skillScore = commonSkills.length > 0 ? Math.min(100, commonSkills.length * 30 + 40) : 40;
    }

    categories.push({
      category: 'habilidades',
      title: 'Afinidad de Industria y Habilidades',
      score: skillScore,
      coverage: skillCoverage,
      status: skillCoverage >= 50 ? 'optimal' : 'insufficient',
      explanation:
        commonSkills.length > 0
          ? `Coinciden en el ecosistema técnico: ${commonSkills.join(', ')}.`
          : 'Sectores profesionales diferentes (ideal para sinergias multidisciplinarias).',
      highlights: commonSkills,
    });

    // 3. Intención profesional
    const intentA = profileA.intent;
    const intentB = profileB.intent;
    let intentScore = 50;
    let intentExplanation = `Intercambio profesional: uno busca "${INTENT_LABELS[intentA] || intentA}" y otro "${INTENT_LABELS[intentB] || intentB}".`;

    if (intentA === intentB) {
      intentScore = 90;
      intentExplanation = `Ambos enfocados en el mismo objetivo: ${INTENT_LABELS[intentA] || intentA}.`;
    } else if (
      (intentA === 'empleo' && intentB === 'socios') ||
      (intentB === 'empleo' && intentA === 'socios') ||
      (intentA === 'inversion' && intentB === 'socios') ||
      (intentB === 'inversion' && intentA === 'socios')
    ) {
      intentScore = 100;
      intentExplanation = 'Alineación perfecta entre creadores de proyectos y talento o capital.';
    }

    categories.push({
      category: 'intencion',
      title: 'Objetivo Profesional',
      score: intentScore,
      coverage: 100,
      status: 'optimal',
      explanation: intentExplanation,
      highlights: [],
    });
  }

  // Puntuación global y cobertura global ponderada
  const validCategories = categories.filter((c) => c.score !== null);
  const totalCoverage = Math.round(
    categories.reduce((acc, c) => acc + c.coverage, 0) / categories.length
  );

  const overallScore =
    validCategories.length > 0
      ? Math.round(validCategories.reduce((acc, c) => acc + (c.score || 0), 0) / validCategories.length)
      : null;

  return {
    overallScore,
    overallCoverage: totalCoverage,
    dealbreakerConflict: false,
    categories,
    complementarityNotes,
  };
}

function getAnswerValues(profile: Profile, category: string, key: string): string[] {
  const answer = profile.answers.find((a) => a.category === category && a.key === key);
  return answer && answer.isComparableConsent ? answer.values : [];
}
