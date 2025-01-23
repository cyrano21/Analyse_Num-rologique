import { generatePersonalizedText } from './utils/huggingface.js';
import fs from 'fs/promises';
import path from 'path';

async function generatePersonalizedSynthesis() {
  const formData = {
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  const synthesisPrompt = `
Génère une synthèse personnelle et approfondie pour ${formData.firstName} ${formData.lastName}, 
en explorant les dimensions suivantes avec une approche bienveillante et perspicace :

1. Parcours personnel et évolution intérieure
- Quels sont les moments clés qui ont marqué son développement ?
- Comment ses expériences passées ont-elles façonné sa vision actuelle ?

2. Forces et potentiels cachés
- Quelles sont ses qualités intrinsèques les plus remarquables ?
- Quels talents ou capacités méritent d'être davantage développés ?

3. Défis et opportunités de croissance
- Quels sont les principaux obstacles à son épanouissement ?
- Comment peut-il transformer ses défis en opportunités de développement ?

4. Conseils pour l'épanouissement personnel
- Quelles pratiques ou réflexions pourraient l'aider à progresser ?
- Comment cultiver sa dimension spirituelle et personnelle ?

Critères pour la synthèse :
- Être profond et authentique
- Utiliser un langage encourageant et constructif
- Proposer des perspectives nouvelles
- Éviter les clichés et les généralités
- Faire entre 300 et 500 mots
- Structurer le texte en paragraphes clairs et fluides
`;

  try {
    process.stderr.write('🌟 Génération de la synthèse personnalisée...\n');
    process.stderr.write(`📝 Longueur du prompt: ${synthesisPrompt.length} caractères\n`);

    const personalizedSynthesis = await generatePersonalizedText(synthesisPrompt, {
      temperature: 0.7,
      maxTokens: 500,
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1'  // Modèle Mixtral
    });

    // Affichage manuel
    const separator = '='.repeat(80);
    process.stdout.write(`\n${separator}\n`);
    process.stdout.write(personalizedSynthesis);
    process.stdout.write(`\n${separator}\n`);

    process.stderr.write('\n📊 Détails de la synthèse:\n');
    process.stderr.write(`Longueur: ${personalizedSynthesis.length} caractères\n`);

    // Écrire la synthèse dans un fichier
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, 'personalizedSynthesis.txt');
    await fs.writeFile(outputFile, personalizedSynthesis, 'utf-8');
    
    process.stderr.write(`📁 Synthèse enregistrée dans : ${outputFile}\n`);

  } catch (error) {
    process.stderr.write(`❌ Erreur lors de la génération de la synthèse: ${error}\n`);
    process.exit(1);
  }
}

generatePersonalizedSynthesis();
