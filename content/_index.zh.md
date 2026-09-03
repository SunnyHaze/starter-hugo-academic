---
title:
seo:
  title: 马晓晨的个人主页
date: 2022-10-24
type: landing

sections:
  - block: about.biography
    id: about
    content:
      title: 个人简介
      username: admin

  - block: experience
    content:
      title: 经历
      date_format: 2006年1月
      items:
        # HUNYUAN_EXPERIENCE_START（暂时隐藏；恢复方法见 README）
        # - title: 研究实习生（青云计划）
        #   company: 腾讯混元基础模型部
        #   company_url: 'https://hy.tencent.com/'
        #   company_logo: hunyuan
        #   location: 北京
        #   date_start: '2026-06-24'
        #   date_end: ''
        #   track: experience
        #   description: |2-
        #     **工作内容：** 基于 Ray 与 Apache Spark 构建面向大模型数据准备的 Data Infra。
        # HUNYUAN_EXPERIENCE_END
        - title: 计算机科学与工程博士生
          company: 香港科技大学
          company_url: 'https://hkust.edu.hk/'
          company_logo: hkust
          location: 中国香港
          date_start: '2026-02-22'
          date_end: ''
          track: education
          description: |2-
            **导师：** [袁彬航教授](https://binhangyuan.github.io/site/)与[张文涛教授](https://zwt233.github.io/)。<br>**研究方向：** 大语言模型数据基础设施与高性能分布式系统。
        - title: 全职研究助理
          company: 北京大学
          company_url: 'https://pku.edu.cn'
          company_logo: pku
          location: 中国
          date_start: '2025-01-01'
          date_end: '2026-01-30'
          track: experience
          description: |2-
            **导师：** [张文涛教授](https://zwt233.github.io/)。<br>**研究方向：** 大语言模型数据准备系统。
        - title: 全职研究助理
          company: 四川大学
          company_url: 'https://scu.edu.cn'
          company_logo: scu
          location: 中国
          date_start: '2023-07-01'
          date_end: '2024-06-30'
          track: experience
          description: |2-
            **导师：** [周吉喆教授](https://knightzjz.github.io/)。<br>**研究方向：** 图像篡改检测与定位，包括基准与开源代码库建设。
        - title: 本科生
          company: 四川大学
          company_url: 'https://scu.edu.cn'
          company_logo: scu
          location: 中国
          date_start: '2019-09-01'
          date_end: '2023-06-01'
          track: education
          description: 计算机科学与技术工学学士；本科毕业论文获评优秀本科毕业论文。
    design:
      columns: '1'
      css_class: career-timeline-section

  - block: publication_showcase
    id: publications
    content:
      title: 精选论文
      count: 4
      scholar_url: https://scholar.google.com/citations?user=hGEIyCEAAAAJ
    design:
      columns: '2'
      view: citation

  - block: contact
    id: contact
    content:
      title: 联系方式
      email: xiaochen.ma.cs[at]gmail.com OR xiaochen.ma[at]connect.ust.hk
      address:
        street: 九龙
        city: 香港
        country: 中国
      directions: 香港科技大学，香港九龙清水湾
      contact_links: []
      autolink: false
    design:
      columns: '2'

  - block: analytics_showcase
    id: site-analytics
    content:
      title: 实时统计
      expand_label: 查看概览
      expand_hint: 过去 28 天 · 浏览量 · 会话 · 地域
      open_label: 完整视图
      frame_title: 马晓晨个人主页公开访问分析
      loading_label: 正在加载实时统计…
      fallback_label: 嵌入视图加载较慢，可打开完整视图查看。
    design:
      columns: '1'
      css_class: analytics-showcase-section
---
