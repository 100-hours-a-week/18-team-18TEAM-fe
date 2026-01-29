'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CardData } from '../model'

interface BusinessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CardData
}

function BusinessCard({ data, className, ...props }: BusinessCardProps) {
  return (
    <div
      data-slot="business-card"
      className={cn(
        'relative h-[200px] w-full rounded-[10px] bg-[#022840] px-6 py-7 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
        className
      )}
      {...props}
    >
      {/* 왼쪽 상단: 이름, 회사, 부서/직책 */}
      <div className="flex flex-col gap-[5px] text-white">
        <h3 className="font-pretendard text-[20px] font-semibold leading-[22px] tracking-[-0.4px]">
          {data.name}
        </h3>
        <div className="flex flex-col text-[15px] leading-[22px] tracking-[-0.3px]">
          <p className="font-pretendard font-normal">{data.company}</p>
          <p className="font-pretendard font-medium">
            {data.department} / {data.position}
          </p>
        </div>
      </div>

      {/* 오른쪽 하단: 연락처 정보 */}
      <div className="absolute right-6 bottom-7 flex flex-col text-[12px] leading-[22px] tracking-[-0.24px] text-white">
        <p className="font-pretendard font-normal">M: {data.phone_number}</p>
        <p className="font-pretendard font-normal">E: {data.email}</p>
        <p className="font-pretendard font-normal">T: {data.lined_number}</p>
      </div>
    </div>
  )
}

export { BusinessCard }
export type { BusinessCardProps }
