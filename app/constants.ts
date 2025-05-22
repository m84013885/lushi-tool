export const HEAR_MAP = {
    'dl': '德鲁伊',
    'lr': '猎人',
    'fs': '法师',
    'ms': '牧师',
    'sq': '圣骑士',
    'zd': '盗贼',
    'sm': '萨满',
    'ss': '术士',
    'zs': '战士',
    'em': '恶魔猎手',
    'sw': '死亡骑士',
} as const;

export type HeroKey = keyof typeof HEAR_MAP; 