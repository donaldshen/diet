const secondsDaily = 24 * 3600
localStorage.removeItem('history')
const data = {
  weight: +localStorage.getItem('weight'),
  activeIndex: +localStorage.getItem('activeIndex') || 30,
  ratio: +localStorage.getItem('ratio'),
  calories: +localStorage.getItem('calories'),
  get caloriesDaily() {
    return Math.round(this.weight * this.activeIndex * (1 - this.ratio / 100))
  },
  get caloriesSecondly() {
    return Math.round(this.caloriesDaily / secondsDaily)
  },
  history: localStorage.getItem('history2'),
}
const lastTime = localStorage.getItem('lastTime')
if (lastTime) {
  data.calories += ((data.caloriesDaily / secondsDaily) * (Date.now() - lastTime)) / 1000
}
if (typeof data.history === 'string') {
  data.history = data.history.split(';')
    .map(seg => seg.split(','))
    .slice(0, 20)
} else {
  data.history = []
}

function start() {
  const view = {
    weight: document.querySelector('#weight'),
    activeIndex: document.querySelector('#active-index'),
    activeIndexText: document.querySelector('#active-index-text'),
    ratio: document.querySelector('#ratio'),
    ratioText: document.querySelector('#ratio-text'),
    caloriesDaily: document.querySelector('#calories-daily'),
    calories: document.querySelector('#calories'),
    item: document.querySelector('#item'),
    consume: document.querySelector('#consume'),
    history: document.querySelector('#history'),
  }
  const insertHistory = (d, item, c, m = 'append') => {
    const e = document.createElement('div')
    d = new Date(+d).toLocaleString()
    e.innerText = `${d}: ${c}千卡, ${item}`
    view.history[m](e)
  }

  view.weight.value = data.weight
  view.activeIndex.value = data.activeIndex
  view.activeIndexText.textContent = data.activeIndex
  view.ratio.value = data.ratio
  view.caloriesDaily.textContent = data.caloriesDaily
  view.ratioText.textContent = data.ratio + '%'
  data.history.forEach(seg => insertHistory(...seg))

  view.activeIndex.addEventListener('input', e => {
    view.activeIndexText.textContent = e.target.value
  })

  view.ratio.addEventListener('input', e => {
    view.ratioText.textContent = e.target.value + '%'
  })

  document.querySelector('#save').addEventListener('click', () => {
    data.weight = view.weight.value
    data.activeIndex = view.activeIndex.value
    data.ratio = view.ratio.value
    view.caloriesDaily.textContent = data.caloriesDaily
    save()
  })
  document.querySelector('#eat').addEventListener('click', () => {
    const now = Date.now()
    const item = view.item.value
    const c = +view.consume.value
    insertHistory(now, item, c, 'prepend')
    data.history.unshift([now, item, c])
    data.calories -= c
    view.item.value = ''
    view.consume.value = ''
    save()
  })

  setInterval(() => {
    data.calories += data.caloriesDaily / secondsDaily
    view.calories.textContent = data.calories.toFixed(2)
    view.calories.style.color = data.calories > 0 ? 'green' : 'red'
  }, 1000)
}

function save() {
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'history') {
      localStorage.setItem('history2', v.map(seg => seg.join(',')).join(';'))
    } else {
      localStorage.setItem(k, v)
    }
  })
  localStorage.setItem('lastTime', Date.now())
}

document.addEventListener('DOMContentLoaded', start)
