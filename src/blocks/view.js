import {randomSort} from "./utils";
import {Controller} from "./controller";

export class View {
    constructor() {
        document.body.addEventListener('click', e => {
            e.preventDefault()
            switch (e.target.className) {
                case 'button-li':
                    this.printText(e.target.textContent)
                    break
                case 'input':
                    this.currentInput = e.target
                    break
                case 'btn random':
                    this.randomPassword()
                    break
                case 'btn createCard':
                    const $passwordReg = document.getElementById('passwordReg'),
                        $titleCardReg = document.getElementById('titleCardReg')
                    if ($passwordReg.value && $titleCardReg.value && $passwordReg.value.length > 5 && $titleCardReg.value.length > 9) {
                        this.controller = new Controller()
                        this.controller.preparingDataCard($titleCardReg.value, $passwordReg.value)
                        this.currentInput = ''
                        $passwordReg.value = ''
                        $titleCardReg.value = ''
                    } else {
                        this.currentInput = ''
                        $passwordReg.value = ''
                        $titleCardReg.value = ''
                    }
                    break
                case 'btn haveCard':
                    this.$registration = document.querySelector('.screen__registration-card')
                    this.$autorization  = document.querySelector('.screen__autorization-card')
                    this.$registration.style.display = 'none'
                    this.$autorization.style.display = 'block'
                    break
                case 'btn regist':
                    this.$registration.style.display = 'block'
                    this.$autorization.style.display = 'none'
                    break
                case 'btn confirm':
                    const $titleCardAuto = document.getElementById('titleCardAuto'),
                        $passwordAuto = document.getElementById('passwordAuto')
                    if($passwordAuto.value && $titleCardAuto.value && $passwordAuto.value.length > 5 && $titleCardAuto.value.length > 9) {
                        const cont = new Controller()
                        cont.preparingDataAll($passwordAuto.value, $titleCardAuto.value)
                        this.currentInput = ''
                        $passwordAuto.value = ''
                        $titleCardAuto.value = ''
                    } else {
                        this.currentInput = ''
                        $passwordAuto.value = ''
                        $titleCardAuto.value = ''
                    }
                    break
                case 'btn difrMCard':
                    const $setMCard = document.querySelector('.screen__display-setMCard')
                    $setMCard.style.display = 'block'
                    break
                default:
                    break
            }
        })
    }
    //start display and view data card in display
    updateDisplayStart(card) {
        const $registration = document.querySelector('.screen__registration-card'),
            $autorization  = document.querySelector('.screen__autorization-card'),
            $display = document.querySelector('.screen__display'),
            $balance = document.querySelector('.screen__display-balance')
        const $startSetMCard = document.querySelector('.startSetMCard')
        $display.style.display = 'block'
        $balance.textContent = `Ваш баланс на карте: ${card._basicCash}`
        $registration.style.display = 'none'
        $autorization.style.display = 'none'
        $startSetMCard.addEventListener('click', () => {
            const $setMcardSum = document.querySelector('.setMcardSum'),
                $setMcardNumber = document.querySelector('.setMcardNumber')
            if($setMcardSum.value <= card._basicCash) {
                if($setMcardNumber.value.length > 9) {
                    card._basicCash -= $setMcardSum.value
                    //сделать отображение на сервере. уменьшение _basicCash
                    $balance.textContent = `Ваш баланс на карте: ${card._basicCash}`
                    console.log(card)
                }
                $setMcardNumber.value = ''
                $setMcardSum.value = ''
                return
            } else {
                $setMcardNumber.value = ''
                $setMcardSum.value = ''
                return
            }
        })
    }
    //this.currentInput have current input, and when user click keyboard, currentInput.value += button.textContent
    printText(text) {
            if(text === 'Дом' || text === '<') return
            this.currentInput.value += text
    }
    //random sort password and view div and input
    randomPassword() {
        const array = [0,1,2,3,4,5,6,7,8,9]
        let password = ''
        password = randomSort(array, password)
        const $titleGeneration = document.querySelector('.title'),
            $passwordReg = document.getElementById('passwordReg')
        $titleGeneration.textContent = `Новый пароль: ${password}`
        $passwordReg.value = password
    }
}