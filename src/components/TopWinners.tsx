import React, { useEffect, useState } from 'react'
import { DisplayNames } from '@/constants';

const TopWinners = () => {

    const [nameIndex, setNameIndex] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            const index = Math.floor(Math.random() * 50);
            setNameIndex(index);
        }, 5000);

        return () => clearInterval(timer);
    }, []);


    return (
        <div className="flex items-center gap-2 flex-1">
            <h3 className="font-medium text-sm text-color-30 border-r tracking-wide pr-2 italic text-wrap" translate='no'>
                Top winners
            </h3>

            <p className="font-light text-xs leading-[14px] text-color-30 tracking-wide italic relative overflow-hidden flex-1 h-4">
                                    
                <span className={`absolute left-0 bg-color-60`} translate='no'>
                    {DisplayNames[nameIndex].text}
                </span>
            </p>
        </div>
    )
}

export default TopWinners