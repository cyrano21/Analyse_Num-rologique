import os
import json
import pdfplumber
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s: %(message)s')

# Configuration
PDF_FOLDER_PATH = r'G:\Analyse_Num-rologique\NUMEROLOGIE'
OUTPUT_JSON_PATH = r'G:\Analyse_Num-rologique\extracted_numerology.json'

def extraire_texte_pdf(pdf_path):
    """Extrait le texte complet d'un fichier PDF."""
    texte_complet = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                texte_page = page.extract_text() or ""
                texte_complet += texte_page + "\n"
        logging.info(f"Extraction réussie pour {pdf_path}")
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction de {pdf_path}: {e}")
    return texte_complet.strip()

def traiter_dossier_pdf():
    """Traite tous les PDF du dossier."""
    resultats = {}
    
    fichiers_pdf = [f for f in os.listdir(PDF_FOLDER_PATH) if f.endswith('.pdf')]
    logging.info(f"{len(fichiers_pdf)} fichiers PDF trouvés")
    
    for filename in fichiers_pdf:
        chemin_pdf = os.path.join(PDF_FOLDER_PATH, filename)
        logging.info(f"Traitement de {filename}...")
        
        # Extraction du texte
        texte_extrait = extraire_texte_pdf(chemin_pdf)
        
        if texte_extrait:
            resultats[filename] = {
                'texte_brut': texte_extrait,
                'longueur_texte': len(texte_extrait)
            }
        else:
            logging.warning(f"Aucun texte extrait de {filename}")
    
    return resultats

def main():
    # Traitement des PDF
    resultats_extraction = traiter_dossier_pdf()
    
    # Sauvegarde des résultats
    try:
        with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(resultats_extraction, f, ensure_ascii=False, indent=4)
        logging.info(f"Extraction terminée. Résultats sauvegardés dans {OUTPUT_JSON_PATH}")
    except Exception as e:
        logging.error(f"Erreur lors de la sauvegarde des résultats: {e}")

if __name__ == "__main__":
    main()
