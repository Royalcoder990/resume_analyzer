import spacy
import PyPDF2

# Load the trained model
model_path = "/Users/rishabhralli/Documents/JIIT/Major1/implementation/ltrain_store"
nlp = spacy.load(model_path)

def extract_skills_from_pdf(pdf_path):
    """Extracts skills/entities from a PDF using a trained NER model."""
    # Extract text from PDF
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

    # Process the text with the NER model
    doc = nlp(text)
    skills = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]

    return skills
