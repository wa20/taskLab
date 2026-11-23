
export const validateTaskTitle = (title: string): string => {

    const trimmedTitle = title.trim()

    if(trimmedTitle.length === 0){
        throw new Error('Title must not be blank')
    }

    if(trimmedTitle.length > 120){
        throw new Error('Title must not exceed 120 characters')
    }

    return trimmedTitle

}