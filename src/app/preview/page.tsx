"use client"

import * as React from "react"
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  FileTextIcon,
} from "lucide-react"
import {
  Avatar,
  Button,
  IconButton,
  Card,
  CardSection,
  Header,
  BottomNav,
  GlassCard,
  GlassCardContent,
  Field,
  TextareaField,
  DatePicker,
  AlertDialog,
  DropdownMenu,
  toast,
  Toaster,
  EmptyState,
  InfoCard,
  type ProfileData,
} from "@/shared"
import { BusinessCardItem } from "@/features/home/components/business-card-item"
import { SearchInput } from "@/features/home/components/search-input"
import { FAB } from "@/features/home/components/fab"
import { FABMenu } from "@/features/home/components/fab-menu"
import { GlassCardPreview } from "@/features/card-detail/components/glass-card-preview"
import { CardInfoSection } from "@/features/card-detail/components/card-info-section"
import { ActionIcons } from "@/features/card-detail/components/action-icons"
import { ProfileHeader } from "@/features/user-detail/components/profile-header"
import { DetailTabs } from "@/features/user-detail/components/detail-tabs"
import { StarRating } from "@/features/reviews/components/star-rating"
import { ReviewForm } from "@/features/reviews/components/review-form"
import { HexagonChart } from "@/features/charts/components/hexagon-chart"
import { LoginForm } from "@/features/auth/components/login-form"
import { ShareCard } from "@/features/share/components/share-card"

// 섹션 컴포넌트
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SubSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

// 샘플 데이터
const sampleProfile: ProfileData = {
  name: "홍길동",
  department: "개발팀",
  position: "시니어 개발자",
  company: "CARO Inc.",
  phone: "010-1234-5678",
  email: "hong@caro.kr",
  tel: "02-1234-5678",
  avatarSrc: null,
}

const hexagonData = [
  { label: "기술력", value: 85 },
  { label: "협업", value: 90 },
  { label: "소통", value: 75 },
  { label: "리더십", value: 70 },
  { label: "창의성", value: 80 },
  { label: "전문성", value: 88 },
]

export default function ComponentPreview() {
  const [alertOpen, setAlertOpen] = React.useState(false)
  const [alertDestructiveOpen, setAlertDestructiveOpen] = React.useState(false)
  const [dateValue, setDateValue] = React.useState("")
  const [fabMenuOpen, setFabMenuOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"career" | "skills" | "links" | "projects" | "activities">("career")
  const [rating, setRating] = React.useState(3)

  return (
    <div className="container mx-auto py-8 px-4 space-y-12 pb-24">
      <h1 className="text-3xl font-bold text-foreground">Component Preview</h1>
      <p className="text-muted-foreground">
        구현된 모든 컴포넌트를 한눈에 확인할 수 있는 페이지입니다.
      </p>

      <Toaster />

      {/* ==================== Shared Components ==================== */}
      <div className="space-y-12">
        <h2 className="text-2xl font-bold text-primary">Shared Components</h2>

        {/* Avatar */}
        <Section title="Avatar">
          <SubSection label="Size variants">
            <Avatar size="sm" />
            <Avatar size="default" />
            <Avatar size="lg" />
            <Avatar size="xl" />
          </SubSection>
          <SubSection label="With image (fallback shown)">
            <Avatar size="lg" src={null} />
            <Avatar size="lg" fallback="홍" />
          </SubSection>
        </Section>

        {/* Button */}
        <Section title="Button">
          <SubSection label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </SubSection>
          <SubSection label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </SubSection>
          <SubSection label="States">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </SubSection>
          <SubSection label="With Icons">
            <Button leftIcon={<EditIcon className="size-4" />}>Edit</Button>
            <Button rightIcon={<CopyIcon className="size-4" />}>Copy</Button>
          </SubSection>
        </Section>

        {/* IconButton */}
        <Section title="IconButton">
          <SubSection label="Variants">
            <IconButton variant="default">
              <HomeIcon className="size-5" />
            </IconButton>
            <IconButton variant="ghost">
              <UserIcon className="size-5" />
            </IconButton>
            <IconButton variant="primary">
              <SettingsIcon className="size-5" />
            </IconButton>
            <IconButton variant="surface">
              <EditIcon className="size-5" />
            </IconButton>
          </SubSection>
          <SubSection label="Sizes">
            <IconButton size="sm">
              <HomeIcon className="size-4" />
            </IconButton>
            <IconButton size="default">
              <HomeIcon className="size-5" />
            </IconButton>
            <IconButton size="lg">
              <HomeIcon className="size-6" />
            </IconButton>
          </SubSection>
        </Section>

        {/* Card */}
        <Section title="Card">
          <SubSection label="Variants">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Card variant="default">
                <CardSection title="Default Card" description="기본 카드입니다">
                  Content goes here
                </CardSection>
              </Card>
              <Card variant="outline">
                <CardSection title="Outline Card" description="테두리 카드입니다">
                  Content goes here
                </CardSection>
              </Card>
              <Card variant="filled">
                <CardSection title="Filled Card" description="채워진 카드입니다">
                  Content goes here
                </CardSection>
              </Card>
              <Card variant="glass">
                <CardSection title="Glass Card" description="글래스 카드입니다">
                  Content goes here
                </CardSection>
              </Card>
            </div>
          </SubSection>
        </Section>

        {/* GlassCard */}
        <Section title="GlassCard">
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-lg">
            <GlassCard className="max-w-sm">
              <GlassCardContent>
                <p className="font-semibold">Glass Card Title</p>
                <p className="text-sm text-muted-foreground">
                  글래스 효과가 적용된 카드입니다.
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </Section>

        {/* InfoCard */}
        <Section title="InfoCard">
          <div className="max-w-sm space-y-4">
            <InfoCard title="기본 정보">
              <p>홍길동</p>
              <p>개발팀 / 시니어 개발자</p>
            </InfoCard>
            <InfoCard title="연락처" editable onEdit={() => alert("Edit clicked")}>
              <p>010-1234-5678</p>
              <p>hong@caro.kr</p>
            </InfoCard>
          </div>
        </Section>

        {/* Header */}
        <Section title="Header">
          <SubSection label="With title">
            <div className="w-full border rounded-lg overflow-hidden">
              <Header title="페이지 제목" />
            </div>
          </SubSection>
          <SubSection label="With close button">
            <div className="w-full border rounded-lg overflow-hidden">
              <Header title="닫기 버튼" showClose onClose={() => alert("Close")} />
            </div>
          </SubSection>
          <SubSection label="With menu">
            <div className="w-full border rounded-lg overflow-hidden">
              <Header title="메뉴 포함" showMenu onMenuClick={() => alert("Menu")} />
            </div>
          </SubSection>
          <SubSection label="Custom content">
            <div className="w-full border rounded-lg overflow-hidden">
              <Header
                leftContent={<Avatar size="sm" />}
                rightContent={
                  <Button size="sm" variant="ghost">
                    저장
                  </Button>
                }
              />
            </div>
          </SubSection>
        </Section>

        {/* BottomNav */}
        <Section title="BottomNav">
          <SubSection label="Sample Navigation (relative position for preview)">
            <div className="w-full border rounded-lg overflow-hidden relative h-20">
              <div className="absolute inset-0">
                <BottomNav
                  className="!fixed !relative"
                  items={[
                    {
                      id: "home",
                      icon: <HomeIcon className="size-6" />,
                      label: "홈",
                    },
                    {
                      id: "profile",
                      icon: <UserIcon className="size-6" />,
                      label: "프로필",
                    },
                    {
                      id: "settings",
                      icon: <SettingsIcon className="size-6" />,
                      label: "설정",
                    },
                  ]}
                  activeId="home"
                />
              </div>
            </div>
          </SubSection>
        </Section>

        {/* Field */}
        <Section title="Field / TextareaField">
          <div className="max-w-md space-y-4">
            <Field label="이름" placeholder="이름을 입력하세요" required />
            <Field
              label="이메일"
              type="email"
              placeholder="email@example.com"
              description="회사 이메일을 입력해주세요"
            />
            <Field
              label="에러 상태"
              placeholder="잘못된 입력"
              error="올바른 형식이 아닙니다"
            />
            <TextareaField
              label="자기소개"
              placeholder="자기소개를 입력하세요"
              required
            />
            <TextareaField
              label="에러 상태"
              placeholder="내용을 입력하세요"
              error="최소 10자 이상 입력해주세요"
            />
          </div>
        </Section>

        {/* DatePicker */}
        <Section title="DatePicker">
          <div className="max-w-md space-y-4">
            <DatePicker
              label="생년월일"
              value={dateValue}
              onChange={setDateValue}
              required
            />
            <DatePicker label="선택된 날짜" value="2024-01-15" disabled />
            <DatePicker label="에러 상태" error="날짜를 선택해주세요" />
          </div>
        </Section>

        {/* AlertDialog */}
        <Section title="AlertDialog">
          <SubSection label="Types">
            <Button onClick={() => setAlertOpen(true)}>Confirm Dialog</Button>
            <Button
              variant="destructive"
              onClick={() => setAlertDestructiveOpen(true)}
            >
              Destructive Dialog
            </Button>
          </SubSection>
          <AlertDialog
            open={alertOpen}
            onOpenChange={setAlertOpen}
            title="확인"
            description="이 작업을 진행하시겠습니까?"
            type="confirm"
            onConfirm={() => {
              toast.success("확인되었습니다")
              setAlertOpen(false)
            }}
          />
          <AlertDialog
            open={alertDestructiveOpen}
            onOpenChange={setAlertDestructiveOpen}
            title="삭제 확인"
            description="정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            type="destructive"
            confirmText="삭제"
            onConfirm={() => {
              toast.error("삭제되었습니다")
              setAlertDestructiveOpen(false)
            }}
          />
        </Section>

        {/* DropdownMenu */}
        <Section title="DropdownMenu">
          <SubSection label="Simple items">
            <DropdownMenu
              trigger={<Button variant="outline">메뉴 열기</Button>}
              items={[
                { id: "edit", label: "수정", icon: <EditIcon className="size-4" /> },
                { id: "copy", label: "복사", icon: <CopyIcon className="size-4" /> },
                {
                  id: "delete",
                  label: "삭제",
                  icon: <TrashIcon className="size-4" />,
                  destructive: true,
                },
              ]}
            />
          </SubSection>
          <SubSection label="With groups">
            <DropdownMenu
              trigger={<Button variant="outline">그룹 메뉴</Button>}
              groups={[
                {
                  label: "편집",
                  items: [
                    { id: "edit", label: "수정" },
                    { id: "copy", label: "복사" },
                  ],
                },
                {
                  label: "위험",
                  items: [{ id: "delete", label: "삭제", destructive: true }],
                },
              ]}
            />
          </SubSection>
        </Section>

        {/* Toast */}
        <Section title="Toast">
          <SubSection label="Types">
            <Button onClick={() => toast("기본 토스트 메시지")}>Default</Button>
            <Button onClick={() => toast.success("성공했습니다!")}>Success</Button>
            <Button onClick={() => toast.error("오류가 발생했습니다")}>Error</Button>
            <Button onClick={() => toast.info("정보 메시지입니다")}>Info</Button>
            <Button onClick={() => toast.warning("주의가 필요합니다")}>
              Warning
            </Button>
          </SubSection>
          <SubSection label="With action">
            <Button
              onClick={() =>
                toast.success("저장되었습니다", {
                  action: {
                    label: "실행취소",
                    onClick: () => toast.info("실행취소됨"),
                  },
                })
              }
            >
              With Action
            </Button>
          </SubSection>
        </Section>

        {/* EmptyState */}
        <Section title="EmptyState">
          <div className="grid grid-cols-2 gap-4">
            <EmptyState
              title="데이터가 없습니다"
              description="아직 등록된 항목이 없습니다."
            />
            <EmptyState
              icon={<FileTextIcon className="size-6" />}
              title="명함이 없습니다"
              description="새 명함을 추가해보세요"
              action={<Button size="sm">명함 추가</Button>}
            />
            <EmptyState
              title="항목 추가"
              description="+ 버튼을 눌러 추가하세요"
              onAction={() => alert("Add clicked")}
            />
          </div>
        </Section>
      </div>

      {/* ==================== Feature Components ==================== */}
      <div className="space-y-12">
        <h2 className="text-2xl font-bold text-primary">Feature Components</h2>

        {/* Home Feature */}
        <Section title="Home - BusinessCardItem">
          <div className="max-w-md">
            <BusinessCardItem
              name="홍길동"
              cardName="회사 명함"
              department="개발팀"
              position="시니어 개발자"
              phone="010-1234-5678"
              email="hong@caro.kr"
              onPress={() => alert("Card clicked")}
            />
          </div>
        </Section>

        <Section title="Home - SearchInput">
          <div className="max-w-md">
            <SearchInput
              placeholder="명함 검색"
              onSearch={(value) => console.log("Search:", value)}
            />
          </div>
        </Section>

        <Section title="Home - FAB & FABMenu">
          <SubSection label="Click FAB to open menu">
            <p className="text-sm text-muted-foreground">
              FAB을 눌러 아이콘이 + → X로 토글되고, 메뉴가 위로 드롭업됩니다.
            </p>
            <FAB open={fabMenuOpen} onClick={() => setFabMenuOpen((prev) => !prev)} />
            <FABMenu
              open={fabMenuOpen}
              onClose={() => setFabMenuOpen(false)}
              onShareCard={() => {
                toast.info("내 명함 공유")
              }}
              onScanQR={() => {
                toast.info("QR 코드 스캔")
              }}
            />
          </SubSection>
        </Section>

        {/* Card Detail Feature */}
        <Section title="Card Detail - GlassCardPreview">
          <div className="bg-gradient-to-br from-primary/30 to-secondary/30 p-8 rounded-lg">
            <GlassCardPreview data={sampleProfile} className="max-w-md" />
          </div>
          <SubSection label="Private mode (masked)">
            <div className="bg-gradient-to-br from-primary/30 to-secondary/30 p-8 rounded-lg">
              <GlassCardPreview
                data={sampleProfile}
                isPublic={false}
                className="max-w-md"
              />
            </div>
          </SubSection>
        </Section>

        <Section title="Card Detail - CardInfoSection">
          <div className="max-w-md border rounded-lg">
            <CardInfoSection
              info={{
                phone: "010-1234-5678",
                email: "hong@caro.kr",
                tel: "02-1234-5678",
              }}
              onPhoneClick={() => toast.info("전화 걸기")}
              onEmailClick={() => toast.info("이메일 보내기")}
              onTelClick={() => toast.info("유선전화 걸기")}
            />
          </div>
        </Section>

        <Section title="Card Detail - ActionIcons">
          <ActionIcons
            onPhone={() => toast.info("전화")}
            onEmail={() => toast.info("이메일")}
            onMessage={() => toast.info("메시지")}
          />
        </Section>

        {/* User Detail Feature */}
        <Section title="User Detail - ProfileHeader">
          <div className="max-w-md">
            <ProfileHeader data={sampleProfile} />
          </div>
        </Section>

        <Section title="User Detail - DetailTabs">
          <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <p className="text-sm text-muted-foreground">
            Selected: {activeTab}
          </p>
        </Section>

        {/* Reviews Feature */}
        <Section title="Reviews - StarRating">
          <SubSection label="Sizes">
            <StarRating value={3} readonly size="sm" />
            <StarRating value={4} readonly size="default" />
            <StarRating value={5} readonly size="lg" />
          </SubSection>
          <SubSection label="Interactive">
            <StarRating value={rating} onChange={setRating} />
            <span className="text-sm text-muted-foreground">{rating}점</span>
          </SubSection>
        </Section>

        <Section title="Reviews - ReviewForm">
          <div className="max-w-md">
            <ReviewForm
              onSubmit={(data) => {
                toast.success(`리뷰 제출: ${data.rating}점`)
                console.log(data)
              }}
            />
          </div>
        </Section>

        {/* Charts Feature */}
        <Section title="Charts - HexagonChart">
          <div className="flex justify-center">
            <HexagonChart data={hexagonData} size={300} />
          </div>
        </Section>

        {/* Auth Feature */}
        <Section title="Auth - LoginForm">
          <div className="max-w-sm">
            <LoginForm
              onKakaoLogin={() => toast.info("카카오 로그인")}
              onGoogleLogin={() => toast.info("Google 로그인")}
              onAppleLogin={() => toast.info("Apple 로그인")}
            />
          </div>
        </Section>

        {/* Share Feature */}
        <Section title="Share - ShareCard">
          <div className="max-w-md">
            <ShareCard data={sampleProfile} />
          </div>
        </Section>
      </div>
    </div>
  )
}
