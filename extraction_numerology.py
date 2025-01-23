import os
import json
import pdfplumber
import logging
import re
from typing import Dict, Any

# Configuration des logs
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s: %(message)s')

# Configuration
PDF_FOLDER_PATH = r'G:\Analyse_Num-rologique\NUMEROLOGIE\Numerology'
OUTPUT_JSON_PATH = r'G:\Analyse_Num-rologique\extracted_numerology_en.json'
OUTPUT_TEXTS_PATH = r'G:\Analyse_Num-rologique\extracted_texts_en'

# Créer le dossier de sortie pour les textes si nécessaire
os.makedirs(OUTPUT_TEXTS_PATH, exist_ok=True)

def nettoyer_texte(texte: str) -> str:
    """Nettoie et normalise le texte extrait."""
    # Supprimer les caractères de contrôle
    texte = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', texte)
    
    # Normaliser les sauts de ligne
    texte = re.sub(r'\n+', '\n', texte)
    
    # Supprimer les espaces en début et fin
    texte = texte.strip()
    
    return texte

def extraire_texte_pdf(pdf_path: str) -> str:
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

def extraire_titre_et_auteur(filename: str) -> tuple:
    """Extrait le titre et l'auteur du nom de fichier."""
    # Enlever l'extension .pdf
    filename_sans_ext = filename.replace('.pdf', '')
    
    # Séparer par des séparateurs courants
    parties = re.split(r'[,_-]', filename_sans_ext)
    
    titre = parties[0].strip() if parties else filename
    auteur = parties[1].strip() if len(parties) > 1 else "Auteur inconnu"
    
    return titre, auteur

def traiter_dossier_pdf() -> Dict[str, Any]:
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
            # Sauvegarder le texte brut dans un fichier séparé
            chemin_texte = os.path.join(OUTPUT_TEXTS_PATH, f"{titre}.txt")
            with open(chemin_texte, 'w', encoding='utf-8') as f:
                f.write(texte_extrait)
            
            resultats[filename] = {
                'titre': titre,
                'auteur': auteur,
                'chemin_texte_brut': chemin_texte,
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
