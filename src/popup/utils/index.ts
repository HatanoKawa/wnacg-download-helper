import dayjs from "dayjs";

export const gatAllTabsAtAlbumMainLocation = async () => {
  return chrome.tabs.query({
    url: 'https://www.wnacg.com/photos-index-aid-*.html'
  })
}

export const sendActionToAllTabsAtAlbumMainLocation = async (actionType: string) => {
  return gatAllTabsAtAlbumMainLocation()
    .then(tabs => {
      return Promise.allSettled(
        tabs.map(tabData => {
          return chrome.tabs.sendMessage(
            tabData.id!,
            { type: actionType }
          ).then(res => ({
            result: res,
            tabId: tabData.id,
          }))
        })
      )
    })
}

export const downloadJsonAsFile = (json: any, filename: string) => {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const formatTime = (time: number) => {
  return dayjs(time).format("YYYY-MM-DD HH-mm-ss")
}
