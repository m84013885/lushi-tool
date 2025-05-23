import React from 'react';
import { HEAR_MAP } from '../constants';

interface ListItem {
    name: string;
    win: number;
    lose: number;
}

interface ShareCardProps {
    cardName: string;
    hero: string;
    list: ListItem[];
}

export default function ShareCard({ cardName, hero, list }: ShareCardProps) {
    // 计算整体胜率
    const total = list.reduce((acc, curr) => acc + curr.win + curr.lose, 0);
    const wins = list.reduce((acc, curr) => acc + curr.win, 0);
    const winRate = total === 0 ? 0 : (wins / total) * 100;

    // 计算每个职业的胜率和场数
    const stats = list.map(item => ({
        ...item,
        total: item.win + item.lose,
        rate: item.win + item.lose === 0 ? 0 : (item.win / (item.win + item.lose)) * 100
    }));

    // 胜率最高职业
    const maxRate = Math.max(...stats.map(s => s.rate));
    const best = stats.filter(s => s.rate === maxRate && s.total > 0);
    // 胜率最低职业
    const minRate = Math.min(...stats.filter(s => s.total > 0).map(s => s.rate));
    const worst = stats.filter(s => s.rate === minRate && s.total > 0);
    // 对战场数最多职业
    const maxTotal = Math.max(...stats.map(s => s.total));
    const most = stats.filter(s => s.total === maxTotal && s.total > 0);
    // 对战场数最少职业
    const minTotal = Math.min(...stats.filter(s => s.total > 0).map(s => s.total));
    const least = stats.filter(s => s.total === minTotal && s.total > 0);

    const hear = HEAR_MAP[hero as keyof typeof HEAR_MAP] || '';

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
            <div className="flex flex-col items-center gap-1 mb-2">
                <div className="text-sm text-gray-500">{hear}</div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">整体胜率</span>
                    <span className="text-2xl font-bold text-blue-600">{total === 0 ? '--' : winRate.toFixed(1) + '%'}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-xs text-gray-500">胜率最高</span>
                    <span className="text-lg font-semibold text-green-600">{best.length ? best.map(b => b.name).join('、') : '--'}</span>
                    <span className="text-sm text-gray-700">{best.length ? best[0].rate.toFixed(1) + '%' : ''}</span>
                </div>
                <div className="bg-red-50 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-xs text-gray-500">胜率最低</span>
                    <span className="text-lg font-semibold text-red-600">{worst.length ? worst.map(w => w.name).join('、') : '--'}</span>
                    <span className="text-sm text-gray-700">{worst.length ? worst[0].rate.toFixed(1) + '%' : ''}</span>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-xs text-gray-500">对战最多</span>
                    <span className="text-lg font-semibold text-yellow-700">{most.length ? most.map(m => m.name).join('、') : '--'}</span>
                    <span className="text-sm text-gray-700">{most.length ? most[0].total + '场' : ''}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col items-center">
                    <span className="text-xs text-gray-500">对战最少</span>
                    <span className="text-lg font-semibold text-gray-700">{least.length ? least.map(l => l.name).join('、') : '--'}</span>
                    <span className="text-sm text-gray-700">{least.length ? least[0].total + '场' : ''}</span>
                </div>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">数据来源：{cardName}</div>
        </div>
    );
} 