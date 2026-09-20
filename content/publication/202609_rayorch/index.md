---
title: "RayOrch: Programming and Executing Lineage-Controlled Multi-Grain Dataflows for Foundation-Model Data Preparation"
authors:
- admin
- Zimo Meng
- Junzhu Liang
- Youhe Jiang
- Yue Cheng
- Hao Liang
- Bohan Zeng
- Dengchun Li
- Lu Ma
- Zhengyang Zhao
- Zhen Hao Wong
- Runming He
- Meiyi Qiang
- Jiangtao Guan
- Binhang Yuan
- Wentao Zhang
date: "2026-09-16"
publishDate: "2026-09-16"
publication_types: ["article"]
publication: "*arXiv preprint arXiv:2609.18703*"
publication_short: "**arXiv'26**"
abstract: >-
  Preparing high-quality training data for foundation models requires scalable data pipelines that transform heterogeneous documents and videos into structured records. RayOrch introduces a programming model and distributed execution engine for lineage-controlled, multi-grain dataflows, preserving parent relationships, order, completion state, and result routing across input-dependent expansions. Its compiler validates dataflow programs, while the runtime tracks child membership, immediate parents, ordinals, and terminal states, with per-call FIFO ready queues and parent-scoped failure handling. On H20 GPUs, RayOrch achieves up to 15.14x speedup for MinerU workloads from 4 to 64 GPUs and 7.82x for video workloads from 8 to 64 GPUs, reducing end-to-end time compared with Ray Data, Daft, and Docling.
featured: true
homepage_weight: 5
links:
- name: arXiv
  url: https://arxiv.org/abs/2609.18703
url_pdf: https://arxiv.org/pdf/2609.18703.pdf
url_code: https://github.com/OpenDCAI/RayOrch
projects: []
---
