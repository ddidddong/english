const fs = require('fs');
const path = require('path');

const text = `### 1. 필수 동사 100 (Essential Verbs)
be(이다/있다), have(가지다), do(하다), say(말하다), go(가다), can(할 수 있다), get(얻다/되다), would(~할 것이다), make(만들다), know(알다), will(~할 것이다), think(생각하다), take(가져가다/취하다), see(보다), come(오다), could(할 수 있었다), want(원하다), look(보다), use(사용하다), find(찾다), give(주다), tell(말하다), work(일하다), may(~일지도 모른다), should(~해야 한다), call(부르다/전화하다), try(시도하다), ask(묻다), need(필요하다), feel(느끼다), become(~이 되다), leave(떠나다/남기다), put(놓다), mean(의미하다), keep(유지하다), let(내버려두다), begin(시작하다), seem(~처럼 보이다), help(돕다), talk(이야기하다), turn(돌다/돌리다), start(시작하다), might(~일지도 모른다), show(보여주다), hear(듣다), play(놀다), run(달리다), move(움직이다), like(좋아하다), live(살다), believe(믿다), hold(잡다), bring(가져오다), happen(일어나다), must(~해야 한다), write(쓰다), provide(제공하다), sit(앉다), stand(서다), lose(잃다), pay(지불하다), meet(만나다), include(포함하다), continue(계속하다), set(놓다/맞추다), learn(배우다), change(바꾸다), lead(이끌다), understand(이해하다), watch(지켜보다), follow(따르다), stop(멈추다), create(창조하다), speak(말하다), read(읽다), allow(허락하다), add(더하다), spend(쓰다/소비하다), grow(자라다), open(열다), walk(걷다), win(이기다), offer(제공하다), remember(기억하다), love(사랑하다), consider(고려하다), appear(나타나다), buy(사다), wait(기다리다), serve(제공하다/봉사하다), die(죽다), send(보내다), expect(기대하다), build(짓다), stay(머무르다), fall(떨어지다), cut(자르다), reach(도달하다), kill(죽이다), remain(남다).

### 2. 필수 명사 100 (Essential Nouns)
time(시간), year(년), people(사람들), way(방법/길), day(일/하루), man(남자), thing(것), woman(여자), life(삶), child(아이), world(세계), school(학교), state(상태/국가), family(가족), student(학생), group(그룹), country(나라), problem(문제), hand(손), part(부분), place(장소), case(경우), week(주), company(회사), system(시스템), program(프로그램), question(질문), work(일), government(정부), number(숫자), night(밤), point(요점), home(집), water(물), room(방), mother(어머니), area(지역), money(돈), story(이야기), fact(사실), month(달/월), lot(많음), right(권리/오른쪽), study(공부), book(책), eye(눈), job(직업), word(단어), business(사업), issue(문제/이슈), side(측면), kind(종류), head(머리), house(집), service(서비스), friend(친구), father(아버지), power(힘), hour(시간), game(게임), line(선), end(끝), member(회원), law(법), car(자동차), city(도시), community(지역사회), name(이름), president(대통령/회장), team(팀), minute(분), idea(생각), kid(아이), body(몸), information(정보), back(등/뒤), parent(부모), face(얼굴), others(다른 사람들), level(수준), office(사무실), door(문), health(건강), person(사람), art(예술), war(전쟁), history(역사), party(파티), result(결과), change(변화), morning(아침), reason(이유), research(연구), girl(소녀), guy(남자), moment(순간), air(공기), teacher(선생님), force(힘), education(교육).

### 3. 필수 형용사 100 (Essential Adjectives)
other(다른), new(새로운), good(좋은), high(높은), old(나이 든/오래된), great(위대한/훌륭한), big(큰), American(미국의), small(작은), large(큰), national(국가의), young(젊은), different(다른), black(검은), long(긴), little(작은), important(중요한), political(정치적인), bad(나쁜), white(흰), real(진짜의), best(최고의), right(옳은/오른쪽의), social(사회의), only(유일한), public(공공의), sure(확실한), low(낮은), early(이른), able(할 수 있는), human(인간의), local(지역의), late(늦은), hard(어려운/단단한), major(주요한), better(더 나은), economic(경제의), strong(강한), possible(가능한), whole(전체의), free(자유로운/무료의), military(군사의), true(사실인), federal(연방의), international(국제적인), full(가득 찬), special(특별한), easy(쉬운), clear(분명한), recent(최근의), certain(확실한/어떤), personal(개인의), open(열린), red(빨간), difficult(어려운), available(이용 가능한), likely(~할 것 같은), short(짧은), single(단일의/독신의), medical(의학의), current(현재의), wrong(틀린), private(사적인), past(과거의), foreign(외국의), fine(좋은/벌금), common(공통의/흔한), poor(가난한), natural(자연의), significant(중요한), similar(비슷한), hot(뜨거운), dead(죽은), central(중심의), happy(행복한), serious(심각한), ready(준비된), simple(단순한), left(왼쪽의), physical(신체의), general(일반적인), environmental(환경의), financial(재정적인), blue(파란), democratic(민주적인), dark(어두운), various(다양한), entire(전체의), close(가까운/닫힌), legal(합법적인), religious(종교적인), cold(추운), final(마지막의), main(주요한), green(녹색의), nice(좋은), huge(거대한), popular(인기 있는), traditional(전통적인), cultural(문화의).

### 4. 부사 및 전치사 100 (Adverbs & Prepositions)
up(위로), so(그래서/너무), out(밖으로), just(단지/방금), now(지금), how(어떻게), then(그때/그리고 나서), more(더), also(또한), here(여기에), well(잘), only(오직), very(매우), even(심지어), back(뒤로/다시), there(거기에), down(아래로), still(여전히), in(~안에), as(~로서/~처럼), to(~로), when(언제), never(결코 ~않다), really(정말), most(가장), on(~위에), why(왜), about(~에 대하여), over(~너머), again(다시), where(어디에), right(바로/옳게), off(떨어져서), always(항상), today(오늘), all(모두), far(멀리), long(길게/오래), away(멀리), yet(아직), often(종종), ever(언제나/지금까지), however(그러나), almost(거의), later(나중에), much(많이), once(한번), least(최소한), ago(~전에), together(함께), around(~주위에), already(이미), enough(충분히), both(둘 다), maybe(어쩌면), actually(실제로), probably(아마도), home(집으로), of course(물론), perhaps(아마도), little(거의 없게), else(그 밖에), sometimes(때때로), finally(마침내), less(덜), better(더 잘), early(일찍), especially(특히), either(둘 중 하나), quite(꽤), simply(간단히), nearly(거의), soon(곧), certainly(확실히), quickly(빨리), not(아니다), recently(최근에), before(~전에), usually(보통), thus(그러므로), exactly(정확히), hard(열심히), particularly(특히), pretty(꽤), forward(앞으로), ok(좋아), clearly(분명히), indeed(참으로), rather(오히려), that(그렇게), tonight(오늘밤), close(가까이), suddenly(갑자기), best(가장 잘), instead(대신에), ahead(앞에), fast(빨리), alone(혼자서), eventually(결국), directly(직접적으로).

### 5. 일상 사물 1 100 (Everyday Objects 1)
angle(각도), ant(개미), apple(사과), arch(아치), arm(팔), army(군대), baby(아기), bag(가방), ball(공), band(밴드), basin(세면대/분지), basket(바구니), bath(목욕), bed(침대), bee(벌), bell(종), berry(베리), bird(새), blade(칼날), board(게시판), boat(보트), bone(뼈), boot(부츠), bottle(병), box(상자), boy(소년), brain(뇌), brake(브레이크), branch(나뭇가지), brick(벽돌), bridge(다리), brush(빗/붓), bucket(양동이), bulb(전구), button(단추), cake(케이크), camera(카메라), card(카드), cart(수레), carriage(마차), cat(고양이), chain(사슬), cheese(치즈), chest(가슴/상자), chin(턱), church(교회), circle(원), clock(시계), cloud(구름), coat(외투), collar(깃), comb(빗), cord(끈), cow(소), cup(컵), curtain(커튼), cushion(쿠션), dog(개), door(문), drain(배수구), drawer(서랍), dress(드레스), drop(방울), ear(귀), egg(계란), engine(엔진), eye(눈), face(얼굴), farm(농장), feather(깃털), finger(손가락), fish(물고기), flag(깃발), floor(바닥), fly(파리), foot(발), fork(포크), fowl(가금류), frame(액자/틀), garden(정원), glove(장갑), goat(염소), gun(총), hair(머리카락), hammer(망치), hat(모자), heart(심장), hook(갈고리), horn(뿔/경적), horse(말), hospital(병원), island(섬), jewel(보석), kettle(주전자), key(열쇠), knee(무릎), knife(칼), knot(매듭).

### 6. 일상 사물 2 100 (Everyday Objects 2)
leaf(나뭇잎), leg(다리), library(도서관), line(선), lip(입술), lock(자물쇠), map(지도), match(성냥/시합), monkey(원숭이), moon(달), mouth(입), muscle(근육), nail(손톱/못), neck(목), needle(바늘), nerve(신경), net(그물), nose(코), nut(견과류), orange(오렌지), oven(오븐), parcel(소포), pen(펜), pencil(연필), picture(사진/그림), pig(돼지), pin(핀), pipe(파이프), plane(비행기), plate(접시), plough(쟁기), pocket(주머니), pot(냄비), potato(감자), prison(감옥), pump(펌프), rail(철도), rat(쥐), receipt(영수증), ring(반지), rod(막대), roof(지붕), root(뿌리), sail(돛), scissors(가위), screw(나사), seed(씨앗), sheep(양), shelf(선반), ship(배), shirt(셔츠), shoe(신발), skin(피부), skirt(치마), snake(뱀), sock(양말), spade(삽), sponge(스폰지), spoon(숟가락), spring(용수철/봄), square(정사각형), stamp(우표), star(별), station(역), stem(줄기), stick(막대기), stocking(스타킹), stomach(위장), store(가게), street(거리), sun(태양), table(테이블), tail(꼬리), thread(실), throat(목구멍), thumb(엄지), ticket(표), toe(발가락), tongue(혀), tooth(이빨), town(마을), train(기차), tray(쟁반), tree(나무), trousers(바지), umbrella(우산), wall(벽), watch(손목시계), wheel(바퀴), whip(채찍), whistle(호각), window(창문), wing(날개), wire(철사), worm(벌레), actor(배우), architect(건축가), artist(예술가), baker(제빵사).

### 7. 가족 & 사람 & 신체 100 (Family, People & Body)
grandfather(할아버지), grandmother(할머니), grandparents(조부모), daughter(딸), son(아들), brother(남자형제), sister(여자형제), husband(남편), wife(아내), baby(아기), aunt(이모/고모), uncle(삼촌), cousin(사촌), mother-in-law(시어머니/장모), father-in-law(시아버지/장인), nephew(조카), niece(조카딸), stepmother(새어머니), stepfather(새아버지), stepson(의붓아들), stepdaughter(의붓딸), twin(쌍둥이), adult(어른), teenager(청소년), relative(친척), marriage(결혼), orphan(고아), widow(미망인), head(머리), hair(머리카락), face(얼굴), nose(코), lips(입술), eyes(눈), ears(귀), hands(손), arms(팔), legs(다리), feet(발), neck(목), shoulder(어깨), back(등), chest(가슴), stomach(배/위), knee(무릎), ankle(발목), toe(발가락), finger(손가락), thumb(엄지), nail(손톱), skin(피부), bone(뼈), blood(피), heart(심장), brain(뇌), muscle(근육), tall(키가 큰), short(키가 작은), thin(마른), strong(강한), weak(약한), healthy(건강한), quiet(조용한), merry(즐거운), serious(진지한), clever(영리한), dull(둔한), normal(정상적인), active(활동적인), passive(수동적인), careful(조심스러운), careless(부주의한), truthful(진실한), pleasant(유쾌한), proud(자랑스러운), strange(이상한), beautiful(아름다운), pretty(예쁜), handsome(잘생긴), lovely(사랑스러운), single(독신의), married(결혼한), grown-up(성인), childhood(어린시절), neighbor(이웃), guest(손님), passenger(승객), audience(청중), customer(고객), patient(환자), character(성격/등장인물), owner(주인), secretary(비서), manager(매니저), officer(경찰관/장교), staff(직원), citizen(시민), crowd(군중), youth(청년), expert(전문가).

### 8. 음식 & 옷 100 (Food & Clothes)
breakfast(아침식사), dinner(저녁식사), supper(저녁/야식), meal(식사), tea(차), coffee(커피), milk(우유), juice(주스), soup(수프), meat(고기), fish(물고기/생선), sausage(소시지), cheese(치즈), egg(계란), salad(샐러드), butter(버터), bread(빵), cake(케이크), sugar(설탕), ice-cream(아이스크림), sweets(단것/사탕), chocolate(초콜릿), salt(소금), jam(잼), vegetables(채소), potato(감자), tomato(토마토), cucumber(오이), cabbage(양배추), fruit(과일), apple(사과), lemon(레몬), orange(오렌지), banana(바나나), grape(포도), strawberry(딸기), watermelon(수박), pear(배), peach(복숭아), carrot(당근), onion(양파), garlic(마늘), pepper(후추/고추), beef(소고기), pork(돼지고기), chicken(닭고기), dish(접시/요리), plate(접시), cup(컵), glass(유리잔), spoon(숟가락), fork(포크), knife(칼), bowl(그릇), pot(냄비), pan(프라이팬), restaurant(식당), cafe(카페), menu(메뉴), waiter(종업원), blouse(블라우스), boots(부츠), button(단추), cap(모자), coat(코트), collar(깃), cotton(면), dress(드레스), footwear(신발류), gloves(장갑), jacket(재킷), jeans(청바지), jumper(점퍼), leather(가죽), shirt(셔츠), shoes(신발), shorts(반바지), silk(비단), skirt(치마), sleeve(소매), slippers(슬리퍼), socks(양말), suit(정장), tie(넥타이), trousers(바지), umbrella(우산), fashion(유행), pocket(주머니), raincoat(우비), uniform(유니폼), pattern(무늬), zipper(지퍼), scarf(스카프), sweater(스웨터), belt(벨트), underwear(속옷), ribbon(리본), thread(실), needle(바늘), cloth(천).

### 9. 학교 & 직업 100 (School & Occupations)
textbook(교과서), bookshelf(책장), break(쉬는시간), chalk(분필), chemistry(화학), curriculum(교육과정), drawing(그리기), duster(칠판지우개), education(교육), eraser(지우개), geography(지리학), globe(지구본), history(역사), homework(숙제), lesson(수업), map(지도), mark(점수), math(수학), music(음악), notebook(공책), physics(물리학), test(시험), semester(학기), timetable(시간표), university(대학교), college(대학), subject(과목), biology(생물학), science(과학), language(언어), dictionary(사전), vocabulary(어휘), grammar(문법), grade(성적/학년), classroom(교실), desk(책상), principal(교장), professor(교수), blackboard(칠판), library(도서관), ruler(자), glue(풀), scissors(가위), paper(종이), pencil(연필), pen(펜), actor(배우), architect(건축가), artist(예술가), baker(제빵사), barber(이발사), builder(건축업자), businessman(사업가), butcher(정육점 주인), carpenter(목수), chemist(화학자), cook(요리사), dentist(치과의사), designer(디자이너), director(감독), doctor(의사), driver(운전사), economist(경제학자), editor(편집자), engineer(엔지니어), farmer(농부), fireman(소방관), fisherman(어부), hairdresser(미용사), historian(역사학자), journalist(기자), judge(판사), lawyer(변호사), musician(음악가), nurse(간호사), painter(화가), photographer(사진작가), pilot(조종사), poet(시인), policeman(경찰관), scientist(과학자), shop assistant(점원), singer(가수), surgeon(외과의사), tailor(재단사), translator(번역가), vet(수의사), writer(작가), clerk(점원/사무원), guard(경비원), guide(안내원), mechanic(정비사), model(모델), reporter(기자), sailor(선원), soldier(군인), author(작가), mayor(시장), athlete(운동선수), coach(코치).

### 10. 장소, 교통, 자연 & 날씨 100 (Places, Transport, Nature, Weather)
autumn(가을), spring(봄), summer(여름), winter(겨울), breeze(산들바람), bright(밝은), chilly(쌀쌀한), clear(맑은), cloudless(구름 없는), cloudy(흐린), cold(추운), damp(축축한), dry(건조한), dull(흐린/우중충한), foggy(안개 낀), freezing(몹시 추운), hail(우박), heat(열), hurricane(허리케인), lightning(번개), mild(온화한), mist(안개), rain(비), rainbow(무지개), shower(소나기), sky(하늘), snow(눈), storm(폭풍), sunny(화창한), warm(따뜻한), wet(젖은), wind(바람), village(마을), building(건물), flat(아파트), lift(엘리베이터), stairs(계단), hall(복도/홀), corridor(복도), living room(거실), dining-room(식당방), bedroom(침실), kitchen(주방), bathroom(욕실), balcony(발코니), ceiling(천장), floor(바닥), furniture(가구), garage(차고), airport(공항), station(역), bus(버스), taxi(택시), subway(지하철), flight(비행), journey(여행), trip(여행), ticket(표), platform(플랫폼), luggage(수하물), passport(여권), nature(자연), mountain(산), river(강), lake(호수), sea(바다), ocean(대양), forest(숲), field(들판), hill(언덕), sand(모래), stone(돌), earth(지구/땅), planet(행성), star(별), grass(풀), tree(나무), flower(꽃), leaf(잎), root(뿌리), wood(나무/목재), rock(바위), dirt(흙), mud(진흙), dust(먼지), bridge(다리), park(공원), market(시장), museum(박물관), theater(극장), cinema(영화관), hospital(병원), bank(은행), post office(우체국), factory(공장), church(교회), street(거리), road(길), highway(고속도로), traffic(교통).`;

const lines = text.split('\\n');
const results = [];
let currentCategory = null;

const headerRegex = /^### \\d+\\. (.+)$/;

lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('###')) {
        const match = line.match(headerRegex);
        if (match) {
            currentCategory = {
                title: match[1].trim(),
                words: []
            };
            results.push(currentCategory);
        }
    } else {
        if (currentCategory) {
            // Split by comma followed by optional space, but wait, comma could be inside parentheses? 
            // In the provided text, words are like "be(이다/있다), have(가지다), ..."
            // Just split by ", "
            const items = line.split(', ').filter(i => i.trim() !== '');
            items.forEach(item => {
                const parts = item.match(/^(.+?)\\((.+?)\\)\\.?$/);
                if (parts) {
                    currentCategory.words.push({
                        word: parts[1].trim(),
                        meaning: parts[2].trim()
                    });
                } else {
                    // For any edge cases without parentheses or missing the pattern
                    console.log("Could not parse:", item);
                    const backupMatch = item.split('(');
                    if (backupMatch.length === 2) {
                        currentCategory.words.push({
                            word: backupMatch[0].trim(),
                            meaning: backupMatch[1].replace(')', '').replace('.', '').trim()
                        });
                    } else {
                        currentCategory.words.push({ word: item.replace('.', ''), meaning: '' });
                    }
                }
            });
        }
    }
});

const outputPath = path.join(__dirname, '../src/data/words1000.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log('Successfully wrote 1000 words to', outputPath);
