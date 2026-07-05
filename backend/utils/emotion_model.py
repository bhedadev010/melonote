import os
import sys
import json

from transformers import pipeline


def load_emotion_analyzer():
    model_name = os.getenv('HUGGINGFACE_MODEL', 'j-hartmann/emotion-english-distilroberta-base')
    return pipeline(
        'text-classification',
        model=model_name,
        top_k=None,
    )


def normalize_result(raw_result):
    if not raw_result:
        return []

    if isinstance(raw_result, list) and len(raw_result) > 0 and isinstance(raw_result[0], list):
        raw_result = raw_result[0]

    if not isinstance(raw_result, list):
        return []

    sorted_result = sorted(raw_result, key=lambda item: item.get('score', 0), reverse=True)
    return [
        {
            'label': str(item.get('label', '')).strip(),
            'score': float(item.get('score', 0.0)),
        }
        for item in sorted_result[:3]
        if item.get('label') is not None
    ]


def main():
    raw_text = None
    if len(sys.argv) > 1:
        raw_text = ' '.join(sys.argv[1:]).strip()
    else:
        raw_text = sys.stdin.read().strip()

    if not raw_text:
        print(json.dumps([]))
        return

    try:
        analyzer = load_emotion_analyzer()
        result = analyzer(raw_text)
        normalized = normalize_result(result)
        print(json.dumps(normalized))
    except Exception as error:
        print(json.dumps([]))
        sys.stderr.write(f'Emotion model failed: {error}\n')
        sys.exit(1)


if __name__ == '__main__':
    main()
