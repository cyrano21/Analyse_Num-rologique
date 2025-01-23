import { generatePersonalizedText } from './utils/huggingface.js';
import fs from 'fs';
import path from 'path';

async function generatePersonalizedSynthesis() {
  console.log('🌍 Variables d\'environnement:');
  console.log('HUGGINGFACE_API_TOKEN:', process.env.HUGGINGFACE_API_TOKEN ? 'Défini ✅' : 'Non défini ❌');

  const formData = {
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  try {
    // Prompt de génération de synthèse personnalisée
    const synthesisPrompt = `
    Génère une synthèse personnelle et approfondie pour ${formData.firstName} ${formData.lastName} 
    en explorant les dimensions suivantes :
    1. Parcours personnel et évolution intérieure
    2. Forces et potentiels cachés
    3. Défis et opportunités de croissance
    4. Conseils pour l'épanouissement personnel
    
    La synthèse doit être :
    - Bienveillante et encourageante
    - Profonde et perspicace
    - Personnalisée et unique
    - Structurée en paragraphes clairs
    - Longue d'environ 300-400 mots
    `;

    console.log('🌟 Génération de la synthèse personnalisée...');
    console.log('📝 Prompt de génération (longueur):', synthesisPrompt.length);
    console.log('📝 Prompt de génération (extrait):', synthesisPrompt.substring(0, 500));

    console.time('🕒 Durée de génération');
    const personalizedSynthesis = await generatePersonalizedText(synthesisPrompt, {
      temperature: 0.7,
      maxTokens: 500
    });
    console.timeEnd('🕒 Durée de génération');

    console.log('✨ Synthèse générée:');
    console.log(personalizedSynthesis);

    console.log('\n📊 Détails de la synthèse:');
    console.log('Longueur:', personalizedSynthesis.length, 'caractères');

    // Vérifier que la synthèse n'est pas vide
    if (!personalizedSynthesis || personalizedSynthesis.trim().length === 0) {
      throw new Error('La synthèse générée est vide');
    }

    // Écrire la synthèse dans un fichier
    const outputDir = path.join(process.cwd(), 'output');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, 'personalizedSynthesis.txt');
    
    console.log(`📁 Tentative d'écriture dans : ${outputFile}`);
    
    try {
      fs.writeFileSync(outputFile, personalizedSynthesis, 'utf-8');
      console.log(`✅ Synthèse enregistrée avec succès dans : ${outputFile}`);
    } catch (writeError) {
      console.error('❌ Erreur lors de l\'écriture du fichier:', writeError);
    }

    // Vérifier le contenu du fichier
    const fileContent = fs.readFileSync(outputFile, 'utf-8');
    console.log('📄 Contenu du fichier (longueur):', fileContent.length);
    console.log('📄 Contenu du fichier (extrait):', fileContent.substring(0, 500));

  } catch (error) {
    console.error('❌ Erreur détaillée lors de la génération de la synthèse:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
}

generatePersonalizedSynthesis();
