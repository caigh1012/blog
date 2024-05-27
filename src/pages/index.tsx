import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Head from '@docusaurus/Head';
import styles from './index.module.css';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="stylesheet"
          href="landing_page/css/fonts.css"
        />
        <link
          rel="stylesheet"
          href="landing_page/css/style.css"
        />
        <script src="landing_page/js/preset.js"></script>
      </Head>
      <main className="landing-page">
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-copy">
                <h1 className="hero-title mt-0">
                  欢迎来到我的博客，我是Kyler Tsai
                </h1>
                <p className="hero-paragraph">本博客网站用于记录个人日常学习记录笔记以及个人编写的博客文章</p>
                <div className="hero-cta">
                  <a
                    className="button button-primary"
                    href="/blog" >
                    快速去博客
                  </a>
                </div>
              </div>
              <div className="hero-figure anime-element">
                <svg
                  className="placeholder"
                  width="528"
                  height="396"
                  viewBox="0 0 528 396">
                  <rect
                    width="528"
                    height="396"
                    style={{ fill: 'transparent' }}
                  />
                </svg>
                <div
                  className="hero-figure-box hero-figure-box-01"
                  data-rotation="45deg"></div>
                <div
                  className="hero-figure-box hero-figure-box-02"
                  data-rotation="-45deg"></div>
                <div
                  className="hero-figure-box hero-figure-box-03"
                  data-rotation="0deg"></div>
                <div
                  className="hero-figure-box hero-figure-box-04"
                  data-rotation="-135deg"></div>
                <div className="hero-figure-box hero-figure-box-05"></div>
                <div className="hero-figure-box hero-figure-box-06"></div>
                <div className="hero-figure-box hero-figure-box-07"></div>
                <div
                  className="hero-figure-box hero-figure-box-08"
                  data-rotation="-22deg"></div>
                <div
                  className="hero-figure-box hero-figure-box-09"
                  data-rotation="-52deg"></div>
                <div
                  className="hero-figure-box hero-figure-box-10"
                  data-rotation="-50deg"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="features section">
          <div className="container">
            <div className="features-inner section-inner">
              <div className="features-wrap">
                <div style={{ width: '280px' }} className="feature text-center is-revealing">
                  <div className="feature-inner">
                    <div className="feature-icon">
                      <img src="landing_page/images/feature-icon-01.svg" alt="Feature 01" />
                    </div>
                    <h4 className="feature-title mt-24">学习记录</h4>
                    <p className="text-sm mb-0">个人学习IT技术过程以及记录学习过程中的文档总结</p>
                  </div>
                </div>
                <div style={{ width: '280px' }} className="feature text-center is-revealing">
                  <div className="feature-inner">
                    <div className="feature-icon">
                      <img src="landing_page/images/feature-icon-02.svg" alt="Feature 02" />
                    </div>
                    <h4 className="feature-title mt-24">博客</h4>
                    <p className="text-sm mb-0">记录个人书写的博客文章内容，主要是一些技术上使用的经验总结以及一些构思实践记录</p>
                  </div>
                </div>
                <div style={{ width: '280px' }} className="feature text-center is-revealing">
                  <div className="feature-inner">
                    <div className="feature-icon">
                      <img src="landing_page/images/feature-icon-03.svg" alt="Feature 03" />
                    </div>
                    <h4 className="feature-title mt-24">DevOps专题</h4>
                    <p className="text-sm mb-0">DevOps学习和实践记录，包括Linux、docker、K8s、虚拟机、服务器等知识对CI/CD的流程分析和学习</p>
                  </div>
                </div>
                <div style={{ width: '280px' }} className="feature text-center is-revealing">
                  <div className="feature-inner">
                    <div className="feature-icon">
                      <img src="landing_page/images/feature-icon-04.svg" alt="Feature 03" />
                    </div>
                    <h4 className="feature-title mt-24">日常记录</h4>
                    <p className="text-sm mb-0">主要记录日常错误记录，包括代码编写错误、代码编写思路和设计错误等记录</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
