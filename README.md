# dhlab-visual-resolution-syntactic-ambiguity
Semester Project Autumn 2024-2025 - A Visual Resolution for Syntactic Ambiguity

## Project Structure
```
main/
├── interface-prototype/     # Frontend code for visual resolution
├── parsing-model/          # Parsing model code
├── LICENSE                  
└── README.md               # Project documentation
```

## How to Run

### Frontend Application
#### Running Full Stack (Frontend + Backend)
```bash
# Run everything with Docker from project root
docker compose up
```

#### Running Frontend Only
```bash
# Prerequisites: Install yarn if not present
brew install yarn

# Verify yarn installation
yarn --version

# Start frontend development server
cd frontend/app
yarn install
yarn run dev
```
Frontend will be accessible at: http://localhost:3000

### Parsing Model
The model checkpoints can be downloaded from [Google Drive](https://drive.google.com/drive/folders/1-wINl7lLtlT0WEX88NPwyBHZOr4yKnCK):
- SAPar.PTB.BERT.95.85.pt
- SAPar.PTB.BERT.POS.95.86.pt

```bash
# Mount local directory and run container
docker run -it -v /path/to/your/local/SAPar:/app sapar bash

# Execute prediction script
python prediction.py
```
Prediction results will be saved to `output/` directory as JSON files.

## Data Sources
- **Ambiguous Data**: `dataset/AmbiEnt_ambiguity_category/category_syntactic.json`
- **Non-ambiguous Data**: `dataset/MNLI_sampled_data.csv`

## Results Directory Structure
```
├── prompt_based_result/    # Results from prompt-based experiments
└── parse_result/           # Parsing results and disambiguation analysis
```
