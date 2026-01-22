export default function Page() {
  return <div>안녕</div>
}
// "use client"

// import { useState } from "react"
// import { MessageCircle } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
// } from "@/components/ui/dialog"

// export default function Page() {
//   const [showTermsDialog, setShowTermsDialog] = useState(false)
//   const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
//   const [showError, setShowError] = useState(false)

//   const handleKakaoLogin = () => {
//     // 약관은 암묵적 동의로 간주
//     setShowError(false)
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
//       <div className="mb-12 text-center">
//         <div className="w-20 h-20 mx-auto mb-4 bg-[#2BB6F6] rounded-2xl flex items-center justify-center">
//           <MessageCircle className="w-10 h-10 text-white" />
//         </div>
//         <h1 className="text-2xl mb-2 text-gray-900">CARO</h1>
//         <p className="text-sm text-[#64748B]">AI Digital Business Card</p>
//       </div>

//       <div className="w-full max-w-sm space-y-3">
//         <Button
//           onClick={handleKakaoLogin}
//           variant="primary"
//           size="xl"
//           className="w-full"
//         >
//           <MessageCircle className="w-5 h-5" />
//           <span>카카오로 시작하기</span>
//         </Button>

//         <p className="text-xs text-center text-[#64748B] leading-relaxed">
//           카카오 로그인 시{" "}
//           <Button
//             type="button"
//             variant="link-brand"
//             size="sm"
//             className="p-0 h-auto align-baseline"
//             onClick={() => setShowTermsDialog(true)}
//           >
//             이용약관
//           </Button>{" "}
//           및{" "}
//           <Button
//             type="button"
//             variant="link-brand"
//             size="sm"
//             className="p-0 h-auto align-baseline"
//             onClick={() => setShowPrivacyDialog(true)}
//           >
//             개인정보처리방침
//           </Button>
//           에 동의한 것으로 간주합니다.
//         </p>
//       </div>

//       <Dialog open={showError} onOpenChange={setShowError}>
//         <DialogContent showCloseButton={false} className="max-w-sm">
//           <DialogTitle className="text-gray-900">로그인 실패</DialogTitle>
//           <DialogDescription className="text-[#64748B]">
//             로그인 중 오류가 발생했습니다. 다시 시도해주세요.
//           </DialogDescription>
//           <Button
//             variant="brand"
//             className="w-full"
//             onClick={() => setShowError(false)}
//           >
//             확인
//           </Button>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
//         <DialogContent className="max-h-[90vh] p-0 flex flex-col">
//           <div className="px-6 py-4 border-b">
//             <DialogTitle>이용약관</DialogTitle>
//             <DialogDescription className="text-xs text-[#64748B]">
//               서비스 이용에 관한 약관입니다.
//             </DialogDescription>
//           </div>
//           <div className="flex-1 overflow-y-auto px-6 py-4">
//             <div className="text-sm text-[#64748B] space-y-3 leading-relaxed">
//               <p>제1조 (목적)</p>
//               <p>
//                 본 약관은 디지털 명함 서비스 이용과 관련하여 회사와 이용자 간의
//                 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
//               </p>
//               <p>제2조 (서비스 제공)</p>
//               <p>
//                 회사는 디지털 명함 생성, 관리, 공유 및 AI 분석 서비스를 제공합니다.
//               </p>
//               <p>
//                 제1조 (목적)
//                 본 약관은 ○○○(이하 “회사”)가 제공하는 디지털 명함 및 네트워크 서비스(이하 “서비스”)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

//                 제2조 (정의)
//                 1. “이용자”란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.
//                 2. “회원”이란 개인정보를 제공하고 계정을 생성한 자를 말합니다.
//                 3. “디지털 명함”이란 이용자가 등록하거나 OCR을 통해 생성된 명함 정보를 의미합니다.
//                 4. “연결”이란 OCR 인식 결과 기존 회원과 명함 정보를 매칭하여 네트워크를 형성하는 행위를 의미합니다.
//                 5. “콘텐츠”란 명함 정보, 이미지, 텍스트, 프로필 등 서비스 내 제공되는 모든 자료를 말합니다.

//                 제3조 (약관의 효력 및 변경)
//                 1. 본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.
//                 2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.
//                 3. 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.

//                 제4조 (회원가입 및 계정 관리)
//                 1. 회원가입은 이용자가 약관 및 개인정보 처리 방침에 동의하고 회사가 이를 승인함으로써 성립됩니다.
//                 2. 회원은 정확한 정보를 제공해야 하며, 허위 정보 제공 시 서비스 이용이 제한될 수 있습니다.
//                 3. 계정 관리 책임은 회원 본인에게 있습니다.

//                 제5조 (서비스의 제공)
//                 회사는 다음과 같은 서비스를 제공합니다.
//                 1. 오프라인 명함 OCR 인식 및 디지털 명함 생성
//                 2. 기존 회원과의 명함 기반 연결 기능
//                 3. 명함 및 프로필 관리 기능
//                 4. AI 기반 정보 분석 및 추천 기능
//                 5. 기타 회사가 정하는 서비스

//                 제6조 (OCR 및 AI 분석 관련 고지)
//                 1. OCR 및 AI 분석 결과는 자동화된 시스템에 의해 제공되며 정확성을 보장하지 않습니다.
//                 2. 회사는 OCR 인식 오류 또는 AI 분석 결과로 발생한 손해에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
//                 3. 이용자는 분석 결과를 참고 정보로 활용해야 합니다.

//                 제7조 (이용자의 의무)
//                 이용자는 다음 행위를 해서는 안 됩니다.
//                 1. 타인의 개인정보를 무단으로 수집·이용·공개하는 행위
//                 2. 허위 명함 등록 또는 타인 사칭 행위
//                 3. 서비스 운영을 방해하는 행위
//                 4. 관련 법령 및 본 약관을 위반하는 행위

//                 제8조 (서비스 이용 제한)
//                 회사는 이용자가 본 약관을 위반한 경우 사전 통지 없이 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.

//                 제9조 (지적재산권)
//                 1. 서비스 및 콘텐츠에 대한 지적재산권은 회사에 귀속됩니다.
//                 2. 이용자는 회사의 사전 동의 없이 콘텐츠를 상업적으로 이용할 수 없습니다.

//                 제10조 (책임의 제한)
//                 회사는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.

//                 제11조 (준거법 및 관할)
//                 본 약관과 관련된 분쟁은 대한민국 법을 따르며, 관할 법원은 회사 본점 소재지를 따릅니다.
//               </p>
//             </div>
//           </div>
//           <div className="px-6 py-4 border-t">
//             <Button
//               className="w-full"
//               variant="brand"
//               onClick={() => setShowTermsDialog(false)}
//             >
//               닫기
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
//         <DialogContent className="max-h-[90vh] p-0 flex flex-col">
//           <div className="px-6 py-4 border-b">
//             <DialogTitle>개인정보 처리방침</DialogTitle>
//             <DialogDescription className="text-xs text-[#64748B]">
//               개인정보 수집 및 이용에 대한 안내입니다.
//             </DialogDescription>
//           </div>

//           <div className="flex-1 overflow-y-auto px-6 py-4">
//             <div className="text-sm text-[#64748B] space-y-3 leading-relaxed">
//               <p>1. 개인정보의 수집 항목</p>
//               <p>
//                 필수 항목: 이름, 이메일, 전화번호, 소셜 로그인 식별값
//               </p>

//               <p>2. 개인정보의 이용 목적</p>
//               <p>
//                 회원 식별 및 본인 확인, 디지털 명함 서비스 제공,
//                 고객 문의 대응 및 서비스 개선
//               </p>

//               <p>3. 개인정보의 보유 및 이용 기간</p>
//               <p>
//                 회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.
//               </p>

//               <p>4. 개인정보의 제3자 제공</p>
//               <p>
//                 회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
//                 다만, 법령에 따른 경우는 예외로 합니다.
//               </p>

//               <p>5. 개인정보 보호 조치</p>
//               <p>
//                 회사는 개인정보 보호를 위해 접근 권한 관리, 암호화,
//                 보안 시스템을 운영합니다.
//               </p>
//             </div>
//           </div>

//           <div className="px-6 py-4 border-t">
//             <Button
//               className="w-full"
//               variant="brand"
//               onClick={() => setShowPrivacyDialog(false)}
//             >
//               닫기
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
