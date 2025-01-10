# cython: language_level=3

import numpy as np
cimport numpy as np
from numpy cimport ndarray
cimport cython

ctypedef np.float32_t DTYPE_t

cdef void backtrack(int left, int right, int idx, int tree_idx,
                    np.ndarray[int, ndim=3] split_idx_chart,
                    np.ndarray[int, ndim=3] left_idx_chart,
                    np.ndarray[int, ndim=3] right_idx_chart,
                    np.ndarray[int, ndim=3] best_label_chart,
                    list included_i_list, list included_j_list, list included_label_list, list included_split_list):
    included_i_list[tree_idx].append(left)
    included_j_list[tree_idx].append(right)
    included_label_list[tree_idx].append(best_label_chart[left, right, idx])

    if left + 1 >= right:
        included_split_list[tree_idx].append(-1)
    else:
        split = split_idx_chart[left, right, idx]
        included_split_list[tree_idx].append(split)
        left_child_idx = left_idx_chart[left, right, idx]
        right_child_idx = right_idx_chart[left, right, idx]
        backtrack(left, split, left_child_idx, tree_idx,
                  split_idx_chart, left_idx_chart, right_idx_chart, best_label_chart,
                  included_i_list, included_j_list, included_label_list, included_split_list)
        backtrack(split, right, right_child_idx, tree_idx,
                  split_idx_chart, left_idx_chart, right_idx_chart, best_label_chart,
                  included_i_list, included_j_list, included_label_list, included_split_list)

ORACLE_PRECOMPUTED_TABLE = {}
@cython.boundscheck(False)
def decode(int force_gold, int sentence_len, np.ndarray[DTYPE_t, ndim=3] label_scores_chart, int is_train, gold, label_vocab, int k):
    print("Function decode is called.")
    cdef DTYPE_t NEG_INF = -np.inf
    cdef int INVALID_IDX = -1
    
    cdef np.ndarray[DTYPE_t, ndim=3] label_scores_chart_copy
    cdef np.ndarray[DTYPE_t, ndim=3] value_chart

    cdef np.ndarray[int, ndim=3] split_idx_chart
    cdef np.ndarray[int, ndim=3] best_label_chart
    cdef np.ndarray[int, ndim=3] left_idx_chart
    cdef np.ndarray[int, ndim=3] right_idx_chart

    label_scores_chart_copy = label_scores_chart.copy()
    value_chart = np.full((sentence_len + 1, sentence_len + 1, k), NEG_INF, dtype=np.float32)
    
    split_idx_chart = np.full((sentence_len + 1, sentence_len + 1, k), INVALID_IDX, dtype=np.int32)
    best_label_chart = np.full((sentence_len + 1, sentence_len + 1, k), INVALID_IDX, dtype=np.int32)
    left_idx_chart = np.full((sentence_len + 1, sentence_len + 1, k), INVALID_IDX, dtype=np.int32)
    right_idx_chart = np.full((sentence_len + 1, sentence_len + 1, k), INVALID_IDX, dtype=np.int32)

    cdef list included_i_list = [[] for _ in range(k)]
    cdef list included_j_list = [[] for _ in range(k)]
    cdef list included_label_list = [[] for _ in range(k)]

    cdef int length
    cdef int left
    cdef int right
    cdef int oracle_label_index
    cdef DTYPE_t label_score
    cdef int argmax_label_index
    cdef DTYPE_t left_score
    cdef DTYPE_t right_score
    cdef int best_split
    cdef int split_idx
    cdef DTYPE_t split_val
    cdef DTYPE_t max_split_val
    
    cdef int label_index_iter

    cdef np.ndarray[int, ndim=2] oracle_label_chart
    cdef np.ndarray[int, ndim=2] oracle_split_chart

    if is_train or force_gold:
        if gold not in ORACLE_PRECOMPUTED_TABLE:
            oracle_label_chart = np.zeros((sentence_len+1, sentence_len+1), dtype=np.int32)
            oracle_split_chart = np.zeros((sentence_len+1, sentence_len+1), dtype=np.int32)
            for length in range(1, sentence_len + 1):
                for left in range(0, sentence_len + 1 - length):
                    right = left + length
                    oracle_label_chart[left, right] = label_vocab.index(gold.oracle_label(left, right))
                    if length == 1:
                        continue
                    oracle_splits = gold.oracle_splits(left, right)
                    oracle_split_chart[left, right] = min(oracle_splits)
            if not gold.nocache:
                ORACLE_PRECOMPUTED_TABLE[gold] = oracle_label_chart, oracle_split_chart
        else:
            oracle_label_chart, oracle_split_chart = ORACLE_PRECOMPUTED_TABLE[gold]

    for length in range(1, sentence_len + 1):
        for left in range(0, sentence_len + 1 - length):
            right = left + length

            if is_train or force_gold:
                oracle_label_index = oracle_label_chart[left, right]

            if force_gold:
                label_score = label_scores_chart_copy[left, right, oracle_label_index]
                best_label_chart[left, right] = oracle_label_index

            else:
                if is_train:
                    label_scores_chart_copy[left, right, oracle_label_index] -= 1

                if length < sentence_len:
                    argmax_label_index = 0
                else:
                    argmax_label_index = 1

                label_score = label_scores_chart_copy[left, right, argmax_label_index]
                for label_index_iter in range(1, label_scores_chart_copy.shape[2]):
                    if label_scores_chart_copy[left, right, label_index_iter] > label_score:
                        argmax_label_index = label_index_iter
                        label_score = label_scores_chart_copy[left, right, label_index_iter]
                best_label_chart[left, right] = argmax_label_index

                if is_train:
                    label_score += 1

            if length == 1:
                # Get the first k tag indices and scores
                top_k_labels = np.argsort(-label_scores_chart_copy[left, right, :])[:k]
                top_k_scores = label_scores_chart_copy[left, right, top_k_labels]
                
                best_label_chart[left, right, :] = top_k_labels
                value_chart[left, right, :] = top_k_scores
                continue

            if force_gold:
                best_split = oracle_split_chart[left, right]
                for idx in range(k):
                    value_chart[left, right, idx] = (label_scores_chart_copy[left, right, best_label_chart[left, right, idx]] +
                                                    value_chart[left, best_split, idx] +
                                                    value_chart[best_split, right, idx])
                    split_idx_chart[left, right, idx] = best_split
            else:
                candidates = []
                # Iterate over all possible split points
                for split_idx in range(left + 1, right):
                    # Iterate through the first k candidates of the left subtree
                    for left_idx in range(k):
                        left_score = value_chart[left, split_idx, left_idx]
                        # Iterate through the first k candidates of the right subtree
                        for right_idx in range(k):
                            right_score = value_chart[split_idx, right, right_idx]
                            # Calculate the combination score (excluding the labeling score for the current span)
                            combined_score = left_score + right_score
                            # Adding candidates to the list
                            candidates.append((combined_score, split_idx, left_idx, right_idx))
                
                # Plus the tag score for the current span
                label_scores = label_scores_chart_copy[left, right, :]
                candidates_with_label = []
                for label_idx in range(label_scores.shape[0]):
                    label_score = label_scores[label_idx]
                    for cand in candidates:
                        total_score = cand[0] + label_score
                        # Store candidate information: (total score, split point, left index, right index, label index)
                        candidates_with_label.append((total_score, cand[1], cand[2], cand[3], label_idx))
                
                 # Sorting by score and selecting the top k candidates
                candidates_with_label.sort(reverse=True, key=lambda x: x[0])
                top_k_candidates = candidates_with_label[:k]

                # Store information about the first k candidates
                for idx_cand, (cand_score, split_idx, left_idx, right_idx, label_idx) in enumerate(top_k_candidates):
                    value_chart[left, right, idx_cand] = cand_score
                    split_idx_chart[left, right, idx_cand] = split_idx
                    left_idx_chart[left, right, idx_cand] = left_idx
                    right_idx_chart[left, right, idx_cand] = right_idx
                    best_label_chart[left, right, idx_cand] = label_idx

    cdef int num_tree_nodes = 2 * sentence_len - 1


    included_i_list = [[] for _ in range(k)]
    included_j_list = [[] for _ in range(k)]
    included_label_list = [[] for _ in range(k)]
    included_split_list = [[] for _ in range(k)]

    for tree_idx in range(k):
        # Adding data to included_*_list[tree_idx] directly in the backtrack
        backtrack(0, sentence_len, tree_idx, tree_idx,
                split_idx_chart, left_idx_chart, right_idx_chart, best_label_chart,
                included_i_list, included_j_list, included_label_list, included_split_list)

    cdef list running_totals = []
    cdef list augment_amounts = []
    cdef DTYPE_t score

    for idx in range(k):
        running_total = 0.0
        num_nodes = len(included_i_list[idx])
        for node_idx in range(num_nodes):
            i = included_i_list[idx][node_idx]
            j = included_j_list[idx][node_idx]
            label = included_label_list[idx][node_idx]
            
            running_total += label_scores_chart[i, j, label]
        score = value_chart[0, sentence_len, idx]
        running_totals.append(running_total)
        augment_amounts.append(round(score - running_total))
    
    print("chart_helper.decode is returning {} values.".format(len((
        [value_chart[0, sentence_len, idx] for idx in range(k)],
        [np.array(included_i_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_j_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_label_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_split_list[idx], dtype=int) for idx in range(k)],
        augment_amounts
    ))))
    
    return (
        [value_chart[0, sentence_len, idx] for idx in range(k)],
        [np.array(included_i_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_j_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_label_list[idx], dtype=int) for idx in range(k)],
        [np.array(included_split_list[idx], dtype=int) for idx in range(k)],
        augment_amounts
    )