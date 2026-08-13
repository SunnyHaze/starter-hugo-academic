---
title: "ForensicHub: A Unified Benchmark & Codebase for All-Domain Fake Image Detection and Localization"
authors:
- Bo Du
- Xuekang Zhu
- admin
- Chenfan Qu
- Kaiwen Feng
- Zhe Yang
- Chi-Man Pun
- Jian Liu
- Ji-Zhe Zhou

date: "2025-10-16"


# Schedule page publish date (NOT publication's date).
publishDate: "2025-10-11T03:42:22.405780Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article"]

# Publication name and optional abbreviated publication name.
publication: "**Conference on Neural Information Processing Systems 2025**"
publication_short: "**NeurIPS'25**"

abstract: >
  The field of Fake Image Detection and Localization (FIDL) is highly fragmented, encompassing four domains: deepfake detection (Deepfake), image manipulation detection and localization (IMDL), artificial intelligence-generated image detection (AIGC), and document image manipulation localization (Doc). Although individual benchmarks exist in some domains, a unified benchmark for all domains in FIDL remains blank. The absence of a unified benchmark results in significant domain silos, where each domain independently constructs its datasets, models, and evaluation protocols without interoperability, preventing cross-domain comparisons and hindering the development of the entire FIDL field.
  To close the domain silo barrier, we propose ForensicHub, the first unified benchmark and codebase for all-domain fake image detection and localization.
  Considering drastic variations on dataset, model, and evaluation configurations across all domains, as well as the scarcity of open-sourced baseline models and the lack of individual benchmarks in some domains, ForensicHub:
  i) proposes a modular and configuration-driven architecture that decomposes forensic pipelines into interchangeable components across datasets, transforms, models, and evaluators, allowing flexible composition across all domains;
  ii) fully implements 10 baseline models (3 of which are reproduced from scratch), 6 backbones, 2 new benchmarks for AIGC and Doc, and integrates 2 existing benchmarks of DeepfakeBench and IMDLBenCo through an adapter-based design;
  iii) establishes an image forensic fusion protocol evaluation mechanism that supports unified training and testing of diverse forensic models across tasks;
  iv) conducts in-depth analysis based on the ForensicHub, offering 8 key actionable insights into FIDL model architecture, dataset characteristics, and evaluation standards.
  Specifically, ForensicHub includes 4 forensic tasks, 23 datasets, 42 baseline models, 6 backbones, 11 GPU-accelerated pixel- and image-level evaluation metrics, and realizes 16 kinds of cross-domain evaluations. ForensicHub represents a significant leap forward in breaking the domain silos in the FIDL field and inspiring future breakthroughs.
  Code is available at: https://github.com/scu-zjz/ForensicHub.

# Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
# - Source Themes
featured: true
homepage_weight: 40

links:
- name: arXiv
  url: https://arxiv.org/abs/2505.11003
# - name: "AAAI URL"
  # url:  'https://ojs.aaai.org/index.php/AAAI/article/view/32754'
url_pdf: https://arxiv.org/pdf/2505.11003.pdf
url_code: 'https://github.com/scu-zjz/ForensicHub'
# url_dataset: '#'
# url_poster: 'https://neurips.cc/media/PosterPDFs/NeurIPS%202024/97594.png?t=1731354740.441627'
# url_project: ''
# url_slides: ''
# url_source: '#'
# url_video: '#'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Overview of ForensicHub Structures.'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
# projects:
# - internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
# slides: example
---

<!-- {{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Add the publication's **full text** or **supplementary notes** here. You can use rich formatting such as including [code, math, and images](https://wowchemy.com/docs/content/writing-markdown-latex/). -->
