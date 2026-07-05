import os
import sys
import json

from sentence_transformers import SentenceTransformer


def load_embedding_model():
    model_name = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
    return SentenceTransformer(model_name)


def main():
    raw_text = sys.stdin.read().strip()
    if not raw_text:
        print(json.dumps([]))
        return

    try:
        model = load_embedding_model()
        embedding = model.encode(raw_text, convert_to_numpy=True, normalize_embeddings=False)
        print(json.dumps(embedding.tolist()))
    except Exception as error:
        print(json.dumps([]))
        sys.stderr.write(f'Embedding model failed: {error}\n')
        sys.exit(1)


if __name__ == '__main__':
    main()
