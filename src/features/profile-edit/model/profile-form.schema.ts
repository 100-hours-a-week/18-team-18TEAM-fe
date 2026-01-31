import { z } from 'zod'

export const profileFormSchema = z.object({
  profileImage: z.string().optional(),
  profileImageKey: z.string().optional(),
  name: z.string().max(20, '이름이 너무 깁니다.').optional().or(z.literal('')),
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
  phone: z
    .string()
    .min(1, '휴대폰 번호를 입력해주세요.')
    .max(13, '휴대폰 번호를 입력해주세요.')
    .regex(/^[0-9-]+$/, '형식에 맞게 입력해주세요.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .max(320, '이메일이 너무 깁니다.')
    .email('이메일을 입력해주세요.'),
  tel: z
    .string()
    .max(13, '전화번호가 너무 깁니다.')
    .regex(/^[0-9-]*$/, '숫자만 입력해주세요.')
    .optional()
    .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>
