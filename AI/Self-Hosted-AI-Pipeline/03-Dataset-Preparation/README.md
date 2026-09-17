# Step 3: Preparing Datasets with JavaScript / Node.js

Write Node.js scripts to convert raw company data, markdown files, database collections, and FAQs into clean **`dataset_train.jsonl`** files ready for Python fine-tuning.

---

## 📄 1. The Standard JSONL Instruction Format

Every line in the `.jsonl` file must be a single valid JSON object containing instruction/response messages:

```json
{"messages": [{"role": "system", "content": "You are a code assistant."}, {"role": "user", "content": "Write a debounce function in JS"}, {"role": "assistant", "content": "function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }"}]}
```

---

## 💻 2. Node.js Dataset Preparation Script (`prepare-dataset.js`)

```javascript
// prepare-dataset.js
import fs from 'fs';
import path from 'path';

// Raw data (can come from MongoDB, JSON files, or Markdown documents)
const rawData = [
  {
    topic: 'auth',
    question: 'How do I authenticate against our internal GraphQL API?',
    answer: 'Pass the Bearer token in the `Authorization` header: `Authorization: Bearer <JWT_TOKEN>`.'
  },
  {
    topic: 'database',
    question: 'Where are MongoDB connection strings configured?',
    answer: 'Set the `MONGODB_URI` environment variable in your root `.env.production` file.'
  },
  {
    topic: 'deploy',
    question: 'How do we trigger a staging deployment?',
    answer: 'Create a PR targeting the `staging` branch. GitHub Actions will deploy automatically upon merge.'
  }
];

// Output file path
const outputPath = path.resolve('dataset_train.jsonl');
const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf-8' });

let count = 0;
for (const item of rawData) {
  const record = {
    messages: [
      {
        role: 'system',
        content: 'You are an expert internal technical assistant.'
      },
      {
        role: 'user',
        content: item.question
      },
      {
        role: 'assistant',
        content: item.answer
      }
    ]
  };

  // Write single JSON object per line
  writeStream.write(JSON.stringify(record) + '\n');
  count++;
}

writeStream.end(() => {
  console.log(`✅ Successfully generated ${count} training samples into: ${outputPath}`);
});
```

Run in terminal:
```bash
node prepare-dataset.js
```

---

[⬅️ Back: Step 2 - Local RAG in JS](../02-Local-Vector-DB-and-RAG/README.md) | [Next: Step 4 - Fine-Tune in Python ➡️](../04-Train-FineTune-LLM/README.md)
