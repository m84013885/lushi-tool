"use client"

import { useState, useEffect } from "react";
import { copyToClipboard } from './utils'
import ConfirmModal from './components/confirmModal'
import Toast from './components/toast'
import Detail from './components/detail'
import AddCardModal from './components/addCardModal'
import EditCardModal from './components/editCardModal'
import ShareCard from './components/shareCard'
import { HEAR_MAP } from './constants'

const initialList = [
  {
    name: "德鲁伊",
    win: 0,
    lose: 0,
  },
  {
    name: "猎人",
    win: 0,
    lose: 0,
  },
  {
    name: "法师",
    win: 0,
    lose: 0,
  },
  {
    name: "牧师",
    win: 0,
    lose: 0,
  },
  {
    name: "圣骑士",
    win: 0,
    lose: 0,
  },
  {
    name: "盗贼",
    win: 0,
    lose: 0,
  },
  {
    name: "萨满",
    win: 0,
    lose: 0,
  },
  {
    name: "术士",
    win: 0,
    lose: 0,
  },
  {
    name: "战士",
    win: 0,
    lose: 0,
  },
  {
    name: "恶魔猎手",
    win: 0,
    lose: 0,
  },
  {
    name: "死亡骑士",
    win: 0,
    lose: 0,
  },
];

interface Card {
  name: string;
  hero: string;
  list: {
    name: string;
    win: number;
    lose: number;
  }[];
}

// 定义压缩数据的类型
interface CompressedListItem {
  n: string;  // name
  w: number;  // win
  l: number;  // lose
}

interface CompressedCard {
  n: string;  // name
  h: string;  // hero
  l: CompressedListItem[];  // list
}

// 压缩数据
const compressData = (cards: Card[]) => {
  return cards.map(card => {
    // 压缩每个卡组的数据
    const compressedList = card.list
      .map(item => {
        // 只保存非零数据
        if (item.win === 0 && item.lose === 0) return null;
        return {
          n: item.name, // 使用短键名
          w: item.win,
          l: item.lose
        };
      })
      .filter((item): item is CompressedListItem => item !== null); // 移除空数据

    return {
      n: card.name, // 使用短键名
      h: card.hero, // 使用短键名
      l: compressedList // 使用短键名
    };
  });
};

// 解压数据
const decompressData = (compressedCards: CompressedCard[]): Card[] => {
  return compressedCards.map(compressedCard => {
    // 创建完整的列表，包含所有职业
    const fullList = initialList.map(defaultItem => {
      // 查找压缩数据中是否存在该职业的数据
      const compressedItem = compressedCard.l.find(item => item.n === defaultItem.name);
      return compressedItem ? {
        name: compressedItem.n,
        win: compressedItem.w,
        lose: compressedItem.l
      } : defaultItem;
    });

    return {
      name: compressedCard.n,
      hero: compressedCard.h,
      list: fullList
    };
  });
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCards = localStorage.getItem('hearthstone-stats');
      if (savedCards) {
        try {
          const parsedCards = JSON.parse(savedCards);
          if (Array.isArray(parsedCards) && parsedCards.every(card =>
            typeof card === 'object' &&
            'name' in card &&
            'hero' in card &&
            'list' in card &&
            Array.isArray(card.list)
          )) {
            return parsedCards;
          }
        } catch (error) {
          console.error('Failed to parse saved data:', error);
        }
      }
    }
    return [{
      name: '默认卡组',
      hero: '德鲁伊',
      list: initialList
    }];
  });

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [importValue, setImportValue] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [cardToEdit, setCardToEdit] = useState<number | null>(null);
  const [shareCardIndex, setShareCardIndex] = useState<number | null>(null);

  // 监听 cards 变化，保存到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hearthstone-stats', JSON.stringify(cards));
    }
  }, [cards]);

  // 计算总场数和总胜率
  const calculateTotalStats = () => {
    const totalStats = cards.reduce((acc, card) => {
      const cardTotal = card.list.reduce((sum, item) => sum + item.win + item.lose, 0);
      const cardWins = card.list.reduce((sum, item) => sum + item.win, 0);
      return {
        total: acc.total + cardTotal,
        wins: acc.wins + cardWins
      };
    }, { total: 0, wins: 0 });

    const winRate = totalStats.total === 0 ? '0%' : `${((totalStats.wins / totalStats.total) * 100).toFixed(1)}%`;
    return { total: totalStats.total, winRate };
  };

  const { total, winRate } = calculateTotalStats();

  // 导出数据为 base64
  const exportData = () => {
    const compressedCards = compressData(cards);
    const jsonString = JSON.stringify(compressedCards);
    const base64 = btoa(encodeURIComponent(jsonString));
    copyToClipboard(base64).then(success => {
      if (success) {
        setMessage('数据已复制到剪贴板');
      } else {
        setMessage('复制失败，请手动复制');
      }
    });
  };

  // 导入数据
  const importData = () => {
    try {
      const jsonString = decodeURIComponent(atob(importValue));
      const compressedCards = JSON.parse(jsonString);

      if (!Array.isArray(compressedCards) || !compressedCards.every(card =>
        typeof card === 'object' &&
        'n' in card &&
        'h' in card &&
        'l' in card &&
        Array.isArray(card.l)
      )) {
        throw new Error('数据格式不正确');
      }

      const newCards = decompressData(compressedCards);
      setCards(newCards);
      setImportValue('');
      setMessage('数据导入成功');
    } catch (error) {
      setMessage('导入失败：数据格式不正确');
      console.error('Import error:', error);
    }
  };

  // 短数据导入
  const importShortData = () => {
    try {
      const searchParams = new URLSearchParams(importValue);
      const name = decodeURIComponent(searchParams.get('n') || '');
      const hero = searchParams.get('z') || '';
      const data = searchParams.get('data') || '';
      if (!name || !hero || !data) throw new Error('参数不完整');
      if (data.length !== initialList.length * 2) throw new Error('数据长度不符');
      const list = initialList.map((item, idx) => {
        const win = parseInt(data[idx * 2]) || 0;
        const lose = parseInt(data[idx * 2 + 1]) || 0;
        return { name: item.name, win, lose };
      });
      setCards([{ name, hero, list }]);
      setImportValue('');
      setMessage('短数据导入成功');
      return true;
    } catch (e) {
      return false;
    }
  };

  // 清除所有数据
  const clearAllData = () => {
    setCards([{
      name: '默认卡组',
      hero: '德鲁伊',
      list: initialList
    }]);
    setMessage('数据已清除');
  };

  // 添加新卡组
  const addNewCard = (cardName: string, cardHero: string) => {
    setCards(prevCards => [...prevCards, {
      name: cardName,
      hero: cardHero,
      list: initialList
    }]);
  };

  // 删除卡组
  const deleteCard = (index: number) => {
    setCards(prevCards => prevCards.filter((_, i) => i !== index));
    if (activeCardIndex >= index && activeCardIndex > 0) {
      setActiveCardIndex(activeCardIndex - 1);
    }
    setMessage('卡组已删除');
  };

  // 编辑卡组
  const editCard = (index: number, newName: string, newHero: string) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = {
        ...newCards[index],
        name: newName,
        hero: newHero
      };
      return newCards;
    });
    setMessage('卡组已更新');
  };

  const exportShortData = () => {
    const card = cards[activeCardIndex];
    const name = encodeURIComponent(card.name);
    const hero = card.hero; // 这里用英文缩写
    // 胜负数据拼接
    const data = card.list.map(item => `${item.win}${item.lose}`).join('');
    const param = `n=${name}&z=${hero}&data=${data}`;
    const base64 = btoa(param);
    copyToClipboard(base64).then(success => {
      setMessage(success ? '短数据（base64）已复制到剪贴板' : '复制失败，请手动复制');
    });
  };

  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className={`fixed top-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg z-10 transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                (document.getElementById('addCardModal') as HTMLDialogElement)?.showModal()
              }}
              className="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加卡组
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">导入数据</h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                placeholder="粘贴数据"
                className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
              <button
                onClick={() => {
                  if (!importShortData()) {
                    importData();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                导入
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">导出数据</h2>
            <button
              onClick={exportData}
              className="w-full sm:w-auto px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              复制数据
            </button>
            <button
              onClick={exportShortData}
              className="w-full sm:w-auto px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              导出短数据
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                (document.getElementById('confirmModal') as HTMLDialogElement)?.showModal()
              }}
              className="w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              清除数据
            </button>
          </div>
        </header>
        {/* 添加切换按钮 */}
        <button
          onClick={() => setIsHeaderVisible(!isHeaderVisible)}
          className="fixed top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center w-10 h-10"
          aria-label={isHeaderVisible ? '隐藏头部' : '显示头部'}
        >
          <div className={`transform transition-transform duration-300 ${isHeaderVisible ? 'rotate-180' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-gray-600"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>
        {/* 调整占位 div 的高度，只在 header 可见时显示 */}
        <div className={`transition-all duration-300 ${isHeaderVisible ? 'h-32 sm:h-16' : 'h-0'}`}></div>
        <main className="flex flex-row flex-wrap gap-[32px] row-start-2 items-start justify-center w-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card w-72 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow relative group"
            >
              <div
                className="card-body cursor-pointer"
                onClick={() => {
                  setActiveCardIndex(index);
                  (document.getElementById('detail-drawer') as HTMLInputElement).checked = true;
                }}
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardToEdit(index);
                      (document.getElementById('editCardModal') as HTMLDialogElement)?.showModal();
                    }}
                    className="btn btn-ghost btn-sm btn-circle text-info hover:bg-info/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardToDelete(index);
                      (document.getElementById('deleteCardModal') as HTMLDialogElement)?.showModal();
                    }}
                    className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareCardIndex(index);
                      (document.getElementById('share-drawer') as HTMLInputElement).checked = true;
                    }}
                    className="btn btn-ghost btn-sm btn-circle text-success hover:bg-success/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm-9 8a7 7 0 1114 0H6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <h2 className="card-title">
                  {card.name}
                  <div className="badge badge-primary">{HEAR_MAP[card.hero as keyof typeof HEAR_MAP]}</div>
                </h2>
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title">总场数</div>
                    <div className="stat-value text-primary">
                      {card.list.reduce((acc, curr) => acc + curr.win + curr.lose, 0)}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">胜率</div>
                    <div className="stat-value text-secondary">
                      {(() => {
                        const total = card.list.reduce((acc, curr) => acc + curr.win + curr.lose, 0);
                        const wins = card.list.reduce((acc, curr) => acc + curr.win, 0);
                        return total === 0 ? '0%' : `${((wins / total) * 100).toFixed(1)}%`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
        {/* 再写一个左边的抽屉组件 */}
        <div className="drawer drawer-end">
          <input
            id="left-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-side z-50">
            <label
              htmlFor="detail-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu p-4 w-2/3 sm:w-2/3 md:w-1/2 min-h-full bg-base-200 text-base-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {cards[activeCardIndex]?.name} ({HEAR_MAP[cards[activeCardIndex]?.hero as keyof typeof HEAR_MAP]})
                </h2>
                <button
                  onClick={() => {
                    (document.getElementById('detail-drawer') as HTMLInputElement).checked = false;
                  }}
                  className="absolute top-2 right-2 btn btn-ghost btn-circle btn-sm z-10"
                  aria-label="关闭"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ShareCard
                cardName={cards[activeCardIndex].name}
                hero={cards[activeCardIndex].hero}
                list={cards[activeCardIndex].list}
              />
            </div>
          </div>
        </div>
        {/* 抽屉组件 */}
        <div className="drawer drawer-end">
          <input
            id="detail-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-side z-50">
            <label
              htmlFor="detail-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu p-4 w-2/3 sm:w-2/3 md:w-1/2 min-h-full bg-base-200 text-base-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {cards[activeCardIndex]?.name} ({HEAR_MAP[cards[activeCardIndex]?.hero as keyof typeof HEAR_MAP]})
                </h2>
                <button
                  onClick={() => {
                    (document.getElementById('detail-drawer') as HTMLInputElement).checked = false;
                  }}
                  className="absolute top-2 right-2 btn btn-ghost btn-circle btn-sm z-10"
                  aria-label="关闭"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Detail
                setList={(newList) => {
                  setCards(prevCards => {
                    const newCards = [...prevCards];
                    newCards[activeCardIndex] = {
                      ...newCards[activeCardIndex],
                      list: typeof newList === 'function' ? newList(newCards[activeCardIndex].list) : newList
                    };
                    return newCards;
                  });
                }}
                list={cards[activeCardIndex]?.list || []}
                isDrawer={true}
              />
            </div>
          </div>
        </div>
        {/* 分享抽屉组件 */}
        <div className="drawer drawer-end">
          <input
            id="share-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-side z-50">
            <label
              htmlFor="share-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu p-4 w-2/3 sm:w-2/3 md:w-1/2 min-h-full bg-base-200 text-base-content flex flex-col items-center justify-center relative">
              <button
                onClick={() => {
                  (document.getElementById('share-drawer') as HTMLInputElement).checked = false;
                  setTimeout(() => setShareCardIndex(null), 300);
                }}
                className="absolute top-2 right-2 btn btn-ghost btn-circle btn-sm"
                aria-label="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {shareCardIndex !== null && cards[shareCardIndex] && (
                <div className="w-full flex justify-center">
                  <ShareCard
                    cardName={cards[shareCardIndex].name}
                    hero={cards[shareCardIndex].hero}
                    list={cards[shareCardIndex].list}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 flex gap-8 flex-wrap items-center justify-center p-6 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg z-10">
          <div className="flex items-center gap-3 bg-gray-50/80 px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">总场数</span>
              <span className="text-lg font-semibold text-gray-700">{total}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50/80 px-6 py-3 rounded-full border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">总胜率</span>
              <span className="text-lg font-semibold text-blue-600">{winRate}</span>
            </div>
          </div>
        </footer>
        <div className="h-20"></div>
      </div>
      <AddCardModal onConfirm={addNewCard} onCancel={() => { }} />
      <EditCardModal
        onConfirm={(newName, newHero) => {
          if (cardToEdit !== null) {
            editCard(cardToEdit, newName, newHero);
            setCardToEdit(null);
          }
        }}
        onCancel={() => setCardToEdit(null)}
        currentName={cards[cardToEdit || 0]?.name || ''}
        currentHero={cards[cardToEdit || 0]?.hero || ''}
      />
      <ConfirmModal
        id="deleteCardModal"
        title="确认删除"
        content={`确定要删除卡组"${cards[cardToDelete || 0]?.name}"吗？此操作不可恢复！`}
        onConfirm={() => {
          if (cardToDelete !== null) {
            deleteCard(cardToDelete);
            setCardToDelete(null);
          }
        }}
        onCancel={() => setCardToDelete(null)}
      />
      <ConfirmModal
        id="confirmModal"
        title="确认"
        content="确定要清除所有数据吗？此操作不可恢复！"
        onConfirm={clearAllData}
        onCancel={() => { }}
      />
      <Toast setMessage={setMessage} message={message} />
    </>
  );
}
