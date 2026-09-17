# Phase 14: Python for JavaScript / TypeScript Developers

Once you have built real AI applications in JS/TS, Python is your gateway to **Model Training, Hugging Face, and Fine-Tuning**.

---

## 🔄 1. JavaScript vs Python Syntax Cheat Sheet

| JavaScript / TypeScript | Python |
| :--- | :--- |
| `const x = 10; let y = "hi";` | `x = 10; y = "hi"` |
| `const arr = [1, 2, 3];` | `arr = [1, 2, 3]` (List) |
| `const obj = { name: "Amar" };` | `obj = {"name": "Amar"}` (Dictionary) |
| `arr.map(x => x * 2)` | `[x * 2 for x in arr]` (List Comprehension) |
| `function add(a: number, b: number): number { return a + b; }` | `def add(a: int, b: int) -> int:`<br>&nbsp;&nbsp;&nbsp;&nbsp;`return a + b` |
| `async function fetchData() { const r = await fetch(url); }` | `async def fetch_data():`<br>&nbsp;&nbsp;&nbsp;&nbsp;`r = await aiohttp_client.get(url)` |
| `import { openai } from 'openai';` | `from openai import OpenAI` |
| `console.log(\`Hello \${name}\`)` | `print(f"Hello {name}")` |

---

## 📦 2. Virtual Environments & Package Management

Python uses virtual environments to isolate project dependencies (analogous to local `node_modules`):

```bash
# 1. Create a virtual environment named .venv
python -m venv .venv

# 2. Activate environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# 3. Install packages (like npm install)
pip install torch transformers datasets accelerate peft bitsandbytes

# 4. Save installed dependencies (like package.json)
pip freeze > requirements.txt

# 5. Install from requirements.txt
pip install -r requirements.txt
```

---

## 🔢 3. Essential Scientific Libraries: NumPy & PyTorch Tensors

```python
# scripts/intro_tensors.py
import numpy as np
import torch

# 1. NumPy Array (like standard JS Float32Array on steroids)
np_array = np.array([1.0, 2.0, 3.0, 4.0])
print("NumPy Mean:", np.mean(np_array))

# 2. PyTorch Tensor (multi-dimensional array that runs on GPUs)
tensor_a = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
tensor_b = torch.tensor([[5.0, 6.0], [7.0, 8.0]])

# Matrix Multiplication
result = torch.matmul(tensor_a, tensor_b)
print("Matrix Multiplication:\n", result)

# Check GPU availability (CUDA)
is_gpu = torch.cuda.is_available()
print(f"GPU Available (CUDA): {is_gpu}")
if is_gpu:
    gpu_tensor = tensor_a.to("cuda")
    print("Tensor moved to GPU successfully!")
```

---

[⬅️ Back: Phase 13 - Production AI](../13-Production-AI-Engineering/README.md) | [Next: Phase 15 - PyTorch & Fine-Tuning ➡️](../15-PyTorch-Transformers-FineTuning/README.md)
