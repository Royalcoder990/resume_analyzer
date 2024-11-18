from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from ner import extract_skills_from_pdf  # Import the refactored function

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the upload folder exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles PDF file upload and performs NER."""
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file:
        # Save the file to the uploads folder
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Perform NER on the uploaded file
        try:
            skills = extract_skills_from_pdf(file_path)
            return jsonify({"message": "File processed successfully!", "entities": skills}), 200
        except Exception as e:
            return jsonify({"message": f"Failed to process file: {str(e)}"}), 500

    return jsonify({"message": "Failed to upload file"}), 500

@app.route('/generate-qa', methods=['POST'])
def generate_qa():
    """Handles Q&A generation for a given skill."""
    data = request.get_json()
    if not data or 'skill' not in data:
        return jsonify({"message": "Skill not provided"}), 400

    skill = data['skill']
    try:
        # Call the RAG processing function
        from rag import process_topic
        result = process_topic(skill)
        print(type(result))
        return jsonify({"message": "Q&A generated successfully!", "qa": result}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to generate Q&A: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)