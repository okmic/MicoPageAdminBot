
export const telegramMenuMsgs = {
    getData: "Посмотреть данные сайта 👁️",
    updateData: "Обновить данные 🔄",
    settings: "Настройки 🛠️",
    about: "O MicoPage 📝",
    downloadSite: "Загрузить сайт (ZIP) 🚀📤",
    deployToFtp: "Обновить сайт на хостинге 🛠️🌍",
    addFtpUser: "Добавить доступ к FTP-серверу ⚙️🖥"
}


export const universalMsgs = {
    defaultErrorMsg: "Произошла ошибка, попробуйте позже или напишите администратору",
}

export const getAllWordExceptions = () => {

    const resultArrayExcWords = []

    for(let key in telegramMenuMsgs){
        resultArrayExcWords.push(telegramMenuMsgs[key])
    }

    return resultArrayExcWords

}