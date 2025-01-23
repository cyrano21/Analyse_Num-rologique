# Extraction et Structuration de Documents PDF de Numérologie avec Hugging Face

## Prérequis

- Python 3.8+
- Bibliothèques Python :
  - `pdfplumber`
  - `torch`
  - `transformers`

## Installation des Dépendances

```bash
pip install pdfplumber torch transformers
```

## Modèles Utilisés

- Question-Réponse : `deepset/roberta-base-squad2`
- Génération de Texte : `google/flan-t5-base`

## Fonctionnalités

- Extraction de texte depuis des fichiers PDF
- Analyse par question-réponse
- Génération de résumé structuré
- Sauvegarde des résultats en JSON

### Processus d'Extraction

1. Extraction du texte brut des PDF
2. Analyse par modèle de question-réponse
3. Génération d'un résumé structuré
4. Sauvegarde des résultats multidimensionnels

## Utilisation

```bash
python extraction_pdf_huggingface.py
```

## Configuration

Modifiez les constantes dans le script :
- `PDF_FOLDER_PATH`: Chemin du dossier PDF
- `OUTPUT_JSON_PATH`: Chemin de sortie JSON

## Personnalisation

- Ajoutez/modifiez des questions structurées
- Changez les modèles Hugging Face
- Adaptez les méthodes d'extraction

## Dépannage

- Assurez-vous d'avoir une connexion internet pour télécharger les modèles
- Vérifiez la compatibilité des versions de bibliothèques
- Surveillez les messages d'erreur dans la console

## Exemple de Sortie JSON

```json
{
  "fichier1.pdf": {
    "extraction_qa": {
      "Thème principal": "...",
      "Concepts numèrologiques": "..."
    },
    "resume_structure": "Résumé généré...",
    "texte_brut": "Contenu complet du PDF..."
  }
}
```
