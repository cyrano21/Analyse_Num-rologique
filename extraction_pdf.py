import os
import json
import pdfplumber
from openai import OpenAI

# Configuration
PDF_FOLDER_PATH = r'G:\Analyse_Num-rologique\NUMEROLOGIE'
OUTPUT_JSON_PATH = r'G:\Analyse_Num-rologique\extracted_numerology.json'
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')  # Assurez-vous de définir cette variable d'environnement

# Initialisation du client OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

def extraire_texte_pdf(pdf_path):
    """Extrait le texte complet d'un fichier PDF."""
    texte_complet = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                texte_page = page.extract_text() or ""
                texte_complet += texte_page + "\n"
    except Exception as e:
        print(f"Erreur lors de l'extraction de {pdf_path}: {e}")
    return texte_complet.strip()

def structurer_avec_gpt(texte):
    """Utilise GPT pour structurer les informations extraites."""
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "Tu es un expert en numérologie et analyse de documents. Extrait et structure les informations clés de manière précise et professionnelle."},
                {"role": "user", "content": f"Analyse et structure les informations suivantes en JSON, en extrayant les concepts numérologiques principaux :\n\n{texte}"}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Erreur lors de la structuration avec GPT : {e}")
        return None

def traiter_dossier_pdf():
    """Traite tous les PDF du dossier."""
    resultats = {}
    
    for filename in os.listdir(PDF_FOLDER_PATH):
        if filename.endswith('.pdf'):
            chemin_pdf = os.path.join(PDF_FOLDER_PATH, filename)
            print(f"Traitement de {filename}...")
            
            # Extraction du texte
            texte_extrait = extraire_texte_pdf(chemin_pdf)
            
            # Structuration avec GPT
            resultat_structure = structurer_avec_gpt(texte_extrait)
            
            if resultat_structure:
                try:
                    # Tente de parser le JSON
                    donnees_json = json.loads(resultat_structure)
                    resultats[filename] = donnees_json
                except json.JSONDecodeError:
                    # Si le parsing échoue, sauvegarde le texte brut
                    resultats[filename] = {"texte_brut": resultat_structure}
    
    return resultats

def main():
    # Traitement des PDF
    resultats_extraction = traiter_dossier_pdf()
    
    # Sauvegarde des résultats
    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(resultats_extraction, f, ensure_ascii=False, indent=4)
    
    print(f"Extraction terminée. Résultats sauvegardés dans {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
