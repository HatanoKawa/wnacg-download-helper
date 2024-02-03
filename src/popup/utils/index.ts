import dayjs from "dayjs";

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
