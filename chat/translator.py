from flask import Flask, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    text = data.get('text')
    target_lang = data.get('target_lang')
    translation_type = data.get('type', 'literal')

    if not text or not target_lang:
        return jsonify({'error': 'Missing text or target language'}), 400

    try:
        # Perform translation
        if translation_type == 'literal':
            translated = translator.translate(text, dest=target_lang)  # Basic translation
        elif translation_type == 'contextual':
            # Simulate a contextual translation by using an alternative translation engine or method
            translated = translator.translate(text, dest=target_lang)  # Here, using the same for simulation
        
        return jsonify({
            'original_text': text,
            'translated_text': translated.text,
            'source_lang': translated.src,
            'target_lang': target_lang
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
