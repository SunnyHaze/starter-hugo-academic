---
title: "Mesoscopic insights: Orchestrating multi-scale & hybrid architecture for image manipulation localization"
authors:
- Xuekang Zhu
- admin
- Lei Su
- Zhuohang Jiang
- Bo Du
- Xiwen Wang
- Zeyu Lei
- Wentao Feng
- Chi-Man Pun
- Ji-zhe Zhou

date: "2024-12-19"
doi: "https://doi.org/10.1609/aaai.v39i10.33198"

# Schedule page publish date (NOT publication's date).
publishDate: "2024-12-19T03:42:22.405780Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article"]

# Publication name and optional abbreviated publication name.
publication: "**The 39th Annual AAAI Conference on Artificial Intelligence**"
publication_short: "**AAAI'25**"

abstract: "The mesoscopic level serves as a bridge between the macroscopic and microscopic worlds, addressing gaps overlooked by both. Image manipulation localization (IML), a crucial technique to pursue truth from fake images, has long relied on low-level (microscopic-level) traces. However, in practice, most tampering aims to deceive the audience by altering image semantics. As a result, manipulation commonly occurs at the object level (macroscopic level), which is equally important as microscopic traces. Therefore, integrating these two levels into the mesoscopic level presents a new perspective for IML research. Inspired by this, our paper explores how to simultaneously construct mesoscopic representations of micro and macro information for IML  and introduces the Mesorch architecture to orchestrate both. Specifically, this architecture i) combines Transformers and CNNs in parallel, with Transformers extracting macro information and CNNs capturing micro details, and ii) explores across different scales, assessing micro and macro information seamlessly. Additionally, based on the Mesorch architecture, the paper introduces two baseline models aimed at solving IML tasks through mesoscopic representation. Extensive experiments across four datasets have demonstrated that our models surpass the current state-of-the-art in terms of performance, computational complexity, and robustness."

# Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

tags:
# - Source Themes
featured: false

links:
- name: arXiv
  url: https://arxiv.org/abs/2412.13753
- name: "AAAI URL"
  url: https://ojs.aaai.org/index.php/AAAI/article/view/33198
url_pdf: https://ojs.aaai.org/index.php/AAAI/article/view/33198/35353
url_code: 'https://github.com/scu-zjz/Mesorch'
# url_dataset: '#'
# url_poster: 'https://neurips.cc/media/PosterPDFs/NeurIPS%202024/97594.png?t=1731354740.441627'
# url_project: ''
# url_slides: ''
# url_source: '#'
# url_video: '#'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Overview of Mesorch Structures, with paralled CNN and ViT.'
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
