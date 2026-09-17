# Step 5: Merge, Quantize (GGUF) & Query from JavaScript

After the Python training completes in Step 4, merge the LoRA weights, quantize to GGUF, load it into **Ollama**, and query your custom trained model directly from **JavaScript / Node.js**.

---

## 🔀 1. Merge Weights & Convert to GGUF (Python helper script)

```python
# merge_and_export.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
adapter_path = "./my_custom_lora_adapters"
output_path = "./merged_model"

print("Merging LoRA adapters into base model...")
base_model = AutoModelForCausalLM.from_pretrained(base_model_id, torch_dtype=torch.float16, device_map="auto")
tokenizer = AutoTokenizer.from_pretrained(base_model_id)

peft_model = PeftModel.from_pretrained(base_model, adapter_path)
merged_model = peft_model.merge_and_unload()

merged_model.save_pretrained(output_path)
tokenizer.save_pretrained(output_path)
print("✅ Saved merged model!")
```

Convert to 4-bit GGUF:
```bash
# Using llama.cpp
python llama.cpp/convert_hf_to_gguf.py ./merged_model --outfile ./my_model_f16.gguf
./llama.cpp/llama-quantize ./my_model_f16.gguf ./my_custom_model_q4.gguf q4_k_m
```

---

## 🦙 2. Create Ollama Model

Create a `Modelfile`:
```dockerfile
FROM ./my_custom_model_q4.gguf
PARAMETER temperature 0.2
SYSTEM """You are a custom AI assistant fine-tuned on internal knowledge."""
```

Create & run inside Ollama:
```bash
ollama create my-trained-model -f ./Modelfile
```

---

## 💻 3. Query Your Trained Model from JavaScript / Node.js (`query.js`)

Now use pure JavaScript to stream responses from your locally trained model:

```javascript
// query-my-model.js
import ollama from 'ollama';

async function chatWithTrainedModel() {
  console.log('🤖 Sending prompt to my locally fine-tuned model...\n');

  const responseStream = await ollama.chat({
    model: 'my-trained-model',
    messages: [
      {
        role: 'user',
        content: 'How do I authenticate against our internal GraphQL API?'
      }
    ],
    stream: true,
  });

  for await (const chunk of responseStream) {
    process.stdout.write(chunk.message.content);
  }
  console.log('\n\n--- Generation Complete ---');
}

chatWithTrainedModel();
```

Run in terminal:
```bash
node query-my-model.js
```

---

[⬅️ Back: Step 4 - Train & Fine-Tune](../04-Train-FineTune-LLM/README.md) | [Back to Master Index 🏠](../README.md)
