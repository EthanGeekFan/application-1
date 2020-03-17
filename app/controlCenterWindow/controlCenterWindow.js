const $ = require('jquery')
const fs = require('fs')
const path = require('path')

var confPath = path.join(__dirname, '../../config')

var currentIndex = 0

document.getElementById('naviList').children[currentIndex].children[0].className = 'indicater'
var naviItems = document.getElementsByClassName('naviItem')

for (let index = 0; index < naviItems.length; index++) {
    const naviItem = naviItems[index];
    naviItem.addEventListener('mouseover', (event) => {
        var bar = event.target.children[0]
        if (bar != undefined && bar != null) {
            bar.className = 'active'
        }
    })

    naviItem.addEventListener('mouseout', (e) => {
        var bar = e.target.children[0]
        if (bar !== undefined && bar !== null) {
            if (indexOf(naviItems, e.target) == currentIndex) {
                bar.className = 'indicater'
            } else {
                bar.className = 'inactive'
            }
        }

    })

    naviItem.addEventListener('click', (e) => {
        var bar = naviItems[currentIndex].children[0]
        if (bar !== undefined && bar !== null) {
            bar.className = 'inactive'
            currentIndex = indexOf(naviItems, e.target)
            e.target.children[0].className = 'indicater'
        }
    })
}

function indexOf(collection, obj) {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i] == obj) {
            return i
        }
    }
    return -1
}

// root path is: new/

var configFile = JSON.parse(fs.readFileSync(path.join(confPath, 'config.json')))

var configurations = configFile['configurations']

for (let i = 0; i < configurations.length; i++) {
    const configItem = configurations[i];
    var name = configItem['name']
    var type = configItem['type']
    var id = configItem['id']
    var value = configItem['value']
    console.log(configItem['name'], configItem['type'])
    if (type == 'boolean') {
        createBoolConfigItem(name, id, value)
    } else if (type == 'scale') {
        createScaleConfigItem(name, id, value, configItem)
    } else if (type == 'input') {
        createInputConfigItem(name, id, value)
    }
}

function createBoolConfigItem(name, id, value) {
    var ul = document.getElementById('settings')
    var li = document.createElement('li')
    var div = document.createElement('div')
    div.className = 'prefItem'
    var p = document.createElement('p')
    p.innerHTML = name
    var label = document.createElement('label')
    label.className = 'switch'
    var input = document.createElement('input')
    input.type = 'checkbox'
    input.id = id
    input.checked = value
    input.addEventListener('change', (e) => {
        var success = updateConfig(id, e.target.checked)
        if (!success) {
            console.error('Failed to write configurations')
        }
    })
    var span = document.createElement('span')
    span.className = 'slider round'
    label.appendChild(input)
    label.appendChild(span)
    div.appendChild(p)
    div.appendChild(label)
    li.appendChild(div)
    ul.appendChild(li)
}

function createScaleConfigItem(name, id, value, configItem) {
    var ul = document.getElementById('settings')
    var li = document.createElement('li')
    var div = document.createElement('div')
    div.className = 'prefItem'
    var p = document.createElement('p')
    p.innerHTML = name
    var input = document.createElement('input')
    input.type = 'range'
    var min = configItem['min'] || 1
    var max = configItem['max'] || 100
    input.min = min
    input.max = max
    input.id = id
    console.log(value, min, max)
    input.value = value
    var portion = (value - min) / (max - min) * 100
    input.style = 'background: linear-gradient(to right, #6e8efb, #a777e3 ' + portion + '%, white ' + portion + '%, white)'
    input.addEventListener('input', (e) => {
        var ele = e.target
        var min = ele.min
        var max = ele.max
        var portion = (ele.value - min) / (max - min) * 100
        ele.style = 'background: linear-gradient(to right, #6e8efb, #a777e3 ' + portion + '%, white ' + portion + '%, white)'
        console.log(min, max)
    })
    input.addEventListener('change', (e) => {
        updateConfig(id, e.target.value)
    })
    div.appendChild(p)
    div.appendChild(input)
    li.appendChild(div)
    ul.appendChild(li)
}

function createInputConfigItem(name, id, value) {

}

function updateConfig(id, value) {
    for (let i = 0; i < configurations.length; i++) {
        const config = configurations[i];
        if (config['id'] === id) {
            config['value'] = value
            fs.writeFileSync(path.join(confPath, 'config.json'), JSON.stringify(configFile))
            return true
        }
    }
    return false
}