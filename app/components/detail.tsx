"use client"

interface list {
    name: string,
    win: number,
    lose: number,
}

export default function Detail({ setList, list, isDrawer = false }: {
    setList: (list: list[] | ((prevList: list[]) => list[])) => void,
    list: list[],
    isDrawer?: boolean
}) {

    // 计算单个职业的胜率
    const calculateWinRate = (win: number, lose: number) => {
        const total = win + lose;
        if (total === 0) return '0%';
        return `${((win / total) * 100).toFixed(1)}%`;
    };

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


    return (
        <main className={isDrawer ? "w-full px-0" : "w-full max-w-[1600px] mx-auto px-4"}>
            <div className={isDrawer 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"}>
                {list.map((item, index) => (
                    <div 
                        key={item.name} 
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                        <div className="p-4 md:p-6">
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                                <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[60%]">{item.name}</h1>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs md:text-sm text-gray-500">胜率</span>
                                    <span className="text-base md:text-lg font-semibold text-blue-600">
                                        {calculateWinRate(item.win, item.lose)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs md:text-sm font-medium text-gray-600">胜场</span>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <button
                                            onClick={() => handleWinChange(index, -1)}
                                            className="p-1 md:p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="w-6 md:w-8 text-center font-medium text-gray-800">{item.win}</span>
                                        <button
                                            onClick={() => handleWinChange(index, 1)}
                                            className="p-1 md:p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs md:text-sm font-medium text-gray-600">负场</span>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <button
                                            onClick={() => handleLoseChange(index, -1)}
                                            className="p-1 md:p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="w-6 md:w-8 text-center font-medium text-gray-800">{item.lose}</span>
                                        <button
                                            onClick={() => handleLoseChange(index, 1)}
                                            className="p-1 md:p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs md:text-sm">
                                    <span className="text-gray-500">总场数</span>
                                    <span className="font-medium text-gray-700">{item.win + item.lose}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
