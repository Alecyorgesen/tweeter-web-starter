export interface View {
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined
  ) => string;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
  deleteMessage: (messageId: string) => void
}