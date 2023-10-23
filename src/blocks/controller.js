import {Model} from "./model";
import {View} from "./view";

export class Controller {
    constructor() {

    }
    preparingDataCard(titleCard, password) {
        this.model = new Model(titleCard, password)
        this.model.submitCard(this.model)
    }
    preparingDataAll(password, title) {
        const model = new Model()
        model.preparingData(password, title)
    }
    preparingDataCardDisplay(card) {
        const view = new View()
        view.updateDisplayStart(card)
    }
}