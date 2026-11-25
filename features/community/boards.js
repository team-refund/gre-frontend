export const BOARDS = [
  { slug: 'free-posts', title: '자유 게시판', badge: '자유',
    description: '해외직구에 대한 경험과 팁을 자유롭게 공유해요.',
    posts: [
      ['해외직구 환불 성공 팁 공유해요', '환불 요청부터 처리 완료까지의 경험을 정리했어요.',
        { author: '환불경험자', updatedAt: '2026-11-23T10:30:00+09:00' }],
      ['반품 배송비, 이렇게 해결했어요', '해외 반품을 진행할 때 알아두면 좋은 정보입니다.',
        { author: '직구기록', updatedAt: '2026-11-22T14:20:00+09:00' }],
      ['요즘 이용하는 해외 쇼핑몰 추천', '해외직구를 시작하는 분들을 위한 이야기예요.',
        { author: '쇼핑노트', updatedAt: '2026-11-21T18:10:00+09:00' }],
    ] },
  { slug: 'question-posts', title: '질문 게시판', badge: '질문',
    description: '환불·교환 관련 고민을 묻고 답해요.',
    posts: [
      ['판매자가 환불을 거절했어요', '상품에 문제가 있는데 환불 요청을 받아주지 않아요.',
        { author: '직구초보', updatedAt: '2026-11-23T13:45:00+09:00' }],
      ['교환 신청 후 연락이 없어요', '교환을 접수했는데 아직 아무런 답변이 없어요.',
        { author: '교환문의', updatedAt: '2026-11-22T16:05:00+09:00' }],
      ['반품 배송비는 누가 부담하나요?', '불량 상품을 해외로 돌려보내려면 어떻게 하나요?',
        { author: '구매기록', updatedAt: '2026-11-23T19:35:00+09:00' }],
    ] },
  { slug: 'dispute-posts', title: '피해사례 게시판', badge: '피해사례',
    description: '실제 피해 경험과 해결 과정을 함께 확인해요.',
    posts: [
      ['환불 지연 피해 경험을 공유합니다', '판매자에게 환불을 요청한 이후 진행 상황입니다.',
        { author: '환불기록', updatedAt: '2026-11-23T11:15:00+09:00' }],
      ['해외 배송 미도착 피해사례', '미배송 주문에 대해 판매자에게 문의하고 있어요.',
        { author: '배송문의', updatedAt: '2026-11-22T17:50:00+09:00' }],
      ['교환 거절 이후 대응한 방법', '판매자 답변과 대응 과정을 정리했어요.',
        { author: '대응노트', updatedAt: '2026-11-21T12:25:00+09:00' }],
    ] },
];

const QUESTION_DISCUSSIONS = {
  2: {
    acceptedCommentId: 'return-shipping-answer',
    comments: [
      {
        id: 'return-shipping-follow-up',
        author: '직구초보',
        body: '판매자에게 반품 라벨을 받을 수 있는지도 확인해 보세요.',
      },
      {
        id: 'return-shipping-answer',
        author: '환불경험자',
        body: '상품 불량 사진과 주문번호를 보내고, 판매자에게 반품 배송비 지원 여부를 먼저 물어보세요.',
      },
    ],
  },
};

export function getQuestionDiscussion(postIndex) {
  const discussion = QUESTION_DISCUSSIONS[postIndex];
  const comments = discussion?.comments ?? [];
  const accepted = comments.find(({ id }) => id === discussion?.acceptedCommentId);

  return {
    accepted,
    comments: comments.filter(({ id }) => id !== accepted?.id),
    status: accepted ? 'closed' : 'open',
  };
}
