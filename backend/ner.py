import spacy
import PyPDF2

from rapidfuzz import fuzz, process

predefined_categories = [
    "Java", "Python", "Machine Learning", "Deep Learning", 
    "Natural Language Processing", "JavaScript", "React", 
    "SQL", "NoSQL", "Big Data", "Hadoop", "Spark", "TensorFlow",
    "Deep Learning","Machine Learning","C","C++","Object Oriented Programming",
]

from fuzzywuzzy import fuzz, process

def match_skills(extracted_skills, predefined_categories, threshold=80):
    """
    Match extracted skills (from dictionaries) to predefined categories using fuzzy matching 
    and return a list of matched skill names.
    
    Args:
        extracted_skills (list of dict): List of dictionaries with 'text' and 'label' keys.
        predefined_categories (list): List of predefined categories to match against.
        threshold (int): Minimum similarity score for a match (0-100).

    Returns:
        list: A list of best matches from predefined categories for the extracted skills' 'text' values.
    """
    print("Extracted Skills (raw):", extracted_skills)
    print("Predefined Categories:", predefined_categories)

    matched_skills = []

    for skill_dict in extracted_skills:
        # Extract the 'text' value from each dictionary
        skill_text = skill_dict.get('text', '')
        
        if not skill_text:  # Skip if 'text' is missing or empty
            print(f"Skipping invalid skill entry: {skill_dict}")
            matched_skills.append(None)
            continue

        print(f"Processing skill: {skill_text}")
        
        # Find the best match from predefined categories
        try:
            best_match, score = process.extractOne(skill_text, predefined_categories, scorer=fuzz.token_sort_ratio)
            print(f"Best Match: {best_match}, Score: {score}")
        except Exception as e:
            print(f"Error during matching: {e}")
            matched_skills.append(None)
            continue

        if score >= threshold:  # Only accept matches above the threshold
            matched_skills.append(best_match)  # Add the match to the list
        else:
            matched_skills.append(None)  # Add None if no suitable match found
    
    print("Matched Skills:", matched_skills)
    return matched_skills

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
    matched_skills = match_skills(skills, predefined_categories)
    # Assuming matched_skills has been populated
    matched_skills = list(set([skill for skill in matched_skills if skill is not None]))

# Now matched_skills will only have unique values with no None values
    print(matched_skills)
    return matched_skills