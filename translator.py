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

        return jsonify({
            'original_text': text,
            'literal_translation': translation.text,
            'contextual_translation': translation.text  # Adjust as needed if contextual translation differs
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Ensure the port is correct


