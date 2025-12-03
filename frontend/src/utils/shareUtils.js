/**
 * 분석 결과를 이미지로 변환하여 다운로드
 */
export const downloadResultAsImage = async (elementId, fileName) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('공유할 요소를 찾을 수 없습니다.');
      return;
    }

    // Canvas API를 사용하여 HTML을 이미지로 변환
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    // 이미지 다운로드
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${fileName}-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('이미지 변환 실패:', error);
    alert('이미지 저장에 실패했습니다.');
  }
};

/**
 * 웹 공유 API를 사용하여 공유
 */
export const shareResult = async (title, text, url) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('공유 실패:', error);
      }
    }
  } else {
    // 공유 API가 없으면 복사 기능 제공
    copyToClipboard(text);
    alert('공유 링크가 클립보드에 복사되었습니다.');
  }
};

/**
 * 텍스트를 클립보드에 복사
 */
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(() => {
    alert('클립보드 복사에 실패했습니다.');
  });
};

/**
 * SNS별 공유 링크 생성
 */
export const getSocialShareUrl = (platform, url, text) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
  };

  return shareUrls[platform];
};
