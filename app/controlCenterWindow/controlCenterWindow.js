const $ = require('jquery')

var currentIndex = 0

document.getElementById('naviList').children[currentIndex].children[0].className = 'indicater'
var naviItems = document.getElementsByClassName('naviItem')

for (let index = 0; index < naviItems.length; index++) {
    const naviItem = naviItems[index];
    naviItem.addEventListener('mouseover', (event) => {
        var bar = event.target.children[0]
        bar.className = 'active'
    })

    naviItem.addEventListener('mouseout', (e) => {
        var bar = e.target.children[0]
        if (indexOf(naviItems, e.target) == currentIndex) {
            bar.className = 'indicater'
        } else {
            bar.className = 'inactive'
        }
    })

    naviItem, addEventListener('click', (e) => {
        naviItems[currentIndex].children[0].className = 'inactive'
        currentIndex = indexOf(naviItems, e.target)
        e.target.children[0].className = 'indicater'
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