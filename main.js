const secondsDaily = 24 * 3600
const data = {
  weight: +localStorage.getItem('weight'),
  ratio: +localStorage.getItem('ratio'),
  calories: +localStorage.getItem('calories'),
  get caloriesDaily() {
    const activeIndex = 32
    return Math.round(this.weight * activeIndex * (1 - (this.ratio / 100)))
  },
  get caloriesSecondly() {
    return Math.round(this.caloriesDaily / secondsDaily)
  },
}
const lastTime = localStorage.getItem('lastTime')
if (lastTime) data.calories += data.caloriesDaily / secondsDaily * (Date.now() - lastTime) / 1000

function start() {
  const view = {
    weight: document.querySelector('#weight'),
    ratio: document.querySelector('#ratio'),
    ratioText: document.querySelector('#ratio-text'),
    caloriesDaily: document.querySelector('#calories-daily'),
    calories: document.querySelector('#calories'),
    consume: document.querySelector('#consume'),
  }

  view.weight.value = data.weight
  view.ratio.value = data.ratio
  view.caloriesDaily.textContent = data.caloriesDaily
  view.ratioText.textContent = data.ratio + '%'

  document.querySelector('#save').addEventListener('click', () => {
    data.weight = view.weight.value
    data.ratio = view.ratio.value
    view.caloriesDaily.textContent = data.caloriesDaily
  })
  document.querySelector('#eat').addEventListener('click', () => {
    data.calories -= +view.consume.value
  })

  view.ratio.addEventListener('input', e => {
    view.ratioText.textContent = e.target.value + '%'
  })

  setInterval(() => {
    data.calories += data.caloriesDaily / secondsDaily
    view.calories.textContent = data.calories.toFixed(2)
  }, 1000)
}

function save() {
  Object.entries(data).forEach(([k, v]) => {
    localStorage.setItem(k, v)
  })
  localStorage.setItem('lastTime', Date.now())
  console.log('pagehide')
}

document.addEventListener('DOMContentLoaded', start)
window.addEventListener('pagehide', save)
