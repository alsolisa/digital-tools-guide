export interface GuideWorkflow {
  title: string;
  situation: string;
  steps: string[];
  result: string;
  caution: string;
}

export interface GuideFeature {
  name: string;
  plain: string;
  example: string;
}

export interface AiEditorialGuide {
  verdict: string;
  plainDefinition: string;
  chooseIf: string[];
  skipIf: string[];
  workflows: GuideWorkflow[];
  features: GuideFeature[];
  starterTask: { title: string; prompt: string; check: string[] };
  decision: string;
}

export interface AppEditorialGuide {
  verdict: string;
  plainDefinition: string;
  whyUse: string[];
  notFor: string[];
  coreAreas: GuideFeature[];
  workflows: GuideWorkflow[];
  firstTenMinutes: string[];
  freeVsPaid: string;
  decision: string;
}

export const aiEditorialGuides: Record<string, AiEditorialGuide> = {
  chatgpt: {
    verdict: "如果你只想先学一款AI，ChatGPT通常是最稳妥的起点：功能覆盖广，网页、手机和电脑端完整，学习成本也相对低。",
    plainDefinition: "ChatGPT是一款通用AI助手。你可以像聊天一样告诉它目标，也可以交给它图片、表格、PDF或文字材料，让它解释、整理、修改、分析或创作。它给的是辅助结果，不是自动正确的答案。",
    chooseIf: ["第一次接触AI，希望一款工具覆盖多数日常任务", "经常处理文字、图片、文件、表格或代码", "希望在同一个产品里使用搜索、语音、图片生成和项目整理"],
    skipIf: ["只需要每个回答都附带清楚的网页来源，可先比较Perplexity", "主要工作是超长材料和持续写作，可同时试用Claude"],
    workflows: [
      { title: "把一份文件变成可执行结论", situation: "你收到一份很长的报告、合同说明或会议记录，不知道先看哪里。", steps: ["上传不含敏感信息的文件", "说明自己是谁、要做什么决定", "要求按结论、证据、风险、待确认问题整理"], result: "得到一份结构化摘要，再回到原文核对页码、数字和条款。", caution: "不要只看摘要就签字或付款；法律、财务内容必须由本人或专业人士复核。" },
      { title: "从空白到完成一篇文字", situation: "你有零散想法，但不知道如何写成邮件、方案或文章。", steps: ["先提供读者、目的和必须包含的要点", "让它先列提纲，不急着写全文", "逐段修改语气、事实和例子"], result: "保留你的观点，同时减少空话、重复和结构混乱。", caution: "涉及真实人物、数据和引用时，要逐项核实，避免生成并不存在的来源。" },
      { title: "看图、做图和反复修改", situation: "你想理解截图、识别图中信息，或把一个创意变成图片。", steps: ["上传图片并说明要观察的重点", "要求区分看得见的事实与推测", "生成图片时说明主体、场景、构图、风格和不要出现的内容"], result: "获得图像解释、设计方向或可继续修改的成图。", caution: "不要上传身份证、银行卡、私人聊天或未经授权的人脸素材。" },
    ],
    features: [
      { name: "搜索", plain: "需要最新资料时访问网页，并在回答中给出来源。", example: "比较最近发布的产品规则，并列出每条信息的官方页面。" },
      { name: "文件与数据分析", plain: "读取PDF、表格和文档，提取结构、计算或发现异常。", example: "找出表格中增长最快的三项，并说明计算方法。" },
      { name: "Canvas", plain: "把长文或代码放在独立编辑区域里，适合逐段修改和版本比较。", example: "保留原意，把这篇介绍改成适合新手阅读的网页文案。" },
      { name: "项目与记忆", plain: "把同一主题的聊天和文件放在一起，减少每次重新解释背景。", example: "建立一个旅行项目，集中保存预算、行程和待办。" },
    ],
    starterTask: { title: "第一次测试：解释一个你真正不懂的问题", prompt: "请把【我想了解的主题】解释给完全没有基础的人。先给结论，再用生活例子说明，最后列出3个我最容易误解的地方。", check: ["回答是否真的容易懂", "例子是否贴近你的情况", "它有没有主动说明不确定之处"] },
    decision: "要一款覆盖面最广的第一款AI，优先试ChatGPT；如果最在意来源、长文或Google生态，再把同一任务交给Perplexity、Claude或Gemini比较。",
  },
  claude: {
    verdict: "Claude更像一位耐心的文档与写作搭档：适合阅读长材料、保持上下文、修改文字、分析代码和持续推进复杂项目。",
    plainDefinition: "Claude是Anthropic提供的通用AI助手。它能处理文字、图片和文件，并通过Projects集中资料、通过Artifacts把文档、代码或小工具放在独立区域中继续修改。",
    chooseIf: ["经常阅读、总结或比较长文档", "看重自然写作、结构和语气", "需要围绕一个项目持续讨论、整理和修改"],
    skipIf: ["主要想快速搜网页并逐条查看来源，可先试Perplexity", "高度依赖Gmail、Drive和Android助手，可先试Gemini"],
    workflows: [
      { title: "比较多份长材料", situation: "你有多份报告、制度或访谈，需要找出共同点和冲突。", steps: ["先说明每份材料的来源和日期", "要求建立统一比较维度", "让它为每个结论标出对应文件和段落"], result: "得到可追溯的比较表、共识、冲突和待验证清单。", caution: "上传前删除姓名、联系方式、商业机密和不必要的个人信息。" },
      { title: "与AI一起完成高质量写作", situation: "你需要写方案、报告或说明，但不希望成品像模板拼接。", steps: ["提供自己的草稿、读者和语气", "先让它指出结构问题，不直接重写", "逐段接受或拒绝修改，并要求说明理由"], result: "文章仍保留你的判断和声音，表达更清楚。", caution: "不要让AI代替你虚构经历、客户案例或数据。" },
      { title: "用Artifacts做可见成果", situation: "你想把讨论变成一份文档、网页原型、图表或小工具。", steps: ["明确最终要交付的形式", "让Claude先创建最小版本", "在独立成果区逐项修改并测试"], result: "聊天不再停留在建议，而是形成可以预览和迭代的产物。", caution: "生成的代码或计算逻辑仍要测试，不能直接用于重要生产环境。" },
    ],
    features: [
      { name: "Projects", plain: "集中保存同一项目的聊天和知识材料。", example: "把品牌资料、用户反馈和写作规范放入一个项目。" },
      { name: "Artifacts", plain: "把文档、代码和可视化结果放在聊天旁边单独展示。", example: "边讨论边生成一个可以预览的网页原型。" },
      { name: "网页搜索", plain: "查找当前网页资料并提供引用，适合需要新信息的任务。", example: "只使用官方来源整理某项产品的最新功能。" },
      { name: "文件与图片", plain: "阅读文档、表格、截图和图片中的信息。", example: "比较两份合同说明并标出措辞差异。" },
    ],
    starterTask: { title: "第一次测试：改一段你自己写的文字", prompt: "请不要直接重写。先指出这段文字在结构、重复、语气和证据上最影响阅读的3个问题，再给一个保留我原意的修改版。", check: ["是否保留你的原意", "修改理由是否说得清楚", "长对话中是否仍能记住约束"] },
    decision: "长文、写作和项目协作是主任务时优先试Claude；如果你需要更全面的图片、语音和通用入口，可同时比较ChatGPT。",
  },
  gemini: {
    verdict: "Gemini最适合已经生活在Google生态里的人：搜索、Gmail、Drive、Docs、图片、视频和Android设备之间的衔接是它的核心价值。",
    plainDefinition: "Gemini是Google的AI助手。除了普通对话，它还能进行Deep Research、在Canvas里制作或修改内容、创建专用Gems，并在获得授权后连接部分Google服务。",
    chooseIf: ["长期使用Google账号、Gmail、Drive或Docs", "需要搜索、图片、视频和多模态任务", "希望在Android设备上使用AI助手"],
    skipIf: ["不愿把任何Google服务连接给AI", "账号地区、年龄或单位策略无法使用所需功能"],
    workflows: [
      { title: "用Deep Research做专题调研", situation: "你需要了解一个新行业、产品或复杂主题，而不是只要一句答案。", steps: ["写清研究问题、范围和截止日期", "选择可用资料来源并查看研究计划", "生成报告后逐条打开来源核对"], result: "获得带结构、来源和关键结论的研究报告，还可继续转成音频或视觉内容。", caution: "研究报告会继承来源的错误和偏见；重要数字仍要回到原始页面。" },
      { title: "连接Google资料完成工作", situation: "信息散落在Gmail、Drive和文档中，需要集中查找和整理。", steps: ["只授权任务真正需要的服务", "限定邮箱、文件或时间范围", "要求列出使用了哪些资料以及哪些没找到"], result: "减少来回搜索，把已有资料转成摘要、计划或草稿。", caution: "工作账号可能受管理员政策限制；不要在个人账号处理单位机密。" },
      { title: "在Canvas里制作内容或原型", situation: "你想把想法变成文档、演示内容、代码或简单应用。", steps: ["说明受众、格式和验收标准", "先生成结构或最小版本", "在Canvas中选中局部继续修改"], result: "从聊天直接进入可编辑成果，适合快速试错。", caution: "生成的事实、代码和设计均需人工检查，尤其是公开发布前。" },
    ],
    features: [
      { name: "Deep Research", plain: "分步骤浏览和分析资料，再生成较完整的研究报告。", example: "整理某行业近一年的变化，并区分官方数据与媒体观点。" },
      { name: "Canvas", plain: "用于创建和编辑文档、代码、演示或小应用。", example: "把一份提纲变成演示结构，再逐页修改。" },
      { name: "Gems", plain: "保存一套固定角色、规则和资料，重复完成同类任务。", example: "建立一个只按你的品牌语气修改文案的专用助手。" },
      { name: "Google服务连接", plain: "在授权范围内使用Gmail、Drive等已有资料。", example: "根据指定邮件和文件整理下周待办。" },
    ],
    starterTask: { title: "第一次测试：让它整理一个真实主题", prompt: "请为【主题】先给一个研究计划，再开始回答。把事实、观点和不确定信息分开，并为关键结论提供可打开的来源。", check: ["来源是否能打开并支持结论", "是否真正用到Google生态优势", "地区和账号是否显示所需功能"] },
    decision: "已经深度使用Google服务时，Gemini值得优先试；只想要最通用的第一款AI，则先从ChatGPT开始更简单。",
  },
  grok: {
    verdict: "Grok的差异点不是“什么都更强”，而是更靠近X平台的公开讨论和实时网页信息，并提供文字、语音与图片/视频创作入口。",
    plainDefinition: "Grok是xAI提供的AI助手，可在独立Grok产品和X的相关入口中使用。它可以搜索公开X帖子和实时网页，也能帮助回答、解释、头脑风暴和创作。",
    chooseIf: ["经常关注X上的实时话题和公开讨论", "需要把社交平台观点与网页资料一起观察", "想尝试Grok的图像、视频或语音功能"],
    skipIf: ["要求每个结论都来自稳定、权威的一手资料", "不使用X，也不需要实时社交内容"],
    workflows: [
      { title: "梳理一个正在发生的话题", situation: "某个事件在X上快速传播，观点很多、真假混在一起。", steps: ["限定时间范围和关键词", "要求区分原始发布、转述、观点和未证实内容", "再用官方网页或可靠媒体交叉核对"], result: "快速看清讨论脉络、主要观点和仍缺少的证据。", caution: "高热度不等于真实性；不要只根据帖子数量判断事实。" },
      { title: "跟踪专业账号与行业变化", situation: "你关注一批研究者、公司或创作者，希望减少刷信息流的时间。", steps: ["给出明确账号或主题范围", "要求按日期和来源整理", "让它标出原帖链接和争议点"], result: "形成可复查的动态摘要，而不是只得到一个笼统结论。", caution: "公开帖子可能被删除、编辑或断章取义，要保留时间和来源。" },
      { title: "从想法到多媒体内容", situation: "你想把一个概念扩展成文案、图片或短视频方向。", steps: ["先明确受众和传播目标", "生成多个创意方向而非一次定稿", "人工筛选后再细化画面、节奏和文案"], result: "更快完成创意探索，并保留人工选择空间。", caution: "涉及人物肖像、品牌和版权素材时要确认授权，不制作误导性内容。" },
    ],
    features: [
      { name: "X公开内容搜索", plain: "查找X上的公开帖子和正在发生的讨论。", example: "整理某产品发布后用户最常提到的优点和问题。" },
      { name: "实时网页搜索", plain: "结合当前网页资料回答需要最新信息的问题。", example: "比较今天更新的公告和过去版本有什么变化。" },
      { name: "语音", plain: "用自然对话方式连续提问，适合移动场景。", example: "边走边讨论旅行方案，并让它最后整理成清单。" },
      { name: "Imagine", plain: "进行图片和视频方向的生成与创作。", example: "把一个活动主题扩展成三种视觉风格。" },
    ],
    starterTask: { title: "第一次测试：核对一个实时话题", prompt: "请整理【话题】在过去24小时的进展。把已证实事实、当事方说法、网友观点和未经证实传闻分开，并附上原始来源。", check: ["是否给出原始帖子和网页", "是否区分事实与观点", "有没有把热度误当作证据"] },
    decision: "实时X内容是核心需求时再选Grok；做常规办公、长文档或带来源研究时，ChatGPT、Claude和Perplexity通常更直接。",
  },
  perplexity: {
    verdict: "Perplexity最像“会整理来源的AI搜索”：它的价值是让你边看答案边打开引用，适合查资料、比较产品和建立研究入口。",
    plainDefinition: "Perplexity是一款以搜索和研究为中心的AI产品。它会在回答旁列出网页来源，也提供Research等更深入的资料整理方式。来源可见不代表结论自动正确，仍要打开原文。",
    chooseIf: ["最在意答案旁边能看到并打开来源", "经常做资料搜索、产品比较或研究提纲", "希望在多个模型和研究方式之间选择"],
    skipIf: ["主要需要长篇创作和反复润色", "需要深度连接Google办公生态"],
    workflows: [
      { title: "快速建立一个陌生主题的资料地图", situation: "你第一次接触某个领域，不知道应该搜索哪些关键词和来源。", steps: ["先问核心概念、主要争议和权威来源", "打开关键引用检查发布日期和原文", "继续追问缺失证据和反方观点"], result: "得到关键词、来源、争议和下一步阅读顺序。", caution: "引用可能只支持句子的一部分，必须打开原文查看上下文。" },
      { title: "比较产品、价格或规则", situation: "你要比较多个服务，但网页信息分散、更新时间不同。", steps: ["限定国家、币种、日期和比较维度", "要求只使用官网或一手来源", "把无法核实的字段明确留空"], result: "获得带来源的比较表和待核验项，减少旧价格混入。", caution: "搜索摘要可能过时，付款前仍以结算页为准。" },
      { title: "用Research生成完整报告", situation: "普通搜索不足以回答复杂问题，需要多轮查找和整理。", steps: ["写清研究问题、用途和深度", "让Research执行多步搜索", "导出或分享前检查每个关键引用"], result: "形成可继续编辑、导出或分享的长报告。", caution: "报告完整不等于论证可靠，仍要检查来源质量和缺失观点。" },
    ],
    features: [
      { name: "引用来源", plain: "答案中的信息旁边显示可点击的网页来源。", example: "查看某个价格结论究竟来自官网、媒体还是论坛。" },
      { name: "Research", plain: "用多轮搜索与分析完成较深入的专题报告。", example: "梳理一个市场的参与者、规模、风险和不同观点。" },
      { name: "文件搜索", plain: "把上传的文件与网页资料结合起来回答。", example: "用内部产品说明对照官网的最新规则。" },
      { name: "Comet", plain: "Perplexity的浏览器产品，把搜索与网页操作放在同一环境。", example: "阅读页面时直接追问、总结和继续查证。" },
    ],
    starterTask: { title: "第一次测试：做一次只用一手来源的比较", prompt: "请比较【方案A】和【方案B】。只使用双方官网或官方文档，按价格、功能、限制、更新时间整理；找不到的内容写‘未核实’，不要猜。", check: ["引用是否真的来自一手页面", "结论是否与引用一致", "是否明确标出没找到的信息"] },
    decision: "查资料和看来源是第一需求时优先试Perplexity；想在同一产品里完成更多创作、文件和语音任务时，再比较ChatGPT。",
  },
};

export const appEditorialGuides: Record<string, AppEditorialGuide> = {
  youtube: {
    verdict: "YouTube不只是娱乐视频：它同时是教程、课程、音乐、直播、创作者订阅和内容发布平台，适合有明确主题地长期学习。",
    plainDefinition: "YouTube是Google旗下的视频平台。你可以不登录直接观看部分内容；登录Google账号后可以订阅频道、保存播放列表、查看历史、评论和发布内容。",
    whyUse: ["系统学习教程、课程和长视频", "订阅可信频道并持续跟进", "观看直播、音乐和创作者内容", "自己上传视频或Shorts"],
    notFor: ["把推荐首页当作完整、客观的信息来源", "用所谓去广告破解版登录自己的Google账号"],
    coreAreas: [
      { name: "首页与推荐", plain: "根据观看和互动记录推荐内容。", example: "主动搜索主题并管理历史，能减少无关推荐。" },
      { name: "订阅", plain: "集中查看你主动关注的频道更新。", example: "把真正有价值的频道加入订阅，而不是依赖首页随机推荐。" },
      { name: "播放列表", plain: "把视频按主题保存成自己的学习清单。", example: "建立‘入门—练习—进阶’三个列表。" },
      { name: "Premium", plain: "付费权益通常包括无广告、后台播放和官方App内离线等，随地区变化。", example: "经常通勤或长期观看时再评估，不等于购买单个频道内容。" },
    ],
    workflows: [
      { title: "把刷视频变成系统学习", situation: "想学一个主题，但首页内容零散。", steps: ["搜索明确课程或系列", "先核查频道背景和更新时间", "把合适内容加入按顺序排列的播放列表"], result: "形成可持续的学习路线，不被单个爆款标题带走。", caution: "观看量高不代表内容准确，重要知识要与教材或官方资料交叉验证。" },
      { title: "管理订阅与通知", situation: "订阅很多频道后仍然找不到真正重要的更新。", steps: ["取消长期不看的订阅", "只为少数关键频道开启铃铛", "定期从订阅页而不是首页开始浏览"], result: "降低推荐算法干扰，更快找到主动选择的内容。", caution: "通知过多会造成新的信息负担，不要为所有频道开启全部通知。" },
      { title: "安全发布自己的视频", situation: "准备上传视频、Shorts或开始直播。", steps: ["先确认可见范围和评论设置", "检查音乐、画面和人物授权", "直播前设置验证、延迟和管理人员"], result: "减少隐私、版权和直播失控风险。", caution: "不要在画面中暴露住址、证件、订单和未授权人物。" },
    ],
    firstTenMinutes: ["确认开发者显示为Google LLC", "登录本人Google账号并检查恢复方式", "关闭或调整不需要的自动播放", "订阅1—3个真正想长期看的频道", "检查历史记录、通知和隐私设置"],
    freeVsPaid: "免费版可以完成观看、订阅、收藏、评论和发布等核心操作。Premium是否值得，主要看你是否频繁观看、是否需要后台播放或官方离线；权益和价格随地区而变化。",
    decision: "需要长视频、教程和系统学习时选择YouTube；只想看短内容可比较TikTok，但不要把两者的推荐流当作事实核验工具。",
  },
  x: {
    verdict: "X适合追踪实时公开信息、专业账号和公共讨论；它的速度很快，但错误、断章取义和假账号也传播得很快。",
    plainDefinition: "X是公开信息与社交讨论平台。你可以关注账号、查看For You和Following信息流、建立Lists、加入Communities或Spaces，也可以使用不同等级的Premium功能。",
    whyUse: ["关注新闻事件和当事方动态", "追踪行业专家、公司和创作者", "用Lists建立自己的信息源", "参与Spaces、Communities和公开讨论"],
    notFor: ["把高转发、高点赞直接当作事实", "在私信中处理付款、验证码或账号恢复"],
    coreAreas: [
      { name: "For You / Following", plain: "前者由系统推荐，后者更接近你主动关注的账号。", example: "查行业动态时先看Following，避免推荐内容混入。" },
      { name: "Lists", plain: "把一组账号放入独立时间线，不必全部关注。", example: "建立‘官方公告’列表，只放公司和机构账号。" },
      { name: "Communities", plain: "围绕特定主题的社区讨论空间。", example: "加入专业社区前先阅读规则和管理员信息。" },
      { name: "Spaces", plain: "实时语音讨论，可收听或参与。", example: "关注活动直播，但把发言观点与正式公告分开。" },
    ],
    workflows: [
      { title: "建立高质量实时信息流", situation: "需要快速看到行业动态，但首页噪音太多。", steps: ["先找到当事方、机构和专业记者", "按主题建立Lists", "重大消息回到原始公告和完整上下文"], result: "得到更可控、更容易核实的实时资料入口。", caution: "认证标记、粉丝数和互动量都不能单独证明账号可靠。" },
      { title: "核查一条热门帖子", situation: "看到一条传播很快的消息，不知道真假。", steps: ["检查账号创建时间、历史内容和原始出处", "搜索更早发布和反方证据", "查看是否有官方公告或完整视频"], result: "把‘有人说’转成可验证的证据链。", caution: "截图可能被裁剪或伪造，优先打开原帖和外部原文。" },
      { title: "保护账号与私信", situation: "准备长期使用、发帖或建立受众。", steps: ["启用二次验证并保存备份码", "限制陌生私信和不必要的可发现性", "定期检查已登录设备和第三方应用"], result: "降低钓鱼、盗号和账号找回失败的风险。", caution: "任何索要验证码、恢复码或付款的‘客服私信’都应视为高风险。" },
    ],
    firstTenMinutes: ["确认打开x.com或X Corp.官方商店条目", "用本人邮箱或手机号注册并保存恢复方式", "开启二次验证并离线保存备份码", "切换Following与For You理解区别", "建立一个只含可靠来源的List"],
    freeVsPaid: "免费版足以浏览、关注、发帖、使用Lists和参与多数公开讨论。Premium有多个等级，功能可能包括编辑、较长内容、降低广告或创作者工具；它与SuperGrok不是同一订阅。",
    decision: "需要实时公开信息和专业账号动态时选择X；如果主要需求是视频学习或短视频娱乐，分别看YouTube和TikTok。",
  },
  tiktok: {
    verdict: "TikTok是面向国际市场的短视频与直播平台，擅长快速发现内容和创作；它与中国大陆的抖音不是同一个产品。",
    plainDefinition: "TikTok以For You推荐流为核心，也提供Following、搜索、创作、直播、私信和账号安全设置。内容、商店展示和功能会受账号地区、年龄、设备与当地规则影响。",
    whyUse: ["浏览国际短视频和趋势", "关注海外创作者与品牌", "制作、发布和直播短内容", "研究不同地区的内容表达"],
    notFor: ["把TikTok账号、抖音账号和内容数据视为互通", "从网盘安装修改版APK或共享陌生账号"],
    coreAreas: [
      { name: "For You", plain: "根据互动和内容信息不断调整的个性化推荐流。", example: "长按不感兴趣、主动搜索和关注会影响后续推荐。" },
      { name: "Following", plain: "查看你主动关注的创作者内容。", example: "想减少随机内容时从Following开始。" },
      { name: "创作", plain: "拍摄、剪辑、配音、特效和发布短视频。", example: "发布前检查音乐授权、封面、可见范围和评论权限。" },
      { name: "Family Pairing", plain: "家长与未成年人账号配对，管理时长和部分安全设置。", example: "未成年人使用前先配置隐私、私信和屏幕时间。" },
    ],
    workflows: [
      { title: "训练一个更有用的推荐流", situation: "刚安装后推荐内容杂乱或不符合兴趣。", steps: ["主动搜索明确主题", "关注少量高质量创作者", "对无关内容使用Not interested并避免无意识停留"], result: "逐步让For You更接近真实兴趣，而不是被初始随机内容占据。", caution: "推荐算法会放大停留和互动，定期检查屏幕时间与关注列表。" },
      { title: "发布第一条短视频", situation: "想尝试创作但不熟悉权限和发布选项。", steps: ["先用草稿完成拍摄和剪辑", "检查音乐、人物和地点信息", "设置可见范围、评论、合拍和下载权限"], result: "在可控范围内完成首次发布，并知道如何撤回或修改。", caution: "草稿只保存在本机时，卸载应用可能丢失；重要素材另行备份。" },
      { title: "保护未成年人和家庭使用", situation: "孩子或青少年准备使用TikTok。", steps: ["确认生日填写真实", "使用Family Pairing连接家长账号", "设置私信、内容过滤、使用时长和夜间提醒"], result: "把默认设置调整为更适合年龄的保护方式。", caution: "技术设置不能替代沟通和陪伴，也不能消除所有陌生人和内容风险。" },
    ],
    firstTenMinutes: ["确认开发者和官方商店条目", "理解TikTok与抖音账号不互通", "检查生日、账号地区与隐私设置", "设置App language和Preferred languages", "调整评论、私信、下载和屏幕时间"],
    freeVsPaid: "普通观看、关注、创作和大多数互动功能可免费使用。直播礼物、商品或其他付费行为属于额外消费，付款前确认年龄、币种、退款和家长控制规则。",
    decision: "偏好短视频、趋势和创作时选择TikTok；需要系统课程和长视频学习时，YouTube通常更合适。",
  },
};

export function getAiEditorialGuide(slug: string) {
  return aiEditorialGuides[slug];
}

export function getAppEditorialGuide(slug: string) {
  return appEditorialGuides[slug];
}
