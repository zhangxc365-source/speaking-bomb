/**
 * Word matching utilities for YCT voice recognition
 */

const NUM_MAP: { [key: string]: string } = {
  '10': '十', '0': '零', '1': '一', '2': '二', '3': '三',
  '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九',
};

// 预编译数字匹配正则，提高性能
const DIGIT_RE = new RegExp(Object.keys(NUM_MAP).sort((a, b) => b.length - a.length).join('|'), 'g');

// ... PHONETIC_GROUPS 保持你的原始配置 (建议清理掉带声调的拼音以提高命中率) ...
const PHONETIC_GROUPS: { [key: string]: string[] } = {
  // YCT1 Numbers & Common
  '一': ['已', '义', '1', 'yi', '医', '亿', '衣', '伊', '仪', '宜', '咦', '一', '乙', '以'],
  '二': ['儿', '耳', '而', '2', 'er', '两', '饿', '二', '而', '入', '耳', '2'],
  '三': ['山', '伞', '3', 'san', '算', '散', '扇', '陕', '衫', '桑', '嗓', '山'],
  '四': ['是', '十', '事', '4', 'si', '死', '似', '寺', '肆', '喜', '四'],
  '五': ['我', '无', '午', '5', 'wu', '舞', '误', '屋', '武', '呜', '五'],
  '六': ['流', '留', '6', 'liu', '路', '录', '楼', '溜', '牛', '六'],
  '七': ['期', '起', '7', 'qi', '气', '齐', '其', '骑', '起', '其', '七'],
  '八': ['吧', '巴', '8', 'ba', '爸', '爬', '拔', '把', '打', '八'],
  '九': ['就', '旧', '9', 'jiu', '酒', '久', '纠', '救', '走', '九'],
  '十': ['是', '时', '石', '10', 'shi', '4', '识', '使', '师', '实', '时', '四', '十'],
  
  // Body Parts
  '头': ['投', '透', 'tou', '偷', '肚', '土', '涂', '头'],
  '目': ['木', '母', 'mu', '亩', '幕', '牧', '沐', '目'],
  '口': ['扣', '寇', 'kou', '哭', '枯', '苦', '后', '虎', '口'],
  '耳': ['二', '儿', 'er', '饿', '而', '尔', '耳'],
  '手': ['首', '收', 'shou', '受', '瘦', '熟', '授', '搜', '手'],
  '足': ['助', '租', 'zu', '族', '足', '自', '祖', '足'],
  '身': ['伸', '深', 'shen', '参', '神', '声', '生', '审', '身'],
  '体': ['地', '低', 'ti', '题', '体', '提', '涕', '体'],
  '鼻': ['笔', '比', 'bi', '避', '币', '鼻'],
  '睛': ['静', '井', 'jing', '经', '镜', '睛'],
  '嘴': ['醉', '罪', 'zui', '最', '追', '嘴'],
  
  // Common Verbs/Words
  '是': ['十', '事', '世', '市', '4', 'shi', '使'],
  '在': ['再', '载', 'zai', '灾', '仔', '最'],
  '好': ['耗', '号', 'hao', '郝', '浩', '毫', '豪', '你好'],
  '号': ['好', '耗', 'hao', '浩', '皓', '豪', '毫', '号码'],
  '爱': ['艾', '碍', 'ai', '矮', '埃'],
  '认': ['人', '任', 'ren'],
  '识': ['十', '是', 'shi'],
  '个': ['歌', '哥', 'ge', '各', '过', '格', '给'],
  '几': ['级', '急', 'ji', '极', '寄', '鸡'],
  '岁': ['随', '睡', 'sui', '谁', '碎', '虽'],
  '天': ['甜', '填', 'tian', '田', '听'],
  '地': ['低', '弟', 'di', '第'],
  '中': ['重', '众', 'zhong', '终'],
  '国': ['果', '郭', 'guo', '过'],
  '大': ['答', '打', 'da', '搭', '达', '带', '单'],
  '小': ['销', '笑', 'xiao', '晓', '效', '校', '削'],
  '人': ['任', '认', 'ren', '仁', '忍', '让'],
  '家': ['价', '加', 'jia', '假'],
  
  // Directions
  '上': ['尚', '双', 'shang', '响', '样'],
  '下': ['侠', '夏', 'xia', '吓', '家'],
  '左': ['作', '坐', 'zuo', '昨', '走'],
  '右': ['又', '有', 'you', '游', '幼'],
  '里': ['力', '理', '礼', 'li', '立', '粒'],
  '外': ['歪', '弯', 'wai', '外', '快', '哇'],
  
  // Food & Objects
  '水': ['睡', '谁', 'shui', '税', '说', '碎'],
  '果': ['过', '国', 'guo', '锅', '郭'],
  '米': ['迷', '眯', 'mi', '密'],
  '面': ['眠', '勉', 'mian', '边', '米', '面条', '免'],
  '糖': ['唐', '躺', '趟', 'tang', '汤', '堂', '烫', '贪', '谈', '摊', '糖果', '白糖'],
  '猫': ['毛', '慢', 'mao', '贸', '帽', '咪'],
  '狗': ['勾', '够', 'gou', '购', '构', '果'],
  '鱼': ['雨', '于', '余', '渔', 'yu', '语', '遇', '雨'],
  '鸟': ['尿', '鸟', 'niao', '袅'],
  '花': ['画', '华', 'hua', '划'],
  '草': ['操', 'cao'],
  '多': ['朵', '夺', 'duo', '跺', '多'],
  '少': ['稍', '哨', 'shao', '烧', '勺', '手'],
  
  // Actions
  '看': ['看', '砍', '槛', 'kan', '刊', '堪'],
  '听': ['听', '挺', '亭', 'ting', '停', '厅', '庭', '听见', '听到', '听得见'],
  '说': ['说', '刷', '熟', 'shuo', '听说', '说话', '说一点'],
  '读': ['读', '独', 'du', '度', '读书', '读者'],
  '写': ['写', '鞋', '雪', 'xie', '谢', '学', '写字', '写作'],
  '喝': ['喝', '盒', 'he', '和'],
  '吃': ['吃', '池', 'chi', '赤'],
  '玩': ['玩', '万', 'wan', '晚'],
  '去': ['去', '屈', 'qu', '取'],
  '回': ['回', '辉', 'hui', '会'],
  
  // People
  '您': ['你', '内', 'nin', '林', '名', '宁'],
  '你': ['您', '尼', 'ni', '拟', '泥', '里', '你', '离', '力'],
  '我': ['五', '喔', 'wo', '握', '窝', '我', '五', '文'],
  '他': ['它', '她', '踏', 'ta', '塔', '它', '大', '塔'],
  '她': ['他', '它', '踏', 'tā', 'ta', '塔', '塌', '踏', '大'],
  '老师': ['老师', '老实', 'lao shi', '老', '师', '捞', '劳', '了'],
  '医生': ['医生', '一胜', 'yi sheng', '医', '生', '一', '一生'],
  
  // Multi-word Aliases (Full Word Checks)
  '再见': ['再见', '在建', 'zai jian', '在', '见', '灾', '件'],
  '谢谢': ['谢谢', '写解', 'xie xie', '谢', '写', '血', '解'],
  '不客气': ['不客气', '不可起', 'bu ke qi', '不', '客', '气', '器'],
  '没关系': ['没关系', '每个细', 'mei guan xi', '没', '关', '系', '席'],
  '学生': ['学生', '学声', 'xue sheng', '雪', '生', '学', '声'],
  '学校': ['学校', '学习', 'xue xiao', '雪', '校', '学', '校'],
  '北京': ['北京', '背景', 'bei jing', '北', '京', '杯', '金'],
  '水果': ['水果', '水过', 'shui guo', '水', '果', '谁', '锅'],
  '苹果': ['苹果', '瓶过', 'ping guo', '平', '果', '瓶', '锅'],
  '因为': ['因为', '音为', 'yin wei', '因', '银伟', '位'],
  '所以': ['所以', '手艺', 'suo yi', '所', '收', '衣'],
  '可爱': ['可爱', 'ke ai', '科', '课', '爱'],
  '漂亮': ['漂亮', '票亮', 'piao liang', '票', '亮', '飘', '量'],
  '医院': ['医院', '一园', 'yi yuan', '医', '院', '一', '圆'],
  '有的': ['有的', '有的儿', '有个'],
  '感冒': ['感冒', '冒', 'gan mao'],
  '休息': ['休息', '休', 'xiu xi'],
  '疼': ['疼', '等', 'teng', '亭'],
  '药': ['药', 'yao'],
  '昨天': ['昨天', '昨', '天', 'zuo tian'],
  '今天': ['今天', '今', '天', 'jin tian'],
  '明天': ['明天', '明', '天', 'ming tian'],
  '商场': ['商场', '场', 'shang chang'],
  '朋友': ['朋友', '朋', '友', 'peng you'],
  '认识': ['认识', '认', '识', 'ren shi'],
  '知道': ['知道', '知', '道', 'zhi dao'],
  '商店': ['商店', '店', 'shang dian'],
  '中国': ['中国', '中', '国', 'zhong guo'],
  '名字': ['名字', '名', '字', 'ming zi'],
  '喜欢': ['喜欢', '喜', '欢', 'xi huan'],
};

/**
 * Normalizes speech transcript
 */
export function normalizeTranscript(text: string | null | undefined): string {
  if (!text) return '';
  // 1. 转小写并去掉标点和空格
  let result = text.toLowerCase().replace(/[，。！？,.!?()（） ]/g, '');
  
  // 2. 将数字转换为汉字
  result = result.replace(DIGIT_RE, (matched) => NUM_MAP[matched]);
  
  return result;
}

/**
 * Calculates match percentage between target and transcript
 */
export function calculateMatchScore(target: string, transcript: string): number {
  const normalizedTarget = normalizeTranscript(target);
  const normalizedTranscript = normalizeTranscript(transcript);
  
  if (!normalizedTarget || !normalizedTranscript) return 0;
  
  // 1. 整体词组匹配（包含词组级别的别名）
  const wordAliases = PHONETIC_GROUPS[target] || [];
  const hasDirectMatch = normalizedTranscript.includes(normalizedTarget) || 
      wordAliases.some(alias => normalizedTranscript.includes(normalizeTranscript(alias)));

  if (hasDirectMatch) return 100;
  
  // 2. 逐字拆解匹配（应对识别不准的情况）
  const targetChars = Array.from(normalizedTarget);
  let matchedCount = 0;
  
  for (const char of targetChars) {
    const charAliases = PHONETIC_GROUPS[char] || [];
    const isCharMatched = normalizedTranscript.includes(char) || 
        charAliases.some(alias => normalizedTranscript.includes(normalizeTranscript(alias)));
    
    if (isCharMatched) {
      matchedCount++;
    }
  }
  
  const score = (matchedCount / targetChars.length) * 100;

  // 返回原始分数，由组件决定最终判定阈值
  return score;
}