# Extraction et Structuration de Documents PDF de Numérologie

## Prérequis

- Python 3.8+
- Bibliothèques Python :
  - `pdfplumber`
  - `openai`

## Installation des Dépendances

```bash
pip install pdfplumber openai
```

## Configuration

1. Définissez votre clé API OpenAI comme variable d'environnement :
   ```bash
   export OPENAI_API_KEY='votre_clé_api_openai'
   ```

2. Vérifiez les chemins dans le script :
   - `PDF_FOLDER_PATH`: Chemin vers le dossier contenant les PDF
   - `OUTPUT_JSON_PATH`: Chemin de sortie du fichier JSON

## Utilisation

```bash
python extraction_pdf.py
```

## Fonctionnalités

- Extraction de texte depuis des fichiers PDF
- Structuration automatique avec GPT-4
- Sauvegarde des résultats en JSON

## Personnalisation

Modifiez le script pour ajuster :
- Le modèle GPT
- Les instructions de structuration
- Les chemins de fichiers

## Dépannage

- Vérifiez que tous les PDF sont lisibles
- Assurez-vous d'avoir une connexion internet
- Surveillez les messages d'erreur dans la console
