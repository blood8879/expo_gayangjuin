#!/bin/bash

# Expo Updates 배포 스크립트
# 사용법: ./scripts/deploy-update.sh [branch] [message]
# 예시: ./scripts/deploy-update.sh production "fix: login bug fix"

# 기본값 설정
BRANCH=${1:-production}
MESSAGE=${2:-"업데이트 배포"}

echo "🚀 Expo Updates 배포 시작..."
echo "📋 브랜치: $BRANCH"
echo "💬 메시지: $MESSAGE"
echo ""

# 현재 git 상태 확인
if ! git diff --quiet HEAD; then
    echo "⚠️  커밋되지 않은 변경사항이 있습니다."
    echo "📝 변경사항을 커밋하고 다시 시도해주세요."
    exit 1
fi

# 업데이트 배포
echo "🔄 업데이트 배포 중..."
if npx eas update --branch "$BRANCH" --message "$MESSAGE"; then
    echo ""
    echo "✅ 업데이트 배포 완료!"
    echo "🎉 $BRANCH 브랜치에 업데이트가 배포되었습니다."
    echo "📱 앱을 다시 시작하면 업데이트가 적용됩니다."
else
    echo ""
    echo "❌ 업데이트 배포 실패"
    echo "🔍 로그를 확인하여 문제를 해결해주세요."
    exit 1
fi