import os
import json
import pdfplumber
import logging
import re

# Configuration des logs
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s: %(message)s')

# Configuration
PDF_FOLDER_PATH = r'G:\Analyse_Num-rologique\NUMEROLOGIE'
OUTPUT_JSON_PATH = r'G:\Analyse_Num-rologique\extracted_numerology.json'

def nettoyer_texte(texte):
    """Nettoie et normalise le texte extrait."""
    # Supprimer les caractères de contrôle
    texte = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', texte)
    
    # Normaliser les sauts de ligne
    texte = re.sub(r'\n+', '\n', texte)
    
    # Supprimer les espaces en début et fin
    texte = texte.strip()
    
    return texte

def extraire_texte_pdf(pdf_path):
    """Extrait le texte complet d'un fichier PDF."""
    texte_complet = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                texte_page = page.extract_text() or ""
                texte_complet += texte_page + "\n"
        
        # Nettoyer le texte
        texte_complet = nettoyer_texte(texte_complet)
        
        logging.info(f"Extraction réussie pour {pdf_path}")
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction de {pdf_path}: {e}")
    
    return texte_complet

def extraire_titre_et_auteur(filename):
    """Extrait le titre et l'auteur du nom de fichier."""
    # Enlever l'extension .pdf
    filename_sans_ext = filename.replace('.pdf', '')
    
    # Séparer par des séparateurs courants
    parties = re.split(r'[,_-]', filename_sans_ext)
    
    titre = parties[0].strip() if parties else filename
    auteur = parties[1].strip() if len(parties) > 1 else "Auteur inconnu"
    
    return titre, auteur

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
        
        # Extraction du titre et de l'auteur
        titre, auteur = extraire_titre_et_auteur(filename)
        
        if texte_extrait:
            resultats[filename] = {
                'titre': titre,
                'auteur': auteur,
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
