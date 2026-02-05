import { z } from 'zod'

export const careerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해주세요.')
      .max(20, '이름은 최대 20자까지 입력이 가능합니다.')
      .regex(/^[가-힣a-zA-Z]+(\.[가-힣a-zA-Z]+)?$/, '이름에 특수문자나 숫자를 사용할 수 없습니다. 점(.)은 한 번만 사용할 수 있습니다.'),
    company: z
      .string()
      .min(1, '회사명을 입력해주세요.')
      .max(20, '회사명은 최대 20자까지 입력이 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9\s()&.]+$/, '회사명은 한글, 영문, 숫자와 특수문자(점, 괄호, &) 및 공백만 사용 가능합니다.'),
    department: z
      .string()
      .max(20, '부서명은 최대 20자까지 입력이 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9\s()&.]*$/, '부서명에 허용되지 않는 특수문자가 있습니다.')
      .optional()
      .or(z.literal('')),
    position: z
      .string()
      .max(20, '직책명은 최대 20자까지 입력이 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9\s]*$/, '직책명은 한글, 영문, 숫자만 입력 가능합니다.')
      .optional()
      .or(z.literal('')),
    phone_number: z
      .string()
      .min(1, '휴대폰 번호를 입력해주세요.')
      .max(13, '휴대폰 번호은 최대 13자까지 입력이 가능합니다.')
      .regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식으로 입력해주세요.'),
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .max(320, '이메일이 너무 깁니다.')
      .email('이메일 형식이 올바르지 않습니다.'),
    lined_number: z
      .string()
      .max(13, '유선전화 번호가 너무 깁니다.')
      .regex(/^(?:\d{2,3}-\d{3,4}-\d{4})?$/, '올바른 전화번호 형식이어야 합니다. (예: 02-123-4567)')
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
