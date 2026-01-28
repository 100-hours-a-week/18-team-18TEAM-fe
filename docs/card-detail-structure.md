# 내 명함 / 상대방 명함 상세 페이지 구조

## 핵심 차이점
- **내 명함**: 각 섹션별 수정 UI 표시
- **상대방 명함**: 조회만 가능 (수정 UI 숨김)

---

## 섹션별 수정 방식 (내 명함)

| 섹션 | 수정 방식 | UI 요소 |
|------|----------|---------|
| 프로필 | 연필 아이콘 클릭 | 연필 아이콘 |
| 기술 | + 버튼 클릭 | + 버튼 |
| 링크 | + 버튼 클릭 | + 버튼 |
| 프로젝트 | ... 메뉴 클릭 | 더보기 메뉴 |
| 활동 | ... 메뉴 클릭 | 더보기 메뉴 |

---

## 파일 구조

### 페이지 (Pages)

```
src/app/(main)/
├── my-card/
│   ├── page.tsx              # 내 명함 상세 페이지 (수정 UI O)
│   └── edit/
│       └── page.tsx          # 프로필 수정 페이지
│
└── cards/
    └── [id]/
        └── page.tsx          # 상대방 명함 상세 페이지 (수정 UI X)
```

### 공유 컴포넌트 (Shared Components)

```
src/features/card-detail/ui/
├── index.ts                  # 배럴 export
├── card-detail-page.tsx      # 공유 레이아웃 컴포넌트 (isOwner prop으로 분기)
├── profile-section.tsx       # 프로필 섹션 (isOwner ? 연필 아이콘 : 숨김)
├── skills-section.tsx        # 기술 섹션 (isOwner ? + 버튼 : 숨김)
├── links-section.tsx         # 링크 섹션 (isOwner ? + 버튼 : 숨김)
├── projects-section.tsx      # 프로젝트 섹션 (isOwner ? ... 메뉴 : 숨김)
└── activities-section.tsx    # 활동 섹션 (isOwner ? ... 메뉴 : 숨김)
```

---

## 사용법

### 내 명함 페이지 (`/my-card`)
```tsx
// src/app/(main)/my-card/page.tsx
import { CardDetailPage } from '@/features/card-detail/ui';

export default function MyCardPage() {
  const myData = useMyCardData(); // 내 명함 데이터 조회

  return <CardDetailPage isOwner={true} data={myData} />;
}
```

### 상대방 명함 페이지 (`/cards/[id]`)
```tsx
// src/app/(main)/cards/[id]/page.tsx
import { CardDetailPage } from '@/features/card-detail/ui';

export default function CardDetailPageRoute({ params }: { params: { id: string } }) {
  const cardData = useCardData(params.id); // 특정 명함 데이터 조회

  return <CardDetailPage isOwner={false} data={cardData} />;
}
```

---

## 공유 컴포넌트 상세

### CardDetailPage
```tsx
interface CardDetailPageProps {
  isOwner: boolean;      // 내 명함 여부
  data: CardData;        // 명함 데이터
}

// 내부에서 isOwner를 각 섹션에 전달
<ProfileSection isOwner={isOwner} data={data.profile} />
<SkillsSection isOwner={isOwner} skills={data.skills} />
<LinksSection isOwner={isOwner} links={data.links} />
<ProjectsSection isOwner={isOwner} projects={data.projects} />
<ActivitiesSection isOwner={isOwner} activities={data.activities} />
```

### 각 섹션 컴포넌트
```tsx
// 예시: SkillsSection
interface SkillsSectionProps {
  isOwner: boolean;
  skills: Skill[];
}

function SkillsSection({ isOwner, skills }: SkillsSectionProps) {
  return (
    <section>
      <div className="flex justify-between">
        <h3>기술</h3>
        {isOwner && <AddButton onClick={handleAddSkill} />}
      </div>
      <SkillList skills={skills} />
    </section>
  );
}
```

---

## 관련 기존 컴포넌트
- `src/features/card-detail/ui/glass-card-preview.tsx` - 명함 미리보기
- `src/features/card-detail/ui/card-info-section.tsx` - 연락처 정보
- `src/features/card-edit/ui/profile-form.tsx` - 프로필 수정 폼
- `src/features/user-detail/ui/detail-tabs.tsx` - 탭 네비게이션
