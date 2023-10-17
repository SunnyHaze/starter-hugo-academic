---
title: "Perceptual MAE for Image Manipulation Localization: A High-level Vision Learner Focusing on Low-level Features"
authors:
- admin
- Jizhe Zhou*
- Xiong Xu
- Zhuohang Jiang
- Chi-Man Pun
date: "2023-10-01"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: '2023-10-02T03:42:22.857471Z'

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "In Submission"
publication_short: "In Submission"

abstract: Nowadays, multimedia forensics faces unprecedented challenges due to the rapid advancement of multimedia generation technology thereby making Image Manipulation Localization (IML) crucial in the pursuit of truth. The key to IML lies in revealing the artifacts or inconsistencies between the tampered and authentic areas, which are evident under pixel-level features. Consequently, existing studies treat IML as a low-level vision task, focusing on allocating tampered masks by crafting pixel-level features such as image RGB noises, edge signals, or high-frequency features. However, in practice, tampering commonly occurs at the object level, and different classes of objects have varying likelihoods of becoming targets of tampering. Therefore, object semantics are also vital in identifying the tampered areas in addition to pixel-level features. This necessitates IML models to carry out a semantic understanding of the entire image. In this paper, we reformulate the IML task as a high-level vision task that greatly benefits from low-level features. Based on such an interpretation, we propose a method to enhance the Masked Autoencoder (MAE) by incorporating high-resolution inputs and a perceptual loss supervision module, which is termed Perceptual MAE (PMAE). While MAE has demonstrated an impressive understanding of object semantics, PMAE can also compensate for low-level semantics with our proposed enhancements. Evidenced by extensive experiments, this paradigm effectively unites the low-level and high-level features of the IML task and outperforms state-of-the-art tampering localization methods on all five publicly available datasets.

# Summary. An optional shortened abstract.
# summary: 

tags:
- Source Themes
featured: false

links:
- name: arXiv
  url: https://arxiv.org/abs/2310.06525
url_pdf: https://arxiv.org/pdf/2310.06525.pdf
url_code: 'https://github.com/SunnyHaze/PMAE'
# url_dataset: '#'
# url_poster: '#'
# url_project: ''
# url_slides: ''
# url_source: '#'
# url_video: '#'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'PMAE structure.'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
# - internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: example
---
Under review, more infomation untill accpted.
