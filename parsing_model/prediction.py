import os
import time
import SAPar_model
from SAPar_main import torch_load
import nltk
from nltk import Tree
from nltk.tokenize import word_tokenize
import os
from nltk.tag import StanfordPOSTagger

import pyximport
import numpy as np
pyximport.install(setup_args={"include_dirs": np.get_include()}, language_level=3)
import json

import chart_helper
print("chart_helper module path:", chart_helper.__file__)


def main():
    scores_file = 'output/scores.json'
    # model_path_base = '/Users/liuyiwei/sp/SAPar/models/SAPar.PTB.BERT.POS.95.86.pt'
    model_path_base = '/app/models/SAPar.PTB.BERT.POS.95.86.pt'
    output_path = '-'
    eval_batch_size = 1

    # # load the POS model
    jar = '/app/stanford-postagger-full-2020-11-17/stanford-postagger.jar'
    model = '/app/stanford-postagger-full-2020-11-17/models/english-left3words-distsim.tagger'
    pos_tagger = StanfordPOSTagger(model, jar, encoding='utf8')

    # sentences = ["I would like to finish the book sometime this year"] 
    sentences = [
        "The professor said that he would give an exam on the upcoming Monday",
        "The professor said that on Monday, he would announce an exam"
    ]

    # Input datasets cannot be tagged with a period if they are tagged with pos
    # # # ambigous sentences have multiple parses
    # sentences = [
    #     "an enranged cow injured a farmer with an ax", # 0.0
    #     "he sightread the piece with a lot of F naturals", # 0.1
    #     "the hospital is being sued by six foot doctors", # 0.2
    #     "the professor said on Monday he would give an exam on Friday", # 0.3
    # ]

    # # ambigous sentences after disambiguous
    # sentences = [
    #     "the enraged cow injured a farmer who was holding an ax", # 0.0.1
    #     "The enraged cow, somehow wielding an ax, injured a farmer", # 0.0.2

    #     "He sight-read the piece, and the music itself contained many F naturals", # 0.1.1
    #     "He sight-read the piece but mistakenly played a lot of F naturals instead of the correct notes", # 0.1.1

    #     "The hospital is being sued by six doctors who specialize in treating foot-related medical issues", # 0.2.1
    #     "The hospital is being sued by six doctors, each of whom is six feet tall", # 0.2.2

    #     "The professor said that he would give an exam on the upcoming Monday", # 0.3.1
    #     "The professor said that on Monday, he would announce an exam", # 0.3.2
    # ]
    

    # # ambigous sentences DO NOT have multiple parses
    # sentences = [
    #     "even though he was failing, he refused to give up", # 1.0
    #     "this seminar is full now, but interesting seminars are being offered next quarter too", # 1.1
    #     "I don‘t know if she is a US citizen or Green Card holder", # 1.2
    #     "He always flaunts his mother's advice to follow his own dreams", # 1.3
    #     "I would like to finish the book sometime this year", # 1.4
    # ]

    if output_path != '-' and os.path.exists(output_path):
        print("Error: output file already exists:", output_path)
        return

    print("Loading model from {}...".format(model_path_base))
    assert model_path_base.endswith(".pt"), "Only pytorch savefiles supported"

    info = torch_load(model_path_base)
    assert 'hparams' in info['spec'], "Older savefiles not supported"
    parser = SAPar_model.SAChartParser.from_spec(info['spec'], info['state_dict'])

    print("Parsing sentences...")
    sentences = [sentence.split() for sentence in sentences]

####################################################################################################
# Prediction function for best parse
####################
    # all_predicted = []
    # for start_index in range(0, len(sentences), eval_batch_size):
    #     subbatch_sentences = sentences[start_index:start_index+eval_batch_size]
    #     subbatch_sentences_with_pos = []

    #     for sentence in subbatch_sentences:
    #         pos_tags = pos_tagger.tag(sentence)
    #         sentence_with_pos = [(pos, word) if pos in parser.tag_vocab.indices else (dummy_tag, word) for word, pos in pos_tags]
    #         subbatch_sentences_with_pos.append(sentence_with_pos)
    #         print(sentence_with_pos)
    #         predicted, _ = parser.parse_batch(subbatch_sentences_with_pos)

    #     del _
    #     if output_path == '-':
    #         for p in predicted:
    #             print(p.convert().linearize())
    #             nltk_tree = Tree.fromstring(p.convert().linearize())
    #             nltk_tree.pretty_print()
    #     else:
    #         all_predicted.extend([p.convert() for p in predicted])

    # if output_path != '-':
    #     with open(output_path, 'w') as output_file:
    #         for tree in all_predicted:
    #             output_file.write("{}\n".format(tree.linearize()))
    #     print("Output written to:", output_path)
####################################################################################################


# Prediction function for k-best parse

    output_path = './output/1.json'
    all_sentences_data = []  # create a list to store the data of all sentences

    for start_index in range(0, len(sentences), eval_batch_size):
        subbatch_sentences = sentences[start_index:start_index+eval_batch_size]
        # POS tagging
        subbatch_sentences_with_pos = []

        for sentence in subbatch_sentences:
            pos_tags = pos_tagger.tag(sentence)
            print("POS tags:", pos_tags)
            print("sentence:", sentence)
            subbatch_sentences_with_pos.append([(pos, word) for word, pos in pos_tags])

        predicted_trees, predicted_scores = parser.parse_batch(subbatch_sentences_with_pos, k=113)
        
        for idx, (trees, scores) in enumerate(zip(predicted_trees, predicted_scores)):
            sentence_data = {}  # create a dictionary to store the sentence data
            sentence_text = ' '.join(subbatch_sentences[idx])
            sentence_data['sentence'] = sentence_text
            sentence_data['num_trees'] = len(trees)
            sentence_data['trees'] = []
            sentence_data['scores'] = scores  # store the scores of the trees

            # print Tree
            for tree, score in zip(trees, scores):
                
                # print(tree.convert().linearize(), "Score:", score)
                # nltk_tree = Tree.fromstring(tree.convert().linearize())
                # nltk_tree.pretty_print()

                # append for json
                tree_structure = tree.convert().linearize()
                sentence_data['trees'].append({
                    'structure': tree_structure,
                    'score': score
                })
            
            all_sentences_data.append(sentence_data)

    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(all_sentences_data, json_file, ensure_ascii=False, indent=4)
        print("result saved：", output_path)


if __name__ == "__main__":
    main()