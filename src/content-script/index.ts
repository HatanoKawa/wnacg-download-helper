const checkIsWnacgSite = () => {
  return location.host.includes('wnacg')
}
const checkIsAlbumMainPage = () => {
  return checkIsWnacgSite() && location.pathname.includes('photos-index-aid-')
}
const downloadLinkList: string[] = []
if (checkIsAlbumMainPage()) {
  const container = document.querySelector('#bodywrap.userwrap>.asTB>.asTBcell')

  const btnTag = document.createElement('a')
  btnTag.className = 'btn'
  btnTag.style.width = '130px'
  btnTag.href = location.pathname.replace('photos', 'download')
  btnTag.innerText = '转到下载页面'
  container?.append(btnTag)

  const downloadPanel = document.createElement('div')
  downloadPanel.style.width = '130px'
  downloadPanel.style.display = 'inline-flex'
  downloadPanel.style.justifyContent = 'around'
  downloadPanel.innerText = '载入下载链接中...'
  container?.append(downloadPanel)

  const dlIFrame = document.createElement('iframe')
  dlIFrame.src = location.pathname.replace('photos', 'download')
  dlIFrame.style.display = 'none'
  dlIFrame.onload = () => {
    downloadPanel.innerHTML = ''
    downloadPanel.style.width = '200px'
    const dlATags = [...dlIFrame.contentDocument.querySelectorAll('body>.adbox>#adsbox>.down_btn')]
    dlATags.map((aNode, nodeIndex) => {
      // 存储下载链接以用于收集并统一复制
      downloadLinkList.push(aNode.href)

      // 生成下载按钮
      const dlTag = document.createElement('a')
      dlTag.href = aNode.href
      dlTag.innerText = `下载${nodeIndex + 1}`
      downloadPanel.append(dlTag)

      // 生成复制按钮
      const cpTag = document.createElement('a')
      cpTag.onclick = () => navigator.clipboard.writeText(aNode.href)
      cpTag.innerText = `复制${nodeIndex + 1}`
      cpTag.href = 'javascript:void(0)'
      downloadPanel.append(cpTag)
    })
  }
  document.body.append(dlIFrame)
}
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === 'getDownloadLinks') {
    sendResponse({
      albumName: document.querySelector('#bodywrap>h2')?.innerHTML ?? document.title,
      url: location.href,
      downloadLinks: downloadLinkList
    })
  }
})
