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
  Foundation-model data preparation often expands one input into a variable number of records and still needs to preserve lineage, order, completion, and failure semantics. RayOrch is a programming model and distributed execution engine for these lineage-controlled, multi-grain dataflows. It combines compile-time validation with runtime tracking of parent-child relationships, ordered result assembly, and parent-scoped failures, and provides Ray-based execution for large-scale document and video processing. On H20 GPUs, RayOrch achieves up to 15.14x speedup for MinerU workloads from 4 to 64 GPUs and 7.82x for video workloads from 8 to 64 GPUs, reducing end-to-end time compared with Ray Data, Daft, and Docling.
featured: true
homepage_weight: 5
links:
- name: arXiv
  url: https://arxiv.org/abs/2609.18703
url_pdf: https://arxiv.org/pdf/2609.18703.pdf
url_code: https://github.com/OpenDCAI/RayOrch
projects: []
---
