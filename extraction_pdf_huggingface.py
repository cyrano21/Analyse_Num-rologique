import os
import sys
import json
import logging
import pdfplumber
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline
from typing import Dict, Any

# Configuration des logs
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s: %(message)s',
                    handlers=[
                        logging.FileHandler('extraction_log.txt'),
                        logging.StreamHandler(sys.stdout)
                    ])

# Configuration
PDF_FOLDER_PATH = r'G:\Analyse_Num-rologique\NUMEROLOGIE'
OUTPUT_JSON_PATH = r'G:\Analyse_Num-rologique\extracted_numerology.json'

# Modèles Hugging Face
MODELS = {
    'question_answering': {
        'model': 'deepset/roberta-base-squad2',
        'tokenizer': 'deepset/roberta-base-squad2'
    },
    'text_generation': {
        'model': 'google/flan-t5-base',
        'tokenizer': 'google/flan-t5-base'
    }
}

def verifier_dependances():
    """Vérifie et log les dépendances installées."""
    dependances = ['pdfplumber', 'torch', 'transformers']
    for dep in dependances:
        try:
            __import__(dep)
            logging.info(f"Dépendance {dep} correctement installée")
        except ImportError:
            logging.warning(f"Dépendance {dep} manquante. Installez-la avec pip.")
            return False
    return True

def charger_modele_qa():
    """Charge un modèle de question-réponse."""
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODELS['question_answering']['tokenizer'])
        model = AutoModelForQuestionAnswering.from_pretrained(MODELS['question_answering']['model'])
        qa_pipeline = pipeline('question-answering', model=model, tokenizer=tokenizer)
        logging.info("Modèle de question-réponse chargé avec succès")
        return qa_pipeline
    except Exception as e:
        logging.error(f"Erreur lors du chargement du modèle de question-réponse: {e}")
        return None

def extraire_texte_pdf(pdf_path):
    """Extrait le texte complet d'un fichier PDF avec gestion d'erreurs."""
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

def poser_questions_structurees(texte, qa_pipeline):
    """Pose des questions structurées pour extraire des informations clés."""
    questions = [
        "Quel est le thème principal de ce document ?",
        "Quels sont les concepts numèrologiques principaux ?",
        "Y a-t-il des interprétations ou des prédictions spécifiques ?",
        "Quels sont les points clés à retenir ?",
        "Y a-t-il des recommandations ou des conseils ?",
    ]
    
    resultats = {}
    for question in questions:
        try:
            reponse = qa_pipeline(question=question, context=texte)
            resultats[question] = reponse['answer']
        except Exception as e:
            logging.error(f"Erreur pour la question '{question}': {e}")
    
    return resultats

def structurer_avec_generation(texte):
    """Utilise un modèle de génération de texte pour structurer les informations."""
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
        
        tokenizer = AutoTokenizer.from_pretrained(MODELS['text_generation']['tokenizer'])
        model = AutoModelForSeq2SeqLM.from_pretrained(MODELS['text_generation']['model'])
        
        prompt = f"Résume et structure les informations numèrologiques suivantes de manière concise et claire :\n\n{texte}"
        
        inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        outputs = model.generate(**inputs, max_length=1024, num_return_sequences=1)
        
        resume = tokenizer.decode(outputs[0], skip_special_tokens=True)
        logging.info("Résumé structuré généré avec succès")
        return resume
    except Exception as e:
        logging.error(f"Erreur lors de la génération de texte : {e}")
        return None

def traiter_dossier_pdf():
    """Traite tous les PDF du dossier."""
    resultats = {}
    
    try:
        fichiers_pdf = [f for f in os.listdir(PDF_FOLDER_PATH) if f.endswith('.pdf')]
        logging.info(f"{len(fichiers_pdf)} fichiers PDF trouvés")
        
        # Charger le modèle de question-réponse
        qa_pipeline = charger_modele_qa()
        if qa_pipeline is None:
            logging.error("Impossible de charger le modèle de question-réponse")
            return resultats
        
        for filename in fichiers_pdf:
            chemin_pdf = os.path.join(PDF_FOLDER_PATH, filename)
            logging.info(f"Traitement de {filename}...")
            
            # Extraction du texte
            texte_extrait = extraire_texte_pdf(chemin_pdf)
            
            if texte_extrait:
                # Extraction d'informations structurées
                informations_qa = poser_questions_structurees(texte_extrait, qa_pipeline)
                
                # Génération de résumé structuré
                resume_structure = structurer_avec_generation(texte_extrait)
                
                resultats[filename] = {
                    'extraction_qa': informations_qa,
                    'resume_structure': resume_structure,
                    'texte_brut': texte_extrait
                }
            else:
                logging.warning(f"Aucun texte extrait de {filename}")
    
    except Exception as e:
        logging.error(f"Erreur lors du traitement des PDF: {e}")
    
    return resultats

def main():
    # Vérification des dépendances
    if not verifier_dependances():
        logging.error("Dépendances manquantes. Impossible de continuer.")
        return
    
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
