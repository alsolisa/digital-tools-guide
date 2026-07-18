import { getOfferPriceStatus, subscriptionOffers } from "../../data/catalog";
import Image from "next/image";
import { BrandIcon, PageShell, SectionHeading, VerificationChip } from "../components/SiteChrome";

export const metadata = {
  title: "GamsGo AI订阅",
  description: "介绍GamsGo平台、售后与付款方式，并比较ChatGPT、Claude、Gemini、Grok与Perplexity的官方价和购买方案。",
  alternates: { canonical: `${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/subscriptions/` },
  openGraph: { images: [`${process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : ""}/editorial/subscriptions.webp`] },
};

export default function SubscriptionsPage() {
  const assetBase = process.env.GITHUB_PAGES === "true" ? "/digital-tools-guide" : "";
  return (
    <PageShell>
      <section className="content-section gamsgo-hero" aria-labelledby="gamsgo-title">
        <div className="gamsgo-hero-copy">
          <span>AI订阅购买平台 · 第一次也能看懂</span>
          <h1 id="gamsgo-title">先认识 GamsGo，再选择适合自己的 AI 订阅</h1>
          <p>GamsGo 提供 AI、流媒体和游戏等数字订阅服务。按照平台官方公开介绍，部分方案最高可节省 85%；本页把不同产品、价格和购买方式分开说明，让你可以直接比较。</p>
          <div className="gamsgo-hero-actions"><a className="primary-action" href="https://www.gamsgo.com/partner/BTzCM" target="_blank" rel="sponsored noopener">打开 GamsGo ↗</a><a href="#offers">查看 AI 订阅方案 ↓</a></div>
        </div>
        <div className="gamsgo-trust-panel" aria-label="GamsGo官方公开数据">
          <span>GamsGo 官方公开介绍</span>
          <dl><div><dt>7 年</dt><dd>数字订阅服务经验</dd></div><div><dt>150+</dt><dd>覆盖国家与地区</dd></div><div><dt>1000 万+</dt><dd>平台累计用户</dd></div><div><dt>最高 85%</dt><dd>部分订阅折扣</dd></div></dl>
        </div>
      </section>

      <section className="content-section soft-section gamsgo-benefit-section">
        <SectionHeading index="01" title="为什么有人通过 GamsGo 订阅？" lead="对普通用户来说，主要价值不是复杂的技术功能，而是价格更低、付款更方便、套餐写得清楚，并且出现问题时有人可以联系。" />
        <div className="gamsgo-benefit-grid">
          <article><span>01 · 售后保障</span><h2>7×24 小时在线客服</h2><p>遇到账号、交付或订单问题，可以从订单页联系 GamsGo 客服处理，不需要自己寻找产品供应方。</p></article>
          <article><span>02 · 价格优势</span><h2>多项 AI 方案处于较低价位</h2><p>共享、独享账号和本人账号充值分别定价，你可以按预算选择，不必只看官方原价。</p></article>
          <article><span>03 · 国内购买</span><h2>商品页可直接访问，付款更方便</h2><p>中国大陆用户可以直接打开购买页；结算时可选择支付宝等方式，实际可用选项以 GamsGo 结算页为准。</p></article>
          <article><span>04 · 信息透明</span><h2>先看清套餐，再决定购买</h2><p>商品页会展示价格、周期和交付方式。下单前可以先确认买到的是共享使用、独享账号还是本人账号充值。</p></article>
        </div>
      </section>

      <section className="content-section" id="offers">
        <SectionHeading index="02" title="AI订阅方案：先选产品，再选购买方式" lead="每张卡片先列官方参考价，再展示GamsGo当前方案和购买入口。ChatGPT已分成共享、独享账号和本人账号充值三种方式。" />
        <div className="subscription-grid">
          {subscriptionOffers.filter((offer) => offer.productSlug !== "midjourney").map((offer) => {
            return (
              <article className={`subscription-card${offer.purchaseOptions ? " subscription-card-featured" : ""}`} id={`offer-${offer.slug}`} key={offer.slug}>
                <div className="subscription-card-head">
                  <BrandIcon slug={offer.productSlug} name={offer.name} />
                  <div><h2>{offer.name}</h2><p>{offer.useCase}</p></div>
                </div>
                <div className="why-selected"><span>为什么收录</span><p>{offer.whySelected}</p><strong>付费前建议：{offer.freeAdvice}</strong></div>
                <div className={`price-comparison${offer.purchaseOptions ? " price-comparison-options" : ""}`}>
                  <div><span>官方参考价</span><strong>{offer.officialPrice}</strong><small>{offer.officialCny}</small></div>
                  {offer.purchaseOptions ? <div className="price-option-summary"><span>GamsGo 当前方案</span>{offer.purchaseOptions.map((option) => <p key={option.label}><b>{option.label}</b><strong>{option.price}</strong></p>)}</div> : <div><span>GamsGo公开价</span><strong>{offer.gamsgoPrice}</strong><small>{offer.gamsgoCny}</small><VerificationChip status={getOfferPriceStatus(offer.slug)} /></div>}
                </div>
                <p className="price-note">{offer.priceNote}</p>
                <dl className="fact-list">
                  <div><dt>交付方式</dt><dd>{offer.deliveryType}</dd></div>
                  <div><dt>账号归属</dt><dd>{offer.ownership}</dd></div>
                  <div><dt>隐私</dt><dd>{offer.privacy}</dd></div>
                  <div><dt>续费</dt><dd>{offer.renewal}</dd></div>
                  <div><dt>付款</dt><dd>{offer.payment}</dd></div>
                  <div><dt>售后</dt><dd>{offer.support}</dd></div>
                </dl>
                <div className="card-source-row"><span>核验：{offer.priceVerifiedAt || offer.verifiedAt}</span><a href={offer.sourceUrl} target="_blank" rel="noopener noreferrer">打开商品说明 ↗</a></div>
                <div className="subscription-actions">
                  <a className="official-action" href={offer.officialUrl} target="_blank" rel="noopener noreferrer">查看官方方案 ↗</a>
                </div>
                <div className={`purchase-option-grid${offer.purchaseOptions ? " purchase-option-grid-multiple" : ""}`}>
                  {offer.purchaseOptions ? offer.purchaseOptions.map((option) => <a href={option.url} key={option.label} target="_blank" rel="sponsored noopener"><span>{option.label}</span><strong>{option.price}</strong><small>{option.note}</small><b>前往购买 ↗</b></a>) : <a className="purchase-option-single" href={offer.affiliateUrl} target="_blank" rel="sponsored noopener"><span>GamsGo 购买入口</span><strong>查看当前方案</strong><small>价格、周期和交付方式以购买页为准</small><b>前往购买 ↗</b></a>}
                </div>
                {offer.purchaseQrCodes && <div className="purchase-qr-grid" aria-label="ChatGPT购买二维码">{offer.purchaseQrCodes.map((qr) => <a href={qr.url} key={qr.label} target="_blank" rel="sponsored noopener"><Image src={`${assetBase}${qr.image}`} width={100} height={100} unoptimized alt={`${qr.label}购买二维码`} /><span>扫码打开<br /><strong>{qr.label}</strong></span></a>)}</div>}
              </article>
            );
          })}
        </div>
      </section>

    </PageShell>
  );
}
