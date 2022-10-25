class Character {
    constructor(values, htmlElments) {
        this.values = values
        this.htmlElments = htmlElments
    }

    init(){
        this._renderPersonalInfo()
        this._renderSkills()
        this._renderLevels()
        this._controlTabs()
        this._renderInventory()
    }

    _renderPersonalInfo(){
        document.querySelector(this.htmlElments.name).innerText = this.values.name
        document.querySelector(this.htmlElments.bg).innerText = this.values.background
        document.querySelector(this.htmlElments.user).innerText = this.values.user
        document.querySelector(this.htmlElments.avatar).innerHTML = `<img crossorigin="anonymous" src="${this.values.avatar}" alt="${this.values.name}">`
    }

    get level(){
        return Object.values(this.values.level).reduce(
            (previousValue, currentValue) => previousValue + currentValue
          );
    }

    _renderInventory(){
        const items = Object.keys(this.values.inventory)
        const renderedItems = items.map(index => {
            const item = this.values.inventory
            return `
            <tr>
                <td>${item[index].name}</td>
                <td>${item[index].type}</td>
                <td>${item[index].damage === null ? `NA` : `${item[index].damage.qty}${item[index].damage.dice}${item[index].damage.mod !== 0 ? item[index].damage.mod : '' }`}</td>
            </tr>
            `
        }).join('')
        console.log(renderedItems)
        document.querySelector(this.htmlElments.tableInventory + ' tbody').innerHTML = renderedItems
    }

    _controlTabs(){
        const currentActiveTab = document.querySelector(this.htmlElments.tabs + ' '+this.htmlElments.tabActive)
        document.querySelector('#'+currentActiveTab.dataset.panel).style.display = 'block'
        const tabsElement = document.querySelectorAll(this.htmlElments.tabs + ' li')
        const tabsPanel = document.querySelectorAll(this.htmlElments.tabPanel)
        tabsElement.forEach(tab =>{
            tab.onclick = () => {
                const tabActiveClassNoSelector = this.htmlElments.tabActive.replace('.','')
                tabsElement.forEach(tab => tab.classList.remove(tabActiveClassNoSelector))
                tabsPanel.forEach(panel => panel.style.display = 'none')
                tab.classList.add(tabActiveClassNoSelector)
                const panel = document.querySelector('#'+tab.dataset.panel)
                panel.style.display = 'block'
            }
        })
    }

    _renderLevels(){
        const parentElement = document.querySelector(this.htmlElments.level)
        this._renderLevelList(parentElement,'level')
        const generalLevelElement = document.querySelector(this.htmlElments.generalLevel)
        generalLevelElement.innerText = this.level
    }

    _renderSkills(){
        const parentElement = document.querySelector(this.htmlElments.skills)
        this._renderLevelList(parentElement,'skills')
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