class Character {
    constructor(values, htmlElments) {
        this.values = values
        this.htmlElments = htmlElments
    }

    init() {
        this._renderPersonalInfo()
        this._renderSkills()
        this._renderLevels()
        this._controlTabs()
        this._renderInventory()
    }

    _renderPersonalInfo() {
        document.querySelector(this.htmlElments.name).innerText = this.values.name
        document.querySelector(this.htmlElments.bg).innerText = this.values.background
        document.querySelector(this.htmlElments.user).innerText = this.values.user
        document.querySelector(this.htmlElments.avatar).innerHTML = `<img crossorigin="anonymous" src="${this.values.avatar}" alt="${this.values.name}">`
    }

    get level() {
        return Object.values(this.values.level).reduce(
            (previousValue, currentValue) => previousValue + currentValue
        );
    }

    _renderInventory() {
        const items = Object.keys(this.values.inventory)
        document.querySelectorAll(this.htmlElments.inventoryTotal).forEach(element => element.innerText = items.length)
        const renderedItems = items.map(index => {
            const item = this.values.inventory
            return `
            <tr>
                <td>${item[index].name}</td>
                <td><span class="tag is-link is-medium">${item[index].type}</span></td>
                <td>${item[index].damage === null ? `-` : `<span class="tag is-medium">${item[index].damage}</span>`}</td>
                <td>
                    <button class="button is-danger remove-item-inventory" data-index="${index}">
                        <span class="icon">
                        <i class="fa-solid fa-trash-can"></i>
                        </span>
                    </button>
                </td>
            </tr>
            `
        }).join('')
        document.querySelector(this.htmlElments.tableInventory + ' tbody').innerHTML = renderedItems
        setTimeout(() => {
            const removeItemsBtn = document.querySelectorAll('.remove-item-inventory')
            removeItemsBtn.forEach(btn => {
                const indexToRemove = btn.dataset.index
                btn.onclick = () => {
                    delete this.values.inventory[indexToRemove]
                    this._renderInventory()
                }
            })
            this._controlInventory()
        },100)
    }

    _controlInventory() {
        const itemFieldElement = document.querySelector(this.htmlElments.inventoryItemField)
        const typeFieldElement = document.querySelector(this.htmlElments.inventoryTypeField)
        const damageFieldElement = document.querySelector(this.htmlElments.inventoryDamageField)
        const submitElement = document.querySelector(this.htmlElments.inventoryAddBtn)
        submitElement.onclick = () =>{
            let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2)
            this.values.inventory[uniqueId] = {
                type: typeFieldElement.value,
                name: itemFieldElement.value,
                damage: damageFieldElement.value === '' ? null : damageFieldElement.value 
            }
            this. _renderInventory()
        }
    }

    _controlTabs() {
        const currentActiveTab = document.querySelector(this.htmlElments.tabs + ' ' + this.htmlElments.tabActive)
        document.querySelector('#' + currentActiveTab.dataset.panel).style.display = 'block'
        const tabsElement = document.querySelectorAll(this.htmlElments.tabs + ' li')
        const tabsPanel = document.querySelectorAll(this.htmlElments.tabPanel)
        tabsElement.forEach(tab => {
            tab.onclick = () => {
                const tabActiveClassNoSelector = this.htmlElments.tabActive.replace('.', '')
                tabsElement.forEach(tab => tab.classList.remove(tabActiveClassNoSelector))
                tabsPanel.forEach(panel => panel.style.display = 'none')
                tab.classList.add(tabActiveClassNoSelector)
                const panel = document.querySelector('#' + tab.dataset.panel)
                panel.style.display = 'block'
            }
        })
    }

    _renderLevels() {
        const parentElement = document.querySelector(this.htmlElments.level)
        this._renderLevelList(parentElement, 'level')
        const generalLevelElement = document.querySelector(this.htmlElments.generalLevel)
        generalLevelElement.innerText = this.level
    }

    _renderSkills() {
        const parentElement = document.querySelector(this.htmlElments.skills)
        this._renderLevelList(parentElement, 'skills')
    }

    _increaseLevel(levels, level, step) {
        this.values[levels][level] = this.values[levels][level] + step
        this.init()
    }

    _decreaseLevel(levels, level, step) {
        this.values[levels][level] = this.values[levels][level] - step
        this.init()
    }

    _renderLevelList(parentElement, levels) {
        parentElement.innerHTML = Object.keys(this.values[levels]).map(level =>
            `<li>
            <span>${level}</span>
            <div class="control">
                <input class="input" type="text" placeholder="" disabled value="${this.values[levels][level]}">
            </div>
            <div>
                <button class="button update-level" data-type="_decreaseLevel" data-step="1" data-levels="${levels}" data-level="${level}">
                    <span class="icon is-small">
                        <i class="fa-solid fa-minus"></i>
                    </span>
                </button>
                <button class="button update-level" data-type="_increaseLevel" data-step="1" data-levels="${levels}" data-level="${level}">
                    <span class="icon is-small">
                        <i class="fa-solid fa-plus"></i>
                    </span>
                </button>
            </div>
        </li>`
        ).join('')
        setTimeout(() => {
            const buttons = document.querySelectorAll('.update-level')
            buttons.forEach(btn =>
                btn.onclick = () => {
                    this[btn.dataset.type](btn.dataset.levels, btn.dataset.level, Number(btn.dataset.step))
                })
        }, 100)
    }
}

class DiceRoll {
    diceOptions = [2, 4, 6, 8, 10, 12, 20, 100]
    constructor(htmlElments) {
        this.htmlElments = htmlElments
    }

    init() {
        this._renderButtons()
    }

    _renderButtons() {
        const resultField = document.querySelector(this.htmlElments.result)
        const diceRollQtyField = document.querySelector(this.htmlElments.qty)
        const parentElement = document.querySelector(this.htmlElments.menu)
        const btnRendered = this.diceOptions.map(dice => `<button class="button btn-roll-dice" data-dice="${dice}">d${dice}</button>`).join('')
        parentElement.innerHTML = btnRendered
        setTimeout(() => {
            const buttons = document.querySelectorAll('.btn-roll-dice')
            buttons.forEach(btn =>
                btn.onclick = () => {
                    const dice = Number(btn.dataset.dice)
                    const diceRoll = this.roll(Number(diceRollQtyField.value), dice)
                    resultField.innerHTML = this._renderDiceRollResult(diceRoll, dice)
                })
        }, 100)
    }

    roll(qty, dice) {
        const rolls = [...Array(Number(qty)).keys()].map(roll => {
            const rollValue = (Math.floor(Math.random() * (Number(dice) - 1 + 1))) + 1
            return Number(rollValue)
        })
        const totalResult = rolls.reduce(
            (previousValue, currentValue) => previousValue + currentValue
        )
        return {
            rolls,
            totalResult
        }
    }

    _renderDiceRoll(value, dice) {
        let state = ''
        if (value === 1) state = 'is-danger'
        if (value === dice) state = 'is-success'
        return `<span class="tag is-medium ${state}">${value}</span>`
    }

    _renderDiceRollResult(roll, dice) {
        let outputHtml = ''
        if (roll.rolls.length > 1) {
            outputHtml = roll.rolls.map(value => this._renderDiceRoll(value, Number(dice))).join(' + ') + ' = ' + this._renderDiceRoll(roll.totalResult, 0)
        } else {
            outputHtml = this._renderDiceRoll(roll.totalResult, dice)
        }
        return outputHtml
    }
}