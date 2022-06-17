import dayjs from 'dayjs'

export const formatDate = (date: string | undefined, format = 'YYYY-MM-DD') => {
  if (!date)
    return ''
  return dayjs(date).format(format)
}
