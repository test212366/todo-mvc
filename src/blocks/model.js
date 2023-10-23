import {Controller} from "./controller";

export class Model {
    constructor(titleCard, passwordCard, basicCash = 1000) {
        this._titleCard = titleCard
        this._passwordCard = passwordCard
        this._basicCash = basicCash
    }
    async submitCard(user) {
        await fetch('https://atm-automat-default-rtdb.europe-west1.firebasedatabase.app/cards.json', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    async preparingData(password, title) {
        const resp = await fetch('https://atm-automat-default-rtdb.europe-west1.firebasedatabase.app/cards.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responce = await resp.json()
        try {
            this.preparingDataResponce(responce, password, title)
        }catch {
            return
        }
    }
    preparingDataResponce(responce, password, title) {
        for (const key in responce) {
            if (Object.hasOwnProperty.call(responce, key)) {
                const element = responce[key];
                if(element._passwordCard === password && element._titleCard === title) {
                    const controller = new Controller()
                    controller.preparingDataCardDisplay(element)
                    console.log('вход успешен')
                }
            }
        }
    }
}