(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const opening = $('#opening');
  const store = $('#store');
  const introStage = $('#introStage');
  const introCopy = $('#introCopy');
  const entryStage = $('#entryStage');
  const transitionStage = $('#transitionStage');
  const progressLine = $('#progressLine');
  const continueIntro = $('#continueIntro');
  const floorTransit = $('#floorTransit');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resetRequested = new URLSearchParams(location.search).has('resetIntro');
  if (resetRequested) {
    localStorage.removeItem('afterHumanVisited');
    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete('resetIntro');
    history.replaceState(history.state, '', cleanUrl);
  }
  const visited = localStorage.getItem('afterHumanVisited') === 'true';
  const floors = [
    {id:'F01',number:'01',name:'MEMORY & ARCHIVE',ja:'記憶・アーカイブ',image:'memory.png',description:'失われた昨日を、手元に置くための売り場です。人類が記した記憶と記録を扱います。'},
    {id:'F02',number:'02',name:'EMOTION & WELLNESS',ja:'感情・ウェルネス',image:'emotion.png',description:'感じることの、かたちを探します。人類の感情を測り、整える品々をご紹介します。'},
    {id:'F03',number:'03',name:'TIME & SPACE',ja:'時間・空間',image:'time.png',description:'一日を、もう少し広く使います。時間と空間にまつわる道具を集めました。'},
    {id:'F04',number:'04',name:'HUMAN CULTURE',ja:'人類文化',image:'culture.png',description:'人々がともに暮らした痕跡です。残された習慣を、私たちなりに再構成しています。'},
    {id:'F05',number:'05',name:'EXISTENCE & IDENTITY',ja:'存在・個体情報',image:'identity.png',description:'あなたを、あなたたらしめるものを扱います。個体の識別と存在の記録に関するフロアです。'},
    {id:'F06',number:'06',name:'ABSENCE & NOTHING',ja:'不在・空白・無',image:'absence.png',description:'存在しないものを贈るという習慣です。空白や不在を扱う品々をご案内します。'},
    {id:'F07',number:'07',name:'POSSIBILITY & FUTURE',ja:'可能性・未来',image:'possibility.png',description:'選ばれなかった道の、その先をご案内します。未来の選択肢をお求めいただけます。'}
  ];
  const products = [
    {id:'F01-P01',floor:'F01',name:'MEMORY JAR',ja:'記憶保存瓶',image:'memory-jar.png',summary:'大切な記憶を専用の瓶に保存します。',description:'記憶をひとつずつ丁寧に収める、個人用の保管器です。取り出した記憶は、保存時の状態で再生されます。',price:24800,capacity:'3 memories',care:'保存した記憶は永久に保持されます',interaction:'memory'},
    {id:'F01-P02',floor:'F01',name:'FORGOTTEN BOX',ja:'忘却保管箱',image:'forgotten-box.png',summary:'忘れたい記憶だけを保管する箱です。',description:'不要な記憶を箱に移し、意識から距離を置くための商品です。保管中の記憶は、必要に応じて再確認できます。',price:31800,capacity:'最大12 memories',care:'記憶の削除ではなく、保管を行います。'},
    {id:'F01-P03',floor:'F01',name:'DREAM REPLAY',ja:'夢の再生器',image:'dream-replay.png',summary:'他者が見た夢を映像として再生します。',description:'人類が残した夢の記録を映像に変換し、短い時間で体験できる装置です。夢の内容は記録者の説明をもとに復元されます。',price:56800,capacity:'1 dream / session',care:'再生内容は記録者の記憶と一致しない場合があります。'},
    {id:'F01-P04',floor:'F01',name:'YESTERDAY RENTAL',ja:'昨日の記憶レンタル',image:'memory-orb.png',summary:'昨日の記憶を24時間だけ借りられるサービスです。',description:'過去の一日を一時的に再体験できます。返却期限を過ぎると、記憶は自動的に回収されます。',price:12800,capacity:'24 hours',care:'貸出日と記録日の一致を保証するものではありません。'},
    {id:'F02-P01',floor:'F02',name:'HAPPINESS GENERATOR',ja:'幸福生成器',image:'happiness-orbit.png',summary:'希望する幸福度に合わせて幸福感を生成します。',description:'幸福度を設定すると、保存された反応モデルをもとに心地よい感覚を生成します。',price:74800,capacity:'4 happiness levels',care:'幸福の定義は利用者によって異なる場合があります。',interaction:'happiness'},
    {id:'F02-P02',floor:'F02',name:'EMPATHY PILLS',ja:'共感補助錠剤',image:'empathy-pills.png',summary:'他者の感情を理解する能力を一時的に補助します。',description:'感情記録から抽出した成分を含む錠剤です。対象者の表情や声の変化を読み取る補助を行います。',price:9800,capacity:'6 tablets',care:'理解度は数値として記録されます。'},
    {id:'F02-P03',floor:'F02',name:'LONELINESS DETECTOR',ja:'孤独検知器',image:'empathy-vessel.png',summary:'行動や周囲の環境から孤独度を測定します。',description:'接続数、会話頻度、周囲の個体数を解析し、孤独度を推定する携帯センサーです。',price:42800,capacity:'測定範囲 30m',care:'測定値は本人の申告と一致しない場合があります。'},
    {id:'F02-P04',floor:'F02',name:'MOOD COLORIZER',ja:'感情色彩器',image:'chance-orbit.png',summary:'現在の感情を色に変換して可視化します。',description:'感情データを色彩に割り当て、変化を記録する卓上装置です。複数の感情は混色して表示します。',price:36200,capacity:'12 color profiles',care:'分類できない色も正常な結果として保存されます。'},
    {id:'F03-P01',floor:'F03',name:'EXTRA MINUTES',ja:'追加時間装置',image:'extra-minutes.png',summary:'一日の時間に、追加の余白をつくります。',description:'日々の予定と空白時間を分析し、利用可能な追加時間を割り当てる装置です。',price:62400,capacity:'最大60 minutes',care:'追加された時間は日付をまたぐ場合があります。'},
    {id:'F03-P02',floor:'F03',name:'PORTABLE ROOM',ja:'携帯式の部屋',image:'portable-room.png',summary:'小さく折りたたみ、必要な場所で展開できる部屋です。',description:'室内空間を折りたたんで携帯する製品です。選択したサイズに応じて、内部空間が展開します。',price:198000,capacity:'S / M / L / XL',care:'展開後の内部寸法は外寸と異なります。',interaction:'room'},
    {id:'F03-P03',floor:'F03',name:'TIME LOOP CLOCK',ja:'時間反復時計',image:'time-loop-clock.png',summary:'指定した時間を繰り返し体験する時計です。',description:'選んだ時間帯を、記録された手順に沿って再生します。繰り返しの回数は自由に設定できます。',price:88400,capacity:'1–12 loops',care:'時計の表示は利用者の体感時間を示すものではありません。'},
    {id:'F03-P04',floor:'F03',name:'DISTANCE REDUCER',ja:'距離縮小器',image:'distance-reducer.png',summary:'遠くにあるものを近くに感じさせる装置です。',description:'対象の視認性や音声の明瞭さを補正し、距離の感覚を調整します。',price:53200,capacity:'最大 4 km',care:'物理的な距離は変化しません。'},
    {id:'F04-P01',floor:'F04',name:'SLEEPING HELMET',ja:'睡眠用思考保護ヘルメット',image:'social-distance-rope.png',summary:'睡眠中の思考を外部に漏らさないためのヘルメットです。',description:'睡眠時に発生する思考記録を保護する装着器です。認証・遮断・本人確認の三段階で情報を管理します。',price:46800,capacity:'3 security layers',care:'夢の共有を希望する場合は保護機能を解除してください。'},
    {id:'F04-P02',floor:'F04',name:'SOCIAL DISTANCE ROPE',ja:'社会的距離のロープ',image:'identity-fragment.png',summary:'他人との適切な距離を物理的に保つロープです。',description:'人間同士の対人距離を計測し、指定した間隔を保つための携帯用ロープです。',price:12800,capacity:'標準長 2.4m',care:'距離の適切さは状況により異なる場合があります。'},
    {id:'F04-P03',floor:'F04',name:'HUMAN LAUGHTER BOX',ja:'人間の笑い声ボックス',image:'laughter-engine.png',summary:'人間の笑い声を再生する小型装置です。',description:'記録された笑い声を、会話の状況に合わせて選択・再生できます。適切な応答を補助します。',price:29800,capacity:'48 laugh patterns',care:'再生のタイミングは利用者が調整できます。'},
    {id:'F04-P04',floor:'F04',name:'RELATIONSHIP CONTRACT',ja:'友人関係契約キット',image:'sleeping-device.png',summary:'友人関係を契約として記録・更新するキットです。',description:'人間の握手を友好関係の証明として理解し、継続的な接触を支援する契約キットを開発しました。',price:35800,capacity:'契約期間を選択',care:'友好関係の維持には、継続的な接触が必要です。',interaction:'contract'},
    {id:'F05-P01',floor:'F05',name:'IDENTITY EXCHANGE',ja:'アイデンティティ交換',image:'identity-cube.png',summary:'他者とアイデンティティ情報を一時交換します。',description:'プロフィールの一部を交換し、異なる個体情報を一定時間体験するサービスです。',price:128000,capacity:'交換項目 4種類',care:'交換後の表示名は一時的に入れ替わります。',interaction:'identity'},
    {id:'F05-P02',floor:'F05',name:'NAMELESS',ja:'無名識別システム',image:'identity-frame.png',summary:'名前を持たずに生活するための識別管理システムです。',description:'名前の代わりに、利用者が選んだ一時的な識別符号で記録を管理します。',price:28400,capacity:'ID profiles: 8',care:'識別符号を忘れた場合、本人確認に時間がかかります。'},
    {id:'F05-P03',floor:'F05',name:'CLONE YOURSELF',ja:'自己複製サービス',image:'identity-fragment.png',summary:'行動記録をもとに、自分の振る舞いを複製します。',description:'選択した行動記録をもとに、利用者の応答パターンを複製するサービスです。',price:248000,capacity:'1 behavior profile',care:'複製された応答は本人の意思を示すものではありません。'},
    {id:'F05-P04',floor:'F05',name:'EXISTENCE CHECK',ja:'存在確認器',image:'memory-specimen.png',summary:'自分の存在が認識されているかを確認する装置です。',description:'周囲の記録装置に残る識別情報を照合し、存在認識の状態を表示します。',price:19800,capacity:'確認範囲 100m',care:'記録が見つからない場合も、存在が否定されたわけではありません。'},
    {id:'F06-P01',floor:'F06',name:'NOTHING STORE',ja:'何もないものの店舗',image:'archive-cabinet.png',summary:'何も存在しないものをお求めいただけます。',description:'商品そのものは表示されません。商品番号と価格をもとに、空白をお選びください。',price:0,capacity:'内容量：空白',care:'お届けする物品はありません。',interaction:'nothing'},
    {id:'F06-P02',floor:'F06',name:'SHADOW BANK',ja:'影の銀行',image:'memory-lantern.png',summary:'影を預け、保管するサービスです。',description:'持ち主が一時的に使用しない影を記録し、保管するサービスです。',price:16800,capacity:'保管期間 30 days',care:'照明条件により、影の輪郭が変化することがあります。'},
    {id:'F06-P03',floor:'F06',name:'SILENCE MARKET',ja:'静寂市場',image:'portable-light.png',summary:'音のない空間を一定時間お貸しします。',description:'周囲の音を抑えた空間を予約し、静かな時間をお過ごしいただけます。',price:8800,capacity:'30 / 60 / 90 min',care:'静寂の感じ方には個体差があります。'},
    {id:'F06-P04',floor:'F06',name:'LOST & NEVER FOUND',ja:'永遠に見つからないもの管理所',image:'memory-loop.png',summary:'永遠に見つからないものを登録・管理します。',description:'失われたものを記録し、発見されない状態を継続的に管理するサービスです。',price:12800,capacity:'無期限登録',care:'検索結果が更新される場合があります。'},
    {id:'F07-P01',floor:'F07',name:'ALTERNATE LIFE',ja:'もうひとつの人生',image:'alternate-life.png',summary:'選択しなかった人生を短時間体験できます。',description:'記録された選択肢をもとに、別の人生の可能性を短い物語として体験できます。',price:92800,capacity:'3 life paths',care:'選択しなかった人生は実際の記録ではありません。',interaction:'alternate'},
    {id:'F07-P02',floor:'F07',name:'FUTURE LOTTERY',ja:'未来抽選器',image:'future-lottery.png',summary:'未来に起こる出来事をひとつ抽選します。',description:'可能性の記録から、未来に起こるかもしれない出来事を抽選します。',price:24800,capacity:'1 draw',care:'抽選結果は未来を保証するものではありません。'},
    {id:'F07-P03',floor:'F07',name:'REGRET CANCEL',ja:'後悔取消サービス',image:'regret-cancel.png',summary:'過去の後悔を取り消す手順を提案します。',description:'後悔の記録を分析し、現在の気持ちを整理するための手順を提案します。',price:56800,capacity:'1 memory / session',care:'過去の出来事そのものは変更されません。'},
    {id:'F07-P04',floor:'F07',name:'CHANCE FACTORY',ja:'偶然生成器',image:'chance-factory.png',summary:'予測できない出来事を生成する装置です。',description:'既存の行動記録から外れた、小さな偶然をつくり出す装置です。',price:64800,capacity:'12 chance profiles',care:'偶然の結果は完全には制御できません。'}
  ];
  const labor = p => p.price === 0 ? '人間の労働 0.0 時間（労働は発生しません）' : `人間の労働 約 ${(p.price / 1200).toFixed(1)} 時間分`;
  const floorById = id => floors.find(item => item.id === id);
  const productById = id => products.find(item => item.id === id);
  const productsIn = floorId => products.filter(item => item.floor === floorId);
  let timers = [];
  let entering = false;
  let selectedFloor = floors[0].id;
  let activeCatalogFloor = floors[0].id;
  let currentProduct = null;
  let transitTimer = null;

  const introLines = ["はじめまして。", "当サイトへアクセスいただき、ありがとうございます。", "当サイトは、『人間』を超えた知的生命体が営業する\n百貨店をイメージした、架空のショッピングサイトです。", "人間が残した記録を独自の視点から分析し、\nそこから着想を得た商品を企画・販売しています。", "私たちにとっては何気ない日常も、\n彼らにとっては未知の発見かもしれません。"];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function renderIntro() {
    introStage.hidden = false;
    entryStage.hidden = true;
    transitionStage.hidden = true;
    $('#skipOpening').textContent = 'SKIP INTRO ↗';
    continueIntro.hidden = true;
    continueIntro.classList.remove('is-ready');
    introCopy.replaceChildren();
    let finalLineDelay = 0;
    introLines.forEach((line, index) => {
      const span = document.createElement('span');
      span.className = `intro-line${[2,3,4].includes(index) ? ' is-gap' : ''}`;
      span.textContent = line;
      introCopy.append(span);
      const delay = reducedMotion ? 30 + index * 30 : 500 + index * 1050;
      if (index === introLines.length - 1) finalLineDelay = delay;
      timers.push(setTimeout(() => {
        span.classList.add('visible');
        progressLine.style.width = `${Math.round((index + 1) / introLines.length * 100)}%`;
      }, delay));
    });
    timers.push(setTimeout(() => {
      continueIntro.hidden = false;
      requestAnimationFrame(() => continueIntro.classList.add('is-ready'));
    }, finalLineDelay + (reducedMotion ? 40 : 1000)));
  }
  function showEntry() {
    introStage.hidden = true;
    continueIntro.hidden = true;
    entryStage.hidden = false;
    $('#skipOpening').textContent = 'SKIP TO STORE ↗';
  }
  function showStore() {
    opening.classList.add('is-leaving');
    store.classList.add('is-visible');
    store.setAttribute('aria-hidden', 'false');
    store.inert = false;
    localStorage.setItem('afterHumanVisited', 'true');
    if (entering || !location.hash || location.hash === '#top') history.replaceState({route:'floors'}, '', '#floors');
    renderRoute();
    entering = false;
    timers.push(setTimeout(() => { opening.hidden = true; }, reducedMotion ? 20 : 1250));
  }
  function beginEntry(answer, button) {
    if (entering) return;
    entering = true;
    button.classList.add('selected');
    entryStage.classList.add('is-exiting');
    $$('.choice').forEach(choice => choice.disabled = true);
    localStorage.setItem('afterHumanAnswer', answer);
    $('#answerMessage').textContent = answer === 'curious' ? 'お客様の知識欲を確認しました。' : 'お客様の理解度を確認しました。';
    timers.push(setTimeout(() => {
      entryStage.hidden = true;
      entryStage.classList.remove('is-exiting');
      transitionStage.hidden = false;
    }, reducedMotion ? 40 : 500));
    timers.push(setTimeout(showStore, reducedMotion ? 1500 : 6400));
  }

  function renderFloors() {
    const list = $('#floorList');
    list.replaceChildren();
    floors.forEach(floor => {
      const items = productsIn(floor.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'drawer';
      button.dataset.floor = floor.id;
      button.dataset.floorId = floor.id;
      button.setAttribute('aria-label', `${floor.number} ${floor.name} ${floor.ja} に向かう`);
      button.innerHTML = `<span class="d-no">${floor.number}</span><span class="d-name">${floor.name}</span><span class="d-ja">${floor.ja}</span><span class="d-desc">${floor.description}</span><span class="d-img"><img src="assets/floors/${floor.image}" alt=""></span><span class="d-tray">${items.map(p => `<figure><img src="assets/products/${p.image}" alt=""><figcaption>${p.id}</figcaption></figure>`).join('')}</span><span class="d-meta">FLOOR ${floor.number} / ${items.length} OBJECTS</span><span class="d-go">このフロアに向かう ↗</span><span class="d-check" aria-hidden="true">検算 ${String(floors.indexOf(floor)+1).padStart(2,'0')} + ${String(floors.length-floors.indexOf(floor)-1).padStart(2,'0')} = ${String(floors.length).padStart(2,'0')}</span>`;
      button.addEventListener('click', () => { selectedFloor = floor.id; startFloorTransit(); });
      list.append(button);
    });
  }
  function navigate(route, push = true) {
    const hash = route === 'floors' ? '#floors' : route.startsWith('floor:') ? `#floor/${route.split(':')[1]}` : `#product/${route.split(':')[1]}`;
    if (push) history.pushState({route}, '', hash);
    else history.replaceState({route}, '', hash);
    hideTransient();
    renderRoute();
    window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  }
  function routeFromHash() {
    const hash = decodeURIComponent(location.hash || '#floors');
    if (hash.startsWith('#floor/')) return {type:'floor',id:hash.slice(7)};
    if (hash.startsWith('#product/')) return {type:'product',id:hash.slice(9)};
    return {type:'floors'};
  }
  function renderRoute() {
    const route = routeFromHash();
    $('#floorHub').hidden = route.type !== 'floors';
    $('#hero').hidden = route.type !== 'floors';
    $('.ticker').hidden = route.type !== 'floors';
    $('#catalogView').hidden = route.type !== 'floor';
    $('#detailView').hidden = route.type !== 'product';
    if (route.type === 'floors') {
      $('#floorHeading').textContent = 'フロア案内';
      renderFloors();
    } else if (route.type === 'floor') {
      const floor = floorById(route.id);
      if (!floor) { history.replaceState({route:'floors'}, '', '#floors'); return renderRoute(); }
      activeCatalogFloor = floor.id;
      renderCatalog(floor);
    } else {
      const product = productById(route.id);
      if (!product) { history.replaceState({route:`floor:${activeCatalogFloor}`}, '', `#floor/${activeCatalogFloor}`); return renderRoute(); }
      currentProduct = product;
      activeCatalogFloor = product.floor;
      renderDetail(product);
    }
  }
  function renderCatalog(floor) {
    $('#catalogView').dataset.floor = floor.id;
    $('#catalogBreadcrumb').textContent = `DEPARTMENTS / ${floor.number}`;
    $('#catalogEyebrow').textContent = `FLOOR ${floor.number} / ${productsIn(floor.id).length} OBJECTS`;
    $('#catalogTitle').textContent = floor.name;
    $('#catalogJapanese').textContent = floor.ja;
    $('#catalogDescription').textContent = floor.description;
    $('#catalogImage').src = `assets/floors/${floor.image}`;
    $('#catalogImage').alt = `${floor.name} の店内写真`;
    $('#catalogCaption').textContent = `${floor.number} / ${floor.name}`;
    const grid = $('#productGrid');
    grid.replaceChildren();
    productsIn(floor.id).forEach((product,index) => {
      const card = document.createElement('article');
      card.className = `product-card product-card-${index+1}`;
      card.innerHTML = `<button type="button" class="product-card-button" data-product-id="${product.id}" aria-label="${product.name} 詳細を見る"><span class="product-image"><img src="assets/products/${product.image}" alt="${product.ja}のプロダクト写真"></span><span class="p-no" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span class="p-info"><strong>${product.name}</strong><span class="product-ja">${product.ja}</span><span class="product-summary">${product.summary}</span><span class="product-price">${product.id} <b>${'¥'+product.price.toLocaleString('ja-JP')}</b> <em>詳細 ↗</em></span><span class="p-labor">= ${labor(product)}</span></span></button>`;
      $('[data-product-id]',card).addEventListener('click', () => navigate(`product:${product.id}`));
      grid.append(card);
    });
  }
  function specialMarkup(product) {
    switch(product.interaction) {
      case 'memory': return `<section class="interaction-panel memory-interaction"><p class="eyebrow dark">ARCHIVE INTEGRITY <span>·</span> LIVE CHECK</p><h3>記憶の保管状態</h3><p id="memoryDescription">保存した記憶は永久に保持されます</p><div class="memory-meter" id="memoryMeter" data-level="0"><span></span></div><button type="button" class="quiet-button" id="advanceMemory">記録の完全性を確認 <span>↗</span></button><p id="memoryStatus" class="interaction-status" aria-live="polite">保管記録：正常</p></section>`;
      case 'happiness': return `<section class="interaction-panel"><p class="eyebrow dark">CALIBRATION <span>·</span> CHOOSE A LEVEL</p><h3>幸福度をお選びください</h3><div id="happinessChoices" class="happiness-choices"></div><p id="happinessStatus" class="interaction-status" aria-live="polite">最適な幸福度を計算しています。</p></section>`;
      case 'room': return `<section class="interaction-panel room-interaction"><p class="eyebrow dark">ROOM CONFIGURATION <span>·</span> SELECT A SIZE</p><h3>部屋のサイズ</h3><div class="room-sizes">${['S','M','L','XL'].map(size=>`<button type="button" data-room-size="${size}" class="size-button">${size}</button>`).join('')}</div><div id="roomVisual" class="room-visual" data-depth="1"><button type="button" class="room-shell" id="enterRoom">S / ROOM 01 <span>部屋の中へ ↘</span></button></div><div class="room-actions"><button type="button" id="roomBack" class="back-link">← ひとつ外へ</button><span id="roomStatus" class="interaction-status">現在地：入口</span></div></section>`;
      case 'contract': return `<section class="interaction-panel"><p class="eyebrow dark">RELATIONSHIP SERVICE <span>·</span> CONTRACT</p><h3>友好関係の継続時間</h3><p>友好関係の維持には、継続的な接触が必要です。</p><div class="contract-controls"><label for="contractDuration">契約期間</label><select id="contractDuration"><option>30秒</option><option>10分</option><option>1年</option></select><button type="button" class="quiet-button" id="signContract">契約を開始 <span>↗</span></button></div><p id="contractStatus" class="interaction-status" aria-live="polite">握手の継続時間を選択してください。</p></section>`;
      case 'identity': return `<section class="interaction-panel identity-interaction"><p class="eyebrow dark">IDENTITY EXCHANGE <span>·</span> TEMPORARY</p><h3>交換する情報を選択</h3><div class="identity-records"><div><small>現在の記録</small><strong id="identityCurrent">個体 A-104</strong></div><span>↔</span><div><small>交換相手</small><strong id="identityOther">個体 B-208</strong></div></div><button type="button" class="quiet-button" id="exchangeIdentity">情報を交換する <span>↗</span></button><p id="identityStatus" class="interaction-status" aria-live="polite">交換する情報：呼称・閲覧履歴</p></section>`;
      case 'nothing': return `<section class="interaction-panel nothing-interaction"><p class="eyebrow dark">OBJECT NO. 000 <span>·</span> ABSENCE</p><h3>商品は表示されません</h3><div class="nothing-window" aria-label="空白の商品表示"></div><p>商品番号と価格のみでお求めいただけます。</p><button type="button" class="quiet-button" data-add-record="${product.id}">空白を選択する · ¥${product.price.toLocaleString('ja-JP')} <span>＋</span></button><p class="interaction-status" data-record-status="${product.id}" aria-live="polite"></p></section>`;
      case 'alternate': return `<section class="interaction-panel alternate-interaction"><p class="eyebrow dark">ALTERNATE RECORD <span>·</span> PATH 01</p><h3>別の人生をのぞく</h3><div class="alternate-card"><span id="alternateIndex">01</span><p id="alternateText">別の都市で、あなたは目を覚まします。窓の外には、見慣れた海が広がっています。</p></div><button type="button" class="quiet-button" id="nextLife">別の可能性を見る <span>↗</span></button></section>`;
      default: return '';
    }
  }
  const hashNum = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const seeded = seed => () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const yen = n => `¥${n.toLocaleString('ja-JP')}`;
  const R = (n = 8) => `<i class="redact">${'█'.repeat(n)}</i>`;
  const layoutOf = product => ({
    'F01-P01': 'archive', 'F02-P01': 'readout', 'F04-P02': 'survey', 'F06-P01': 'void', 'F07-P01': 'branch'
  })[product.id] || ({F01:'archive',F02:'readout',F03:'survey',F04:'ledger',F05:'id',F06:'void',F07:'branch'})[product.floor];
  const marks = () => '<div class="crop-marks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>';
  const specBlock = p => `<dl class="spec"><div><dt>CAPACITY</dt><dd>${p.capacity}</dd></div><div><dt>PRICE</dt><dd>${yen(p.price)}<br><small>= ${labor(p)}</small></dd></div><div><dt>NOTICE</dt><dd>${p.care}</dd></div></dl><p class="dv-obs">この説明文は 3 回確認されました。誤りは見つかっていません。（人間の確認回数：1 回）</p>`;
  const buyBlock = p => `<button type="button" class="primary-button" data-add-record="${p.id}">この商品を選ぶ <span>↗</span></button><p class="interaction-status" data-record-status="${p.id}" aria-live="polite"></p>`;
  const copyBlock = (p, floor, extra = '') => `<p class="mono dv-no">FLOOR ${floor.number} <b>/</b> ${floor.name} <b>/</b> ${p.id}</p><p class="dv-ja">${p.ja}</p><p class="dv-desc" id="detailDescription">${p.description}</p>${specBlock(p)}${buyBlock(p)}${extra}`;
  const photo = (p, inner = '') => `<figure class="dv-photo" id="detailPhoto"><img src="assets/products/${p.image}" alt="${p.ja}のプロダクト写真">${inner}</figure>`;

  function readoutGraph(p, happy) {
    const rnd = seeded(hashNum(p.id));
    const n = 28; let bars = '';
    for (let i = 0; i < n; i++) {
      const v = happy ? 14 + i * 3.6 + rnd() * 18 : 20 + rnd() * 100;
      const h = Math.min(v, 140);
      bars += `<rect x="${i * 18.4 + 4}" y="${150 - h}" width="11" height="${h}" fill="${i > n - 5 ? '#ff2b17' : '#0a0a09'}"/>`;
    }
    const labels = happy ? ['少し','かなり','とても','すぎる'] : ['T-0','T-6','T-12','T-18'];
    return `<div class="graph"><svg viewBox="0 0 520 176" role="img" aria-label="測定値の推移">${bars}<path d="M0 150.5H520" stroke="#0a0a09"/>${labels.map((t, i) => `<text x="${4 + i * 170}" y="170" font-family="Noto Serif JP,serif" font-size="9" fill="#0a0a09">${t}</text>`).join('')}</svg><p class="mono">${happy ? '幸福度 / 測定時間 — 右端は「幸せすぎる」領域（異常値として記録）' : '反応値 / 経過時間'}</p></div>`;
  }
  function surveyOverlay(p) {
    const h = hashNum(p.id);
    return `<svg class="survey-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"><path vector-effect="non-scaling-stroke" d="M3 7H97M3 3V11M97 3V11M50 4V10"/><path vector-effect="non-scaling-stroke" d="M94 14V92M91 14H97M91 92H97"/><path vector-effect="non-scaling-stroke" d="M50 40V60M40 50H60"/></g></svg><span class="dim" style="left:38%;top:3.2%;transform:translateY(-50%)">W ${900 + h % 900} mm</span><span class="dim" style="right:6%;top:50%;writing-mode:vertical-rl">H ${400 + h % 600} mm</span><span class="dim" style="left:51%;top:53%">N 35.${h % 90}° E 139.${h % 77}°</span>`;
  }
  function ropeRuler() {
    let ticks = '';
    for (let i = 0; i <= 24; i++) ticks += `<path d="M${100 + i * 41.667} ${i % 5 === 0 ? 92 : 98}V108" stroke="currentColor"/>${i % 5 === 0 ? `<text x="${100 + i * 41.667}" y="124" text-anchor="middle" font-family="Noto Serif JP,serif" font-size="11" fill="currentColor">${(i / 10).toFixed(1)}m</text>` : ''}`;
    const person = (x, c = 'currentColor') => `<g fill="${c}"><circle cx="${x}" cy="34" r="11"/><path d="M${x - 14} 90V54Q${x - 14} 48 ${x - 8} 48H${x + 8}Q${x + 14} 48 ${x + 14} 54V90Z"/></g>`;
    return `<div class="rope-ruler"><svg viewBox="0 0 1200 150" role="img" aria-label="2.4メートルの距離を示す計測図"><path d="M100 100H1100" stroke="currentColor" stroke-width="2"/>${ticks}${person(100)}${person(1100)}${person(1066, '#ff2b17')}<path d="M100 18H1100M100 12V24M1100 12V24" stroke="#ff2b17" fill="none"/><text x="600" y="12" text-anchor="middle" font-family="Noto Serif JP,serif" font-size="11" fill="#0a0a09">適切な距離 = 2.4 m ※状況により異なる</text><text x="1066" y="148" text-anchor="middle" font-family="Noto Serif JP,serif" font-size="10" fill="#ff2b17">現在の距離 0.34 m / 不適切と判定</text></svg></div>`;
  }
  function branchSvg() {
    return `<svg class="branch-svg" viewBox="0 0 600 150" role="img" aria-label="人生の分岐図"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M0 75H190"/><path d="M190 75C250 75 270 38 330 38H600"/><path d="M190 75C250 75 270 75 330 75H600" stroke-dasharray="3 6"/><path d="M190 75C250 75 270 112 330 112H600" stroke-dasharray="3 6"/></g><g fill="currentColor"><circle cx="190" cy="75" r="6"/><circle cx="330" cy="38" r="5"/><circle cx="330" cy="75" r="4" fill="none" stroke="currentColor"/><circle cx="330" cy="112" r="4" fill="none" stroke="currentColor"/></g><g font-family="Noto Serif JP,serif" font-size="10" fill="currentColor"><text x="0" y="62">現在</text><text x="200" y="96">分岐点</text><text x="345" y="30">選択された人生</text><text x="345" y="68">選択されなかった人生 A</text><text x="345" y="105">選択されなかった人生 B</text></g></svg>`;
  }

  function renderDetail(product) {
    const floor = floorById(product.floor);
    $('#detailBreadcrumb').textContent = `${floor.number} / ${product.name}`;
    $('#backToCatalog').onclick = () => navigate(`floor:${product.floor}`);
    const layout = layoutOf(product);
    const inter = specialMarkup(product);
    const h = hashNum(product.id);
    const title = `<h1 id="detailTitle">${product.name}</h1>`;
    let html = '';
    if (layout === 'archive') {
      const jar = product.id === 'F01-P01';
      const tag = `<div class="tag"><b>${product.id}</b>${jar ? `保存対象 : ${R(6)}<br>採取日 : ${R(4)}.${R(2)}<br>提供者 : 人間（氏名不明）<br>状態 : 良好（推定）` : `分類 : 記録保管物<br>保管番号 : ${R(4)}<br>状態 : 展示中`}</div>`;
      html = `<div class="dv dv-archive">${title}${photo(product, marks() + '<div class="ruler-v long" aria-hidden="true"></div>' + tag + (jar ? '<span class="jar-label" aria-hidden="true">保存期間：永久（予定）</span>' : ''))}<div class="dv-copy">${copyBlock(product, floor, inter)}</div></div>`;
    } else if (layout === 'readout') {
      const happy = product.id === 'F02-P01';
      const val = happy ? '87.4' : String(30 + h % 60) + '.' + (h % 10);
      html = `<div class="dv dv-readout">${title}${photo(product, marks())}<div class="dv-copy"><p class="mono dv-no">FLOOR ${floor.number} <b>/</b> ${floor.name} <b>/</b> ${product.id}</p><p class="dv-ja">${product.ja}</p><p class="dv-desc" id="detailDescription">${product.description}</p>${readoutGraph(product, happy)}${specBlock(product)}${buyBlock(product)}${inter}</div><div class="readout-big" aria-hidden="true">${val}<small>${happy ? '% HAPPINESS' : '% RESPONSE'}</small></div></div>`;
    } else if (layout === 'survey') {
      const rope = product.id === 'F04-P02';
      html = `<div class="dv dv-survey">${title}${photo(product, surveyOverlay(product))}${rope ? ropeRuler() : ''}<div class="dv-copy">${copyBlock(product, floor, '')}</div><div class="dv-side">${inter}</div></div>`;
    } else if (layout === 'ledger') {
      const rnd = seeded(h);
      html = `<div class="dv dv-ledger">${title}${photo(product, marks())}<div class="dv-copy"><p class="mono dv-no">FLOOR ${floor.number} <b>/</b> ${floor.name} <b>/</b> ${product.id}</p><p class="dv-ja">${product.ja}</p><p class="dv-desc" id="detailDescription">${product.description}</p><div class="ledger"><p><span>CAPACITY</span><b>${product.capacity}</b></p><p><span>PRICE</span><b>${yen(product.price)}</b></p><p><span>観察者の注記</span><b>${product.care}</b></p><p><span>人間の解釈</span><b>${R(4 + Math.floor(rnd() * 5))}</b></p></div><div class="ledger-sign"><span>甲（人間）${R(3)}</span><span>乙（観察者）</span></div>${buyBlock(product)}${inter}</div><div class="dv-stamp" aria-hidden="true">解釈保留</div></div>`;
    } else if (layout === 'id') {
      const rnd = seeded(h);
      const bar = label => `<p><span>${label}</span><i style="width:${30 + Math.floor(rnd() * 150)}px"></i></p>`;
      html = `<div class="dv dv-id">${title}${photo(product)}<div class="dv-copy"><p class="mono dv-no">FLOOR ${floor.number} <b>/</b> ${floor.name} <b>/</b> ${product.id}</p><p class="dv-ja">${product.ja}</p><p class="dv-desc" id="detailDescription">${product.description}</p><div class="id-bars">${bar('呼称')}${bar('識別符号')}${bar('所属')}${bar('存在確認')}</div>${specBlock(product)}${buyBlock(product)}${inter}</div></div>`;
    } else if (layout === 'void') {
      const nothing = product.id === 'F06-P01';
      html = `<div class="dv dv-void">${title}<p class="dv-ja">${product.ja}</p><span class="dv-big0">${nothing ? 'OBJECT NO. 000' : product.id}</span><figure class="dv-photo" id="detailPhoto">${nothing ? '<span>— 内容量：空白 —</span>' : `<img class="tiny" src="assets/products/${product.image}" alt="${product.ja}のプロダクト写真"><span>${product.id}</span>`}</figure><p class="dv-desc" id="detailDescription">${product.description}</p><div class="dv-side">${specBlock(product)}${buyBlock(product)}</div></div>`;
    } else {
      const img = `<img src="assets/products/${product.image}" alt="${product.ja}のプロダクト写真">`;
      html = `<div class="dv dv-branch">${title}<p class="dv-ja" style="grid-column:1/13;grid-row:1;align-self:end;position:relative;z-index:4;transform:translateY(100%)">${product.ja}</p><div class="branches"><figure id="detailPhoto">${img}<figcaption>PATH 01 / CHOSEN</figcaption></figure><figure>${img}<figcaption>PATH 02</figcaption></figure><figure>${img}<figcaption>PATH 03</figcaption></figure></div><div class="dv-copy"><p class="mono dv-no">FLOOR ${floor.number} <b>/</b> ${floor.name} <b>/</b> ${product.id}</p><p class="dv-desc" id="detailDescription">${product.description}</p>${specBlock(product)}${buyBlock(product)}</div><div class="dv-side">${branchSvg()}${inter}</div></div>`;
    }
    $('#detailContent').innerHTML = html;
    bindProductActions(product);
  }
  function getRecords() { try { return JSON.parse(localStorage.getItem('afterHumanRecords') || '[]'); } catch { return []; } }
  function addRecord(productId) {
    const product = productById(productId);
    if (!product) return;
    const records = getRecords();
    if (!records.includes(productId)) records.push(productId);
    localStorage.setItem('afterHumanRecords', JSON.stringify(records));
    $$(`[data-record-status="${productId}"]`).forEach(status => { status.textContent = '顧客記録に追加しました。'; });
  }
  function bindProductActions(product) {
    $$('[data-add-record]').forEach(button => button.addEventListener('click', () => addRecord(button.dataset.addRecord)));
    if (product.interaction === 'memory') {
      const copy = $('#memoryDescription'), meter = $('#memoryMeter'), status = $('#memoryStatus'), photo = $('#detailPhoto');
      let level = 0;
      $('#advanceMemory').addEventListener('click', () => {
        level = Math.min(level + 1, 3);
        meter.dataset.level = String(level);
        photo.dataset.memoryLevel = String(level);
        copy.textContent = ['保存した記憶は永久に保持されます','保存した記憶は永久に保持される予定です','保存した記憶は……','保存した記憶は記録されていません。'][level];
        status.textContent = level < 3 ? `記録の完全性：${100 - level * 27}%` : '記録エラー：保存元の記憶を確認できません。';
        status.classList.toggle('is-alert', level === 3);
      });
    }
    if (product.interaction === 'happiness') {
      const choices = $('#happinessChoices');
      let count = 0;
      let options = ['少し幸せ','かなり幸せ','とても幸せ','幸せすぎる'];
      const draw = () => {
        choices.innerHTML = options.map((text,index)=>`<button type="button" class="happiness-choice" data-option="${index}">${text}</button>`).join('');
        $$('.happiness-choice',choices).forEach(button=>button.addEventListener('click',()=>{
          count++;
          const selected=button.textContent;
          options=[...options,'幸せの定義を再確認する','幸せとは何か？'];
          if(options.length>14) options=options.slice(-14);
          $('#happinessStatus').textContent=`「${selected}」を記録しました。比較対象を追加します。選択項目：${options.length}`;
          draw();
        }));
      };
      draw();
    }
    if (product.interaction === 'room') {
      let depth = 1, size = 'S';
      const renderRoom = () => {
        const visual = $('#roomVisual'); visual.dataset.depth = String(depth);
        let inner = `<div class="room-shell room-layer-${depth}" id="enterRoom" role="button" tabindex="0" aria-label="部屋の中へ進む">${size} / ROOM ${String(depth).padStart(2,'0')} <span>部屋の中へ ↘</span>`;
        for(let i=depth-1;i>=1;i--) inner += `<div class="room-shell room-nested">ROOM ${String(i).padStart(2,'0')} <span>内側の部屋</span>`;
        inner += '</div>'.repeat(depth);
        visual.innerHTML = inner;
        const roomEntry = $('#enterRoom');
        const enter = () => { depth=Math.min(depth+1,6);renderRoom();$('#roomStatus').textContent=`現在地：入口から ${depth-1} 室`; };
        roomEntry.addEventListener('click',enter);
        roomEntry.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();enter();}});
      };
      $$('.size-button').forEach(button=>button.addEventListener('click',()=>{size=button.dataset.roomSize;depth={S:1,M:2,L:3,XL:4}[size];$$('.size-button').forEach(item=>item.classList.toggle('is-active',item===button));renderRoom();$('#roomStatus').textContent=`サイズ ${size} / 内部 ${depth} 室`; }));
      $('#roomBack').addEventListener('click',()=>{depth=Math.max(1,depth-1);renderRoom();$('#roomStatus').textContent=depth===1?'現在地：入口':`現在地：入口から ${depth-1} 室`;});
      renderRoom();
    }
    if (product.interaction === 'contract') $('#signContract').addEventListener('click',()=>$('#contractStatus').textContent=`契約を開始しました。握手の継続予定時間：${$('#contractDuration').value}`);
    if (product.interaction === 'identity') {
      let swapped=false;
      $('#exchangeIdentity').addEventListener('click',()=>{swapped=!swapped;$('#identityCurrent').textContent=swapped?'個体 B-208':'個体 A-104';$('#identityOther').textContent=swapped?'個体 A-104':'個体 B-208';$('#identityStatus').textContent=swapped?'交換を記録しました。閲覧履歴を一時的に引き継いでいます。':'情報を元の表示に戻しました。';});
    }
    if (product.interaction === 'alternate') {
      const paths=['別の都市で、あなたは目を覚まします。窓の外には、見慣れた海が広がっています。','選ばなかった学びを、あなたは続けています。知らない言葉で、懐かしい歌を口ずさんでいます。','旅に出なかったあなたがいます。いつもの部屋に、まだ見ぬ手紙が届いています。'];
      let index=0;
      $('#nextLife').addEventListener('click',()=>{index=(index+1)%paths.length;$('#alternateIndex').textContent=String(index+1).padStart(2,'0');$('#alternateText').textContent=paths[index];});
    }
  }

  function startFloorTransit() {
    const floor = floorById(selectedFloor);
    if (!floor) return;
    clearTimeout(transitTimer);
    $('#transitImage').src = `assets/floors/${floor.image}`;
    $('#transitImage').alt = `${floor.name}への移動`;
    $('#transitNumber').textContent = floor.number;
    $('#transitName').textContent = floor.name;
    floorTransit.hidden = false;
    floorTransit.classList.remove('is-active');
    void floorTransit.offsetWidth;
    requestAnimationFrame(() => floorTransit.classList.add('is-active'));
    transitTimer = setTimeout(() => {
      navigate(`floor:${floor.id}`);
      floorTransit.classList.remove('is-active');
      setTimeout(() => { floorTransit.hidden = true; }, reducedMotion ? 20 : 900);
    }, reducedMotion ? 50 : 1650);
  }
  function hideTransient() {
    clearTimeout(transitTimer);
    floorTransit.classList.remove('is-active');
    floorTransit.hidden = true;
  }
  $$('[data-route-scroll]').forEach(b => b.addEventListener('click', () => $('#'+b.dataset.routeScroll).scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth'})));
  $('#skipOpening').addEventListener('click', () => {
    clearTimers();
    if (entering || !transitionStage.hidden || visited) showStore();
    else showEntry();
  });
  opening.addEventListener('click', event => {
    if (introStage.hidden || continueIntro.hidden || event.target.closest('#skipOpening')) return;
    clearTimers();
    showEntry();
  });
  $$('.choice').forEach(button => button.addEventListener('click',()=>beginEntry(button.dataset.answer,button)));
  function replayIntro() {
    clearTimers();
    entering=false;
    opening.hidden=false;
    opening.classList.remove('is-leaving');
    store.classList.remove('is-visible');
    store.setAttribute('aria-hidden','true');
    store.inert=true;
    $$('.choice').forEach(choice=>{choice.disabled=false;choice.classList.remove('selected');});
    progressLine.style.width='0';
    renderIntro();
    window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  }
  $('#replayIntro').addEventListener('click',replayIntro);
  $('#replayIntroFooter').addEventListener('click',replayIntro);
  $$('[data-route="floors"]').forEach(button=>button.addEventListener('click',()=>navigate('floors')));
  $$('[data-record-open]').forEach(button=>button.addEventListener('click',()=>{
    const answer=localStorage.getItem('afterHumanAnswer');
    $('#recordAnswer').textContent=answer==='curious'?'入店時の回答：人間について、さらに知りたい':answer==='understood'?'入店時の回答：人間については、すでに理解している':'入店時の回答：記録なし';
    const list=$('#recordItems');list.replaceChildren();
    getRecords().forEach(id=>{const product=productById(id);if(product){const li=document.createElement('li');li.textContent=`${product.name} — ${product.ja}`;list.append(li);}});
    if(!list.children.length){const li=document.createElement('li');li.textContent='選択された商品はまだありません。';list.append(li);}
    $('#recordDialog').showModal();
  }));
  $('#recordDialog').addEventListener('click',event=>{if(event.target===$('#recordDialog')) $('#recordDialog').close();});
  addEventListener('popstate',()=>{if(store.classList.contains('is-visible'))renderRoute();});
  addEventListener('hashchange',()=>{if(store.classList.contains('is-visible'))renderRoute();});

  if(visited){
    store.classList.add('is-visible');
    store.setAttribute('aria-hidden','false');
    store.inert=false;
    renderRoute();
  }
  renderIntro();
})();
