from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)  # Allow CORS for all origins

translator = Translator()

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    target_lang = data.get('target_lang', 'en')  # Default to English if no target language provided

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        # Translate the text to the target language
        translation = translator.translate(text, dest=target_lang)
        
        # Construct the response with the requested format
        response = {
            (f"Original Text: {translation['original_text']}")
            (f"Literal Translation: {translation['literal_translation']}")
            (f"Contextual Translation: {translation['contextual_translation']}")   # Contextual translation is typically the same as literal for basic usage
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Ensure the port is correct and not in use
