"use client"

import { useState, useEffect } from "react";
import { PlusCircleOutlined, MinusCircleOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

// 初始化列表
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

export default function Home() {
  // 从 localStorage 读取数据，如果没有则使用初始数据
  const [list, setList] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedList = localStorage.getItem('hearthstone-stats');
      if (savedList) {
        try {
          const parsedList = JSON.parse(savedList);
          // 验证数据格式
          if (Array.isArray(parsedList) && parsedList.every(item => 
            typeof item === 'object' && 
            'name' in item && 
            'win' in item && 
            'lose' in item
          )) {
            return parsedList;
          }
        } catch (error) {
          console.error('Failed to parse saved data:', error);
        }
      }
    }
    return initialList;
  });
  const [importValue, setImportValue] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // 监听 list 变化，保存到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hearthstone-stats', JSON.stringify(list));
    }
  }, [list]);

  // 计算单个职业的胜率
  const calculateWinRate = (win: number, lose: number) => {
    const total = win + lose;
    if (total === 0) return '0%';
    return `${((win / total) * 100).toFixed(1)}%`;
  };

  // 计算总场数和总胜率
  const calculateTotalStats = () => {
    const total = list.reduce((acc, curr) => acc + curr.win + curr.lose, 0);
    const totalWins = list.reduce((acc, curr) => acc + curr.win, 0);
    const winRate = total === 0 ? '0%' : `${((totalWins / total) * 100).toFixed(1)}%`;
    return { total, winRate };
  };

  const { total, winRate } = calculateTotalStats();

  // 处理胜场加减
  const handleWinChange = (index: number, delta: number) => {
    setList(prevList => {
      const newList = [...prevList];
      const newValue = Math.max(0, newList[index].win + delta); // 确保不会小于0
      newList[index] = {
        ...newList[index],
        win: newValue
      };
      return newList;
    });
  };

  // 处理负场加减
  const handleLoseChange = (index: number, delta: number) => {
    setList(prevList => {
      const newList = [...prevList];
      const newValue = Math.max(0, newList[index].lose + delta); // 确保不会小于0
      newList[index] = {
        ...newList[index],
        lose: newValue
      };
      return newList;
    });
  };

  /**
 * 将文本复制到剪贴板
 * @param text - 要复制的文本
 * @returns Promise<boolean> - 表示是否成功复制的 Promise
 */
  async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard && navigator.permissions) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy text to clipboard:', err);
        return false;
      }
    } else {
      // Clipboard API 不可用时的回退方案
      return fallbackCopyTextToClipboard(text);
    }
  }

  /**
  * 回退方案: 将文本复制到剪贴板
  * @param text - 要复制的文本
  * @returns boolean - 表示是否成功复制
  */
  function fallbackCopyTextToClipboard(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 避免在 iOS 上的视觉跳动
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    return success;
  }

  // 导出数据为 base64
  const exportData = () => {
    const jsonString = JSON.stringify(list);
    const base64 = btoa(encodeURIComponent(jsonString));
    copyToClipboard(base64).then(success => {
      if (success) {
        alert('数据已复制到剪贴板');
      } else {
        alert('复制失败，请手动复制');
      }
    });
  };

  // 修改导入数据的函数，导入成功后也会保存到 localStorage
  const importData = () => {
    try {
      const jsonString = decodeURIComponent(atob(importValue));
      const newList = JSON.parse(jsonString);
      
      // 验证数据格式
      if (!Array.isArray(newList) || !newList.every(item => 
        typeof item === 'object' && 
        'name' in item && 
        'win' in item && 
        'lose' in item
      )) {
        throw new Error('数据格式不正确');
      }

      setList(newList);
      setImportValue('');
      // localStorage 的保存由 useEffect 处理
      alert('数据导入成功');
    } catch (error) {
      alert('导入失败：数据格式不正确');
      console.error('Import error:', error);
    }
  };

  // 清除所有数据
  const clearAllData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      setList(initialList);
      localStorage.removeItem('hearthstone-stats');
      alert('数据已清除');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className={`fixed top-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-50/95 backdrop-blur-sm border-b shadow-sm z-10 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <h2 className="text-lg font-medium whitespace-nowrap">导入数据</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder="粘贴 base64 数据"
              className="w-full sm:w-64 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={importData}
              className="w-full sm:w-auto px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              导入
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <h2 className="text-lg font-medium whitespace-nowrap">导出数据</h2>
          <button
            onClick={exportData}
            className="w-full sm:w-auto px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
          >
            复制数据
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            onClick={clearAllData}
            className="w-full sm:w-auto px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            清除数据
          </button>
        </div>
      </header>
      {/* 添加切换按钮 */}
      <button
        onClick={() => setIsHeaderVisible(!isHeaderVisible)}
        className="fixed top-2 right-2 z-20 p-2 rounded-full bg-gray-50/95 backdrop-blur-sm border shadow-sm hover:bg-gray-100 transition-colors"
        aria-label={isHeaderVisible ? '隐藏头部' : '显示头部'}
      >
        {isHeaderVisible ? (
          <VerticalAlignTopOutlined className="text-lg" />
        ) : (
          <VerticalAlignBottomOutlined className="text-lg" />
        )}
      </button>
      {/* 调整占位 div 的高度，只在 header 可见时显示 */}
      <div className={`transition-all duration-300 ${isHeaderVisible ? 'h-32 sm:h-16' : 'h-0'}`}></div>
      <main className="flex flex-row flex-wrap gap-[32px] row-start-2 items-start justify-center w-full">
        {list.map((item, index) => (
          <div key={item.name} className="flex items-center flex-col gap-3 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h1 className="text-lg font-medium">{item.name}</h1>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-sm font-medium text-gray-600">胜率</h2>
              <p className="text-lg font-semibold text-blue-600">
                {calculateWinRate(item.win, item.lose)}
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm">胜:</span>
              <MinusCircleOutlined
                className="cursor-pointer hover:text-blue-500"
                onClick={() => handleWinChange(index, -1)}
              />
              <p className="w-8 text-center">{item.win}</p>
              <PlusCircleOutlined
                className="cursor-pointer hover:text-blue-500"
                onClick={() => handleWinChange(index, 1)}
              />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm">负:</span>
              <MinusCircleOutlined
                className="cursor-pointer hover:text-blue-500"
                onClick={() => handleLoseChange(index, -1)}
              />
              <p className="w-8 text-center">{item.lose}</p>
              <PlusCircleOutlined
                className="cursor-pointer hover:text-blue-500"
                onClick={() => handleLoseChange(index, 1)}
              />
            </div>
            <div className="text-sm text-gray-500">
              总场数: {item.win + item.lose}
            </div>
          </div>
        ))}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 flex gap-[24px] flex-wrap items-center justify-center p-4 bg-gray-50/95 backdrop-blur-sm border-t shadow-lg z-10">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">总场数:</span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">总胜率:</span>
          <span className="font-semibold text-blue-600">{winRate}</span>
        </div>
      </footer>
      <div className="h-20"></div>
    </div>
  );
}
