import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

async function generatePersonalizedSynthesis() {
  const formData = {
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  const synthesisPrompt = `
Génère une synthèse personnelle courte pour ${formData.firstName} ${formData.lastName}. 
Décris son potentiel de développement personnel en 100 mots.
Utilise un langage encourageant et constructif.
Réponds en français.
`;

  try {
    console.log('🌟 Génération de la synthèse personnalisée...');

    // Générer la synthèse via l'API Mistral
    console.log('📝 Envoi de la requête à Mistral...');
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions', 
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: synthesisPrompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer qGkFeYH2Zni30riZbSptHqjrxVgdPjLC`
        }
      }
    );
    console.log('✅ Réponse reçue');

    // Log détaillé de la réponse
    console.log('Réponse complète:', JSON.stringify(response.data, null, 2));

    // Vérifier la réponse
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      throw new Error('Aucune réponse valide reçue de Mistral');
    }

    const personalizedSynthesis = response.data.choices[0].message.content;

    console.log('Contenu de la synthèse:', personalizedSynthesis);

    if (!personalizedSynthesis) {
      throw new Error('Le texte généré est vide');
    }

    // Affichage du texte avec console.log
    console.log('\n✨ Synthèse générée:');
    console.log('='.repeat(80));
    console.log(personalizedSynthesis);
    console.log('='.repeat(80));

    // Écrire la synthèse dans un fichier avec encodage UTF-8
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, 'personalizedSynthesis.txt');
    
    // Utiliser Buffer pour garantir l'encodage UTF-8
    const buffer = Buffer.from(personalizedSynthesis, 'utf-8');
    await fs.writeFile(outputFile, buffer, { encoding: 'utf-8' });
    
    console.log(`📁 Synthèse enregistrée dans : ${outputFile}`);

  } catch (error) {
    console.error('❌ Erreur détaillée:');
    console.error('Type d\'erreur:', error.constructor.name);
    console.error('Message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Log de la réponse complète en cas d'erreur
    if (error.response) {
      console.error('Réponse détaillée:', error.response.data);
    }
  }
}

generatePersonalizedSynthesis();
