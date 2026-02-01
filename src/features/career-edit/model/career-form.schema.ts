import { z } from 'zod'

export const careerFormSchema = z
  .object({
    name: z
      .string()
      .max(20, '이름이 너무 깁니다.')
      .optional()
      .or(z.literal('')),
    company: z
      .string()
      .max(20, '회사명이 너무 깁니다.')
      .optional()
      .or(z.literal('')),
    department: z
      .string()
      .max(20, '부서명이 너무 깁니다.')
      .optional()
      .or(z.literal('')),
    position: z
      .string()
      .max(20, '직책명이 너무 깁니다.')
      .optional()
      .or(z.literal('')),
    phone_number: z
      .string()
      .min(1, '휴대폰 번호를 입력해주세요.')
      .max(13, '휴대폰 번호가 너무 깁니다.')
      .regex(/^[0-9-]+$/, '형식에 맞게 입력해주세요.'),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .max(320, '이메일이 너무 깁니다.')
      .email('이메일 형식이 올바르지 않습니다.'),
    lined_number: z
      .string()
      .max(13, '유선전화 번호가 너무 깁니다.')
      .regex(/^[0-9-]*$/, '숫자만 입력해주세요.')
      .optional()
      .or(z.literal('')),
    start_date: z.string().min(1, '시작일을 선택해주세요'),
    end_date: z.string().optional().or(z.literal('')),
    is_progress: z.boolean().default(false),
    ai_image_key: z.string().optional(),
  })
  .refine(
    (data) => {
      // 현재 재직 중이면 종료일 검증 패스
      if (data.is_progress) return true
      // 종료일이 없으면 에러
      if (!data.end_date) return false
      // 시작일 <= 종료일 확인
      return data.start_date <= data.end_date
    },
    {
      message: '종료일은 시작일 이후여야 합니다',
      path: ['end_date'],
    }
  )

export type CareerFormData = z.infer<typeof careerFormSchema>
