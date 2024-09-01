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

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        # Translate the text to English
        translation = translator.translate(text, dest='en')

        return jsonify({
            'original_text': text,
            'translated_text': translation.text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 



