import { YCTWord } from '../types';

/**
 * COMPREHENSIVE YCT VOCABULARY DATA (YCT1 - YCT6)
 * Format: Level|LessonNumber|Chinese|Pinyin|English
 */
const VOCAB_RAW_STRING = `
YCT1|1|你好|nǐ hǎo|hello
YCT1|1|老师|lǎo shī|teacher
YCT1|1|再见|zài jiàn|goodbye
YCT1|1|一|yī|one
YCT1|1|二|èr|two
YCT1|1|三|sān|three
YCT1|1|四|sì|four
YCT1|1|五|wǔ|five
YCT1|1|六|liù|six
YCT1|1|七|qī|seven
YCT1|1|八|bā|eight
YCT1|1|九|jiǔ|nine
YCT1|1|十|shí|ten
YCT1|2|我|wǒ|I
YCT1|2|叫|jiào|to be called
YCT1|2|什么|shén me|what
YCT1|2|认识|rèn shi|to know
YCT1|2|高兴|gāo xìng|glad
YCT1|2|很|hěn|very
YCT1|2|不|bù|no
YCT1|2|吗|ma|question particle
YCT1|2|她|tā|she
YCT1|3|他|tā|he
YCT1|3|是|shì|am/is/are
YCT1|3|哪|nǎ|which
YCT1|3|国|guó|country
YCT1|3|人|rén|person
YCT1|3|谁|shuí|who
YCT1|3|中国人|zhōng guó rén|Chinese people
YCT1|4|爸爸|bà ba|father
YCT1|4|妈妈|mā ma|mother
YCT1|4|哥哥|gē ge|big brother
YCT1|4|姐姐|jiě jie|big sister
YCT1|4|妹妹|mèi mei|little sister
YCT1|4|家|jiā|family
YCT1|4|没有|méi yǒu|don’t have
YCT1|4|有|yǒu|have
YCT1|4|几|jǐ|how many
YCT1|4|口|kǒu|(measure word)
YCT1|4|和|hé|and
YCT1|4|个|gè|(measure word)
YCT1|5|岁|suì|years old
YCT1|5|多大|duō dà|how old
YCT1|5|也|yě|also
YCT1|6|个子|gè zi|height
YCT1|6|小|xiǎo|small
YCT1|6|大|dà|big
YCT1|6|长|cháng|long
YCT1|6|真|zhēn|really
YCT1|6|高|gāo|tall
YCT1|6|鼻子|bí zi|nose
YCT1|6|头发|tóu fa|hair
YCT1|6|眼睛|yǎn jing|eye
YCT1|6|手|shǒu|hand
YCT1|6|耳朵|ěr duo|ear
YCT1|6|的|de|particle
YCT1|7|猫|māo|cat
YCT1|7|狗|gǒu|dog
YCT1|7|鱼|yú|fish
YCT1|7|鸟|niǎo|bird
YCT1|7|这|zhè|this
YCT1|7|那|nà|that
YCT1|7|看|kàn|look
YCT1|7|这儿|zhèr|here
YCT1|7|那儿|nàr|there
YCT1|7|多|duō|many
YCT1|8|学校|xué xiào|school
YCT1|8|商店|shāng diàn|store
YCT1|8|在|zài|at
YCT1|8|谢谢|xiè xie|thank you
YCT1|8|去|qù|go
YCT1|8|你们|nǐ men|you
YCT1|8|我们|wǒ men|we
YCT1|8|哪儿|nǎr|where
YCT1|9|生日|shēng rì|birthday
YCT1|9|星期一|xīng qī yī|Monday
YCT1|9|星期二|xīng qī èr|Tuesday
YCT1|9|星期三|xīng qī sān|Wednesday
YCT1|9|星期四|xīng qī sì|Thursday
YCT1|9|星期五|xīng qī wǔ|Friday
YCT1|9|星期六|xīng qī liù|Saturday
YCT1|9|星期天|xīng qī tiān|Sunday
YCT1|9|月|yuè|month
YCT1|9|号|hào|date
YCT1|9|今天|jīn tiān|today
YCT1|9|星期|xīng qī|week
YCT1|9|明天|míng tiān|tomorrow
YCT1|9|喜欢|xǐ huān|like
YCT1|10|现在|xiàn zài|now
YCT1|10|点|diǎn|o’clock
YCT1|10|分|fēn|minute
YCT1|10|见|jiàn|meet
YCT1|10|早上|zǎo shang|morning
YCT1|11|米饭|mǐ fàn|rice
YCT1|11|面条|miàn tiáo|noodles
YCT1|11|苹果|píng guǒ|apple
YCT1|11|牛奶|niú nǎi|milk
YCT1|11|水|shuǐ|water
YCT1|11|蛋糕|dàn gāo|cake
YCT1|11|吃|chī|eat
YCT1|11|喝|hē|drink
YCT1|11|爱|ài|love
YCT2|1|可以|kě yǐ|may
YCT2|1|坐|zuò|sit
YCT2|1|请|qǐng|please
YCT2|1|不客气|bú kè qi|you’re welcome
YCT2|1|说话|shuō huà|talk
YCT2|1|对不起|duì bu qǐ|I’m sorry
YCT2|1|没关系|méi guān xi|never mind
YCT2|1|不要|bú yào|don’t
YCT2|2|起床|qǐ chuáng|get up
YCT2|2|睡觉|shuì jiào|sleep
YCT2|2|早上|zǎo shang|morning
YCT2|2|晚上|wǎn shang|evening
YCT2|2|到|dào|arrive
YCT2|2|呢|ne|particle
YCT2|2|要|yào|want
YCT2|3|矮|ǎi|short
YCT2|3|床|chuáng|bed
YCT2|3|房间|fáng jiān|room
YCT2|3|电视|diàn shì|TV
YCT2|3|桌子|zhuō zi|table
YCT2|3|椅子|yǐ zi|chair
YCT2|3|铅笔|qiān bǐ|pencil
YCT2|3|书包|shū bāo|schoolbag
YCT2|3|里|lǐ|inside
YCT2|3|上|shàng|on
YCT2|4|红色|hóng sè|red
YCT2|4|黄色|huáng sè|yellow
YCT2|4|绿色|lǜ sè|green
YCT2|4|名字|míng zi|name
YCT2|4|漂亮|piào liang|beautiful
YCT2|4|颜色|yán sè|color
YCT2|4|只|zhī|(measure word)
YCT2|4|两|liǎng|two
YCT2|4|本|běn|(measure word)
YCT2|5|包子|bāo zi|steamed bun
YCT2|5|医生|yī shēng|doctor
YCT2|5|厨师|chú shī|chef
YCT2|5|做饭|zuò fàn|cook
YCT2|5|好吃|hǎo chī|delicious
YCT2|5|会|huì|can
YCT2|5|真|zhēn|really
YCT2|6|钱|qián|money
YCT2|6|茶|chá|tea
YCT2|6|买|mǎi|buy
YCT2|6|多少|duō shǎo|how much
YCT2|6|块|kuài|(measure word)
YCT2|6|杯|bēi|(measure word)
YCT2|7|冷|lěng|cold
YCT2|7|热|rè|hot
YCT2|7|天气|tiān qì|weather
YCT2|7|昨天|zuó tiān|yesterday
YCT2|7|好喝|hǎo hē|good to drink
YCT2|7|怎么样|zěn me yàng|how
YCT2|7|觉得|jué de|feel
YCT2|7|比|bǐ|than
YCT2|7|冰水|bīng shuǐ|ice water
YCT2|8|弟弟|dì di|little brother
YCT2|8|妹妹|mèi mei|little sister
YCT2|8|同学|tóng xué|classmate
YCT2|8|朋友|péng you|friend
YCT2|8|学生|xué shēng|student
YCT2|8|也|yě|also
YCT2|9|水果|shuǐ guǒ|fruit
YCT2|9|了|le|(aspect particle)
YCT2|9|香蕉|xiāng jiāo|banana
YCT2|9|熊猫|xióng māo|panda
YCT2|9|画|huà|draw
YCT2|10|脚|jiǎo|foot
YCT2|10|医院|yī yuàn|hospital
YCT2|10|疼|téng|hurt
YCT2|11|零|líng|zero
YCT2|11|学习|xué xí|study
YCT2|11|汉语|hàn yǔ|Chinese
YCT2|11|玩|wán|play
YCT2|11|分钟|fēn zhōng|minute
YCT2|11|来|lái|come
YCT2|11|年|nián|year
YCT2|11|用|yòng|use
YCT2|11|打电话|dǎ diàn huà|make a call
YCT2|11|以前|yǐ qián|before
YCT3|1|年级|nián jí|grade
YCT3|1|课|kè|lesson
YCT3|1|班|bān|class
YCT3|1|新|xīn|new
YCT3|1|男|nán|male
YCT3|1|女|nǚ|female
YCT3|1|都|dōu|all
YCT3|1|还|hái|also
YCT3|2|运动|yùn dòng|sport
YCT3|2|游泳|yóu yǒng|swim
YCT3|2|打篮球|dǎ lán qiú|play basketball
YCT3|2|踢足球|tī zú qiú|play football
YCT3|2|一起|yì qǐ|together
YCT3|2|欢迎|huān yíng|welcome
YCT3|2|太|tài|too
YCT3|2|每|měi|every
YCT3|3|太阳|tài yáng|sun
YCT3|3|月亮|yuè liang|moon
YCT3|3|跑步|pǎo bù|run
YCT3|3|爷爷|yé ye|grandfather
YCT3|3|奶奶|nǎi nai|grandmother
YCT3|3|唱歌|chàng gē|sing
YCT3|3|跳舞|tiào wǔ|dance
YCT3|3|让|ràng|let
YCT3|4|找|zhǎo|look for
YCT3|4|问题|wèn tí|question
YCT3|4|问|wèn|ask
YCT3|4|回|huí|go back
YCT3|4|您|nín|you (polite)
YCT3|4|喂|wèi|hello (on phone)
YCT3|5|面条儿|miàn tiáo er|noodles
YCT3|5|饺子|jiǎo zi|dumplings
YCT3|5|饿|è|hungry
YCT3|5|饱|bǎo|full
YCT3|5|想|xiǎng|think
YCT3|5|最|zuì|most
YCT3|5|给|gěi|give
YCT3|5|再|zài|again
YCT3|6|衣服|yī fu|clothes
YCT3|6|帮助|bāng zhù|help
YCT3|6|穿|chuān|wear
YCT3|6|鞋|xié|shoes
YCT3|6|自己|zì jǐ|oneself
YCT3|6|能|néng|can
YCT3|7|生日|shēng rì|birthday
YCT3|7|礼物|lǐ wù|gift
YCT3|7|花|huā|flower
YCT3|7|蛋糕|dàn gāo|cake
YCT3|7|快乐|kuài lè|happy
YCT3|7|送|sòng|give
YCT3|7|给|gěi|give/for
YCT3|7|但是|dàn shì|but
YCT3|8|下雪|xià xuě|snow
YCT3|8|听|tīng|listen
YCT3|8|作业|zuò yè|homework
YCT3|8|外面|wài miàn|outside
YCT3|8|下雨|xià yǔ|rain
YCT3|8|出|chū|go out
YCT3|8|别|bié|don’t
YCT3|9|哭|kū|cry
YCT3|9|笑|xiào|smile
YCT3|9|东西|dōng xi|thing
YCT3|9|丢|diū|lose
YCT3|9|到|dào|to/arrive
YCT3|10|老虎|lǎo hǔ|tiger
YCT3|10|胖|pàng|fat
YCT3|10|瘦|shòu|thin
YCT3|10|第一|dì yī|first
YCT3|10|快|kuài|fast
YCT3|10|知道|zhī dào|know
YCT3|10|些|xiē|some
YCT3|10|得|de|(particle)
YCT3|11|水果|shuǐ guǒ|fruit
YCT3|11|糖|táng|sugar
YCT3|11|西瓜|xī guā|watermelon
YCT3|11|鸡蛋|jī dàn|egg
YCT3|11|把|bǎ|(structural particle)
YCT4|1|手机|shǒu jī|mobile phone
YCT4|1|电脑|diàn nǎo|computer
YCT4|1|零|líng|zero
YCT4|1|上网|shàng wǎng|go online
YCT4|1|百|bǎi|hundred
YCT4|1|千|qiān|thousand
YCT4|1|少|shǎo|less
YCT4|2|时间|shí jiān|time
YCT4|2|半|bàn|half
YCT4|2|读|dú|read
YCT4|2|难|nán|difficult
YCT4|2|小时|xiǎo shí|hour
YCT4|2|题|tí|question
YCT4|2|懂|dǒng|understand
YCT4|3|开|kāi|open
YCT4|3|关|guān|close
YCT4|3|门|mén|door
YCT4|3|杯子|bēi zi|cup
YCT4|3|中午|zhōng wǔ|noon
YCT4|3|卖|mài|sell
YCT4|3|完|wán|finish
YCT4|3|就|jiù|then
YCT4|4|身体|shēn tǐ|body
YCT4|4|舒服|shū fu|comfortable
YCT4|4|生病|shēng bìng|be sick
YCT4|4|感冒|gǎn mào|have a cold
YCT4|4|休息|xiū xi|rest
YCT4|4|疼|téng|hurt
YCT4|4|药|yào|medicine
YCT4|4|一点儿|yì diǎn er|a little
YCT4|5|果汁|guǒ zhī|juice
YCT4|5|鱼|yú|fish
YCT4|5|菜|cài|dish
YCT4|5|洗澡|xǐ zǎo|take a shower
YCT4|6|进|jìn|come in
YCT4|6|它|tā|it
YCT4|6|前|qián|front
YCT4|6|后|hòu|behind
YCT4|6|左|zuǒ|left
YCT4|6|右|yòu|right
YCT4|6|教室|jiào shì|classroom
YCT4|6|走|zǒu|walk
YCT4|6|过|guò|ever (past particle)
YCT4|7|公共汽车|gōng gòng qì chē|bus
YCT4|7|动物园|dòng wù yuán|zoo
YCT4|7|车站|chē zhàn|station
YCT4|7|开|kāi|drive
YCT4|7|对|duì|right
YCT4|7|路|lù|road
YCT4|7|远|yuǎn|far
YCT4|7|近|jìn|near
YCT4|7|旁边|páng biān|beside
YCT4|7|条|tiáo|measure word
YCT4|8|雨伞|yǔ sǎn|umbrella
YCT4|8|蓝|lán|blue
YCT4|8|坏|huài|bad
YCT4|8|慢|màn|slow
YCT4|8|迟到|chí dào|be late
YCT4|8|拿|ná|take
YCT4|9|飞机|fēi jī|plane
YCT4|9|累|lèi|tired
YCT4|9|去年|qù nián|last year
YCT4|9|时候|shí hou|time
YCT4|9|次|cì|time
YCT4|10|电影|diàn yǐng|movie
YCT4|10|为什么|wèi shén me|why
YCT4|10|忙|máng|busy
YCT4|10|事情|shì qing|thing
YCT4|10|意思|yì si|meaning
YCT4|10|因为|yīn wèi|because
YCT4|10|所以|suǒ yǐ|so
YCT4|11|裙子|qún zi|dress
YCT4|11|裤子|kù zi|trousers
YCT4|11|可爱|kě ài|cute
YCT4|11|白色|bái sè|white
YCT4|11|黑色|hēi sè|black
YCT4|11|长|zhǎng|grow
YCT4|11|出生|chū shēng|be born
YCT4|11|件|jiàn|measure word
YCT5|1|功夫|gōng fu|kung fu
YCT5|1|非常|fēi cháng|very much
YCT5|1|感兴趣|gǎn xìng qù|be interested in
YCT5|1|飞|fēi|fly
YCT5|1|当然|dāng rán|of course
YCT5|1|特别|tè bié|especially
YCT5|1|厉害|lì hai|awesome
YCT5|1|一样|yí yàng|the same
YCT5|1|帮助|bāng zhù|help
YCT5|1|别人|bié rén|other people
YCT5|2|兔子|tù zi|rabbit
YCT5|2|大象|dà xiàng|elephant
YCT5|2|蝴蝶|hú dié|butterfly
YCT5|2|虫子|chóng zi|insect
YCT5|2|尾巴|wěi ba|tail
YCT5|2|矮|ǎi|short
YCT5|2|短|duǎn|short
YCT5|2|胖|pàng|fat
YCT5|2|更|gèng|more
YCT5|2|讨厌|tǎo yàn|hate
YCT5|2|告诉|gào su|tell
YCT5|2|将来|jiāng lái|future
YCT5|3|楼|lóu|building
YCT5|3|电梯|diàn tī|elevator
YCT5|3|空调|kōng tiáo|air conditioner
YCT5|3|窗户|chuāng hu|window
YCT5|3|沙发|shā fā|sofa
YCT5|3|洗手间|xǐ shǒu jiān|bathroom
YCT5|3|等|děng|wait
YCT5|3|住|zhù|live
YCT5|3|层|céng|floor
YCT5|3|还是|hái shì|or
YCT5|3|放|fàng|put
YCT5|4|邻居|lín jū|neighbor
YCT5|4|习惯|xí guàn|habit
YCT5|4|一会儿|yí huì er|a little while
YCT5|4|以前|yǐ qián|before
YCT5|4|周末|zhōu mò|weekend
YCT5|4|带|dài|take
YCT5|4|奇怪|qí guài|strange
YCT5|4|咖啡|kā fēi|coffee
YCT5|4|弹钢琴|tán gāng qín|play the piano
YCT5|4|公园|gōng yuán|park
YCT5|4|散步|sàn bù|take a walk
YCT5|4|爬山|pá shān|climb mountain
YCT5|5|儿子|ér zi|son
YCT5|5|阿姨|ā yí|aunt
YCT5|5|帅|shuài|handsome
YCT5|5|女儿|nǚ ér|daughter
YCT5|5|年轻|nián qīng|young
YCT5|5|照相|zhào xiàng|take a photo
YCT5|5|张|zhāng|measure word
YCT5|5|照片|zhào piàn|photo
YCT5|5|多么|duō me|so
YCT5|5|孩子|hái zi|child
YCT5|5|叔叔|shū shu|uncle
YCT5|5|孙子|sūn zi|grandson
YCT5|6|站|zhàn|stand
YCT5|6|着|zhe|particle
YCT5|6|戴|dài|wear
YCT5|6|眼镜|yǎn jìng|glasses
YCT5|6|错|cuò|wrong
YCT5|6|大家|dà jiā|everyone
YCT5|6|看见|kàn jiàn|see
YCT5|6|项圈|xiàng quān|collar
YCT5|6|联系|lián xì|contact
YCT5|6|号码|hào mǎ|number
YCT5|7|选择|xuǎn zé|choose
YCT5|7|经常|jīng cháng|often
YCT5|7|锻炼|duàn liàn|exercise
YCT5|7|健康|jiàn kāng|healthy
YCT5|7|心情|xīn qíng|mood
YCT5|7|流汗|liú hàn|sweat
YCT5|7|网球|wǎng qiú|tennis
YCT5|7|排球|pái qiú|volleyball
YCT5|7|乒乓球|pīng pāng qiú|table tennis
YCT5|7|体育馆|tǐ yù guǎn|gym
YCT5|7|不但|bú dàn|not only
YCT5|7|而且|ér qiě|but also
YCT5|8|晴|qíng|sunny
YCT5|8|阴|yīn|cloudy
YCT5|8|刮风|guā fēng|windy
YCT5|8|春|chūn|spring
YCT5|8|夏|xià|summer
YCT5|8|秋|qiū|autumn
YCT5|8|冬|dōng|winter
YCT5|8|变化|biàn huà|change
YCT5|8|一共|yí gòng|altogether
YCT5|8|季节|jì jié|season
YCT5|8|暖和|nuǎn huo|warm
YCT5|8|到处|dào chù|everywhere
YCT5|8|凉快|liáng kuai|cool
YCT5|8|堆雪人|duī xuě rén|make a snowman
YCT5|9|饮料|yǐn liào|drink
YCT5|9|巧克力|qiǎo kè lì|chocolate
YCT5|9|饼干|bǐng gān|cookie
YCT5|9|冰淇淋|bīng qí lín|ice cream
YCT5|9|玩具|wán jù|toy
YCT5|9|超市|chāo shì|supermarket
YCT5|9|手表|shǒu biǎo|watch
YCT5|9|记得|jì de|remember
YCT5|9|已经|yǐ jīng|already
YCT5|9|办法|bàn fǎ|way
YCT5|9|尝|cháng|taste
YCT5|9|便宜|pián yi|cheap
YCT5|9|既|jì|both
YCT5|9|又|yòu|and
YCT5|10|考试|kǎo shì|test
YCT5|10|成绩|chéng jì|score
YCT5|10|聊天儿|liáo tiān er|chat
YCT5|10|复习|fù xí|review
YCT5|10|准备|zhǔn bèi|prepare
YCT5|10|努力|nǔ lì|hard
YCT5|10|一定|yí dìng|definitely
YCT5|10|认真|rèn zhēn|seriously
YCT5|10|练习|liàn xí|practice
YCT5|10|相信|xiāng xìn|believe
YCT5|10|只要|zhǐ yào|as long as
YCT5|10|就|jiù|then
YCT5|11|烤鸭|kǎo yā|roast duck
YCT5|11|服务员|fú wù yuán|waiter
YCT5|11|盘子|pán zi|plate
YCT5|11|碗|wǎn|bowl
YCT5|11|筷子|kuài zi|chopsticks
YCT5|11|盘|pán|measure word
YCT5|11|碗|wǎn|measure word
YCT5|11|叉子|chā zi|fork
YCT5|11|羊肉|yáng ròu|lamb
YCT5|11|汤|tāng|soup
YCT5|11|其他|qí tā|other
YCT5|11|用|yòng|use
YCT5|11|离开|lí kāi|leave
YCT5|11|双|shuāng|measure word
YCT5|12|地铁|dì tiě|subway
YCT5|12|火车|huǒ chē|train
YCT5|12|可能|kě néng|maybe
YCT5|12|担心|dān xīn|worry
YCT5|12|工作|gōng zuò|work
YCT5|12|出差|chū chāi|go on business
YCT5|12|安全|ān quán|safe
YCT5|12|准时|zhǔn shí|on time
YCT5|12|或者|huò zhě|or
YCT5|12|方便|fāng biàn|convenient
YCT5|12|如果|rú guǒ|if
YCT5|12|那么|nà me|then
YCT5|13|刷牙|shuā yá|brush teeth
YCT5|13|护士|hù shi|nurse
YCT5|13|肚子|dù zi|stomach
YCT5|13|发烧|fā shāo|have a fever
YCT5|13|打针|dǎ zhēn|get an injection
YCT5|13|补牙|bǔ yá|fix a tooth
YCT5|13|先|xiān|first
YCT5|13|教|jiāo|teach
YCT5|13|突然|tū rán|suddenly
YCT5|13|马上|mǎ shàng|immediately
YCT5|13|开药|kāi yào|prescribe medicine
YCT5|13|一直|yì zhí|always
YCT5|13|躺|tǎng|lie
YCT5|14|地图|dì tú|map
YCT5|14|小笼包|xiǎo lóng bāo|soup dumplings
YCT5|14|长城|cháng chéng|Great Wall
YCT5|14|寒假|hán jià|winter holiday
YCT5|14|旅游|lǚ yóu|travel
YCT5|14|打算|dǎ suan|plan
YCT5|14|南方|nán fāng|south
YCT5|14|北方|běi fāng|north
YCT5|14|除了|chú le|except
YCT5|14|有名|yǒu míng|famous
YCT5|14|介绍|jiè shào|introduce
YCT5|14|暑假|shǔ jià|summer holiday
YCT5|14|然后|rán hòu|then
YCT6|1|勇敢|yǒng gǎn|brave
YCT6|1|聪明|cōng ming|clever
YCT6|1|另外|lìng wài|besides
YCT6|1|属|shǔ|be born in the year of
YCT6|1|收到|shōu dào|receive
YCT6|1|祝贺|zhù hè|congratulate
YCT6|1|初中|chū zhōng|junior high school
YCT6|1|挂|guà|hang
YCT6|1|节日|jié rì|festival
YCT6|1|猴子|hóu zi|monkey
YCT6|1|毕业|bì yè|graduate
YCT6|1|信封|xìn fēng|envelope
YCT6|1|春节|chūn jié|Spring Festival
YCT6|1|灯笼|dēng long|lantern
YCT6|2|容易|róng yì|easy
YCT6|2|刚才|gāng cái|just now
YCT6|2|讲|jiǎng|explain
YCT6|2|明白|míng bai|understand
YCT6|2|骑|qí|ride
YCT6|2|希望|xī wàng|hope
YCT6|2|参加|cān jiā|take part in
YCT6|2|万|wàn|ten thousand
YCT6|2|加|jiā|add
YCT6|2|减|jiǎn|minus
YCT6|2|数学|shù xué|math
YCT6|2|自行车|zì xíng chē|bike
YCT6|2|比赛|bǐ sài|competition
YCT6|3|醒|xǐng|wake up
YCT6|3|刻|kè|quarter
YCT6|3|响|xǐng|ring
YCT6|3|开会|kāi huì|have a meeting
YCT6|3|着急|zháo jí|worried
YCT6|3|上班|shàng bān|go to work
YCT6|3|以为|yǐ wéi|think
YCT6|3|闹钟|nào zhōng|alarm clock
YCT6|3|安静|ān jìng|quiet
YCT6|3|起来|qǐ lai|get up
YCT6|3|校园|xiào yuán|campus
YCT6|3|树|shù|tree
YCT6|3|声音|shēng yīn|sound
YCT6|3|来得及|lái de jí|there's still time
YCT6|3|正在|zhèng zài|in the process of
YCT6|3|一边|yì biān|at the same time
YCT6|4|面粉|miàn fěn|flour
YCT6|4|接|jiē|pick up
YCT6|4|够|gòu|enough
YCT6|4|打扫|dǎ sǎo|clean
YCT6|4|干净|gān jìng|clean
YCT6|4|修剪|xiū jiǎn|trim
YCT6|4|照顾|zhào gù|take care of
YCT6|4|睡着|shuì zháo|fall asleep
YCT6|4|互相|hù xiāng|each other
YCT6|4|生活|shēng huó|life
YCT6|4|斤|jīn|jin
YCT6|4|葡萄|pú tao|grape
YCT6|4|草地|cǎo dì|lawn
YCT6|4|一下|yì xià|once/a bit
YCT6|5|表扬|biǎo yáng|praise
YCT6|5|句子|jù zi|sentence
YCT6|5|有意思|yǒu yì si|interesting
YCT6|5|从|cóng|from
YCT6|5|马虎|mǎ hu|careless
YCT6|5|才|cái|just
YCT6|5|忘记|wàng jì|forget
YCT6|5|错|cuò|wrong
YCT6|5|渴|kě|thirsty
YCT6|5|停|tíng|stop
YCT6|5|想起来|xiǎng qi lai|remember/recall
YCT6|5|地|de|(structural particle)
YCT6|5|钥匙|yào shi|key
YCT6|5|生气|shēng qì|angry
YCT6|6|警察|jǐng chá|police
YCT6|6|售票员|shòu piào yuán|ticket seller
YCT6|6|记者|jì zhě|reporter
YCT6|6|演员|yǎn yuán|actor
YCT6|6|表演|biǎo yǎn|perform
YCT6|6|节目|jié mù|program
YCT6|6|猜|cāi|guess
YCT6|6|电灯|diàn dēng|electric light
YCT6|6|当|dāng|be
YCT6|6|重要|zhòng yào|important
YCT6|6|新闻|xīn wén|news
YCT6|6|应该|yīng gāi|should
YCT6|6|看见|kàn jiàn|see
YCT6|7|词典|cí diǎn|dictionary
YCT6|7|脸|liǎn|face
YCT6|7|圆|yuán|round
YCT6|7|先生|xiān sheng|sir
YCT6|7|双胞胎|shuāng bāo tāi|twins
YCT6|7|儿童车|ér tóng chē|baby stroller
YCT6|7|还|huán|return
YCT6|7|借|jiè|borrow
YCT6|7|页|yè|page
YCT6|7|俩|liǎ|two
YCT6|7|像|xiàng|like
YCT6|7|虽然|suī rán|although
YCT6|7|但是|dàn shì|but
YCT6|7|牌子|pái zi|sign
YCT6|7|为了|wèi le|for
YCT6|8|被|bèi|by
YCT6|8|又|yòu|again
YCT6|8|鱼缸|yú gāng|fish tank
YCT6|8|种|zhǒng|kind
YCT6|8|最近|zuì jìn|recently
YCT6|8|游戏|yóu xì|game
YCT6|8|批评|pī píng|criticize
YCT6|8|决定|jué dìng|decide
YCT6|8|开始|kāi shǐ|start
YCT6|8|破|pò|broken
YCT6|8|难过|nán guò|sad
YCT6|9|图书馆|tú shū guǎn|library
YCT6|9|报纸|bào zhǐ|newspaper
YCT6|9|杂志|zá zhì|magazine
YCT6|9|超人|chāo rén|superman
YCT6|9|搬家|bān jiā|move house
YCT6|9|附近|fù jìn|nearby
YCT6|9|地址|dì zhǐ|address
YCT6|9|电子邮件|diàn zǐ yóu jiàn|email
YCT6|9|迷路|mí lù|get lost
YCT6|9|出发|chū fā|set off
YCT6|9|见面|jiàn miàn|meet
YCT6|9|行|xíng|OK
YCT6|9|故事|gù shi|story
YCT6|9|力气|lì qi|strength
YCT6|9|老|lǎo|old
YCT6|10|月饼|yuè bǐng|mooncake
YCT6|10|大海|dà hǎi|sea
YCT6|10|草原|cǎo yuán|grassland
YCT6|10|云|yún|cloud
YCT6|10|骑马|qí mǎ|ride a horse
YCT6|10|星星|xīng xing|star
YCT6|10|离|lí|away from
YCT6|10|大概|dà gài|about
YCT6|10|公里|gōng lǐ|kilometer
YCT6|10|国家|guó jiā|country
YCT6|11|元|yuán|yuan
YCT6|11|贵|guì|expensive
YCT6|11|花|huā|spend
YCT6|11|帽子|mào zi|hat
YCT6|11|换|huàn|change
YCT6|11|旧|jiù|old
YCT6|11|试|shì|try
YCT6|11|合适|hé shì|suitable
YCT6|11|辆|liàng|measure word
YCT6|11|为|wèi|for
YCT6|11|紧张|jǐn zhāng|nervous
YCT6|11|敢|gǎn|dare
YCT6|11|害怕|hài pà|afraid
YCT6|12|注意|zhù yì|pay attention
YCT6|12|记住|jì zhù|remember
YCT6|12|身|shēn|measure word
YCT6|12|比如|bǐ rú|for example
YCT6|12|礼貌|lǐ mào|polite
YCT6|12|必须|bì xū|must
YCT6|12|小心|xiǎo xīn|careful
YCT6|12|地方|dì fang|place
YCT6|12|危险|wēi xiǎn|dangerous
YCT6|12|脱|tuō|take off
YCT6|12|排队|pái duì|line up
YCT6|12|中间|zhōng jiān|middle
YCT6|13|辣|là|spicy
YCT6|13|甜|tián|sweet
YCT6|13|坚持|jiān chí|insist
YCT6|13|盒|hé|measure word
YCT6|13|同意|tóng yì|agree
YCT6|13|讨论|tǎo lùn|discuss
YCT6|13|冰箱|bīng xiāng|refrigerator
YCT6|13|西红柿|xī hóng shì|tomato
YCT6|13|瘦|shòu|thin
YCT6|13|糖|táng|sugar
YCT6|14|打扰|dǎ rǎo|excuse me
YCT6|14|参观|cān guān|visit
YCT6|14|熟悉|shú xi|familiar
YCT6|14|往|wǎng|toward
YCT6|14|转|zhuǎn|turn
YCT6|14|关于|guān yú|about
YCT6|14|知识|zhī shi|knowledge
YCT6|14|清楚|qīng chu|clear
YCT6|14|小姐|xiǎo jie|Miss
YCT6|14|东|dōng|east
YCT6|14|西|xī|west
YCT6|14|竹子|zhú zi|bamboo
YCT6|14|有的|yǒu de|some
`;

export const YCT_WORDS: YCTWord[] = VOCAB_RAW_STRING
  .trim()
  .split('\n')
  .filter(line => line.includes('|'))
  .map(line => {
    const [level, lessonNum, chinese, pinyin, english] = line.trim().split('|');
    return {
      level: level.trim(),
      lesson: `Lesson ${lessonNum.trim()}`,
      chinese: chinese.trim(),
      pinyin: pinyin.trim(),
      english: english.trim()
    };
  });
