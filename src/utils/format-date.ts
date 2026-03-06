import { format } from "date-fns"

export const formatLocalDate = (date: Date) => {
    return format(new Date(date), "dd-MM-yyyy")
}