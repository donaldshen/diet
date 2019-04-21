const secondsDaily = 24 * 3600
const data = {
  weight: +localStorage.getItem('weight'),
  ratio: +localStorage.getItem('ratio'),
  calories: +localStorage.getItem('calories'),
  get caloriesDaily() {
    const activeIndex = 32
    return Math.round(this.weight * activeIndex * (1 - this.ratio / 100))
  },
  get caloriesSecondly() {
    return Math.round(this.caloriesDaily / secondsDaily)
  },
  history: localStorage.getItem('history') || [],
}
const lastTime = localStorage.getItem('lastTime')
if (lastTime) {
  data.calories += ((data.caloriesDaily / secondsDaily) * (Date.now() - lastTime)) / 1000
}
if (typeof data.history === 'string') {
  data.history = data.history.split(',')
}

function start() {
  const view = {
    weight: document.querySelector('#weight'),
    ratio: document.querySelector('#ratio'),
    ratioText: document.querySelector('#ratio-text'),
    caloriesDaily: document.querySelector('#calories-daily'),
    calories: document.querySelector('#calories'),
    consume: document.querySelector('#consume'),
    history: document.querySelector('#history'),
  }
  const prependHistory = (d, c) => {
    const e = document.createElement('div')
    d = new Date(+d).toLocaleString()
    e.innerText = `${d}: ${c}千卡`
    view.history.prepend(e)
  }

  view.weight.value = data.weight
  view.ratio.value = data.ratio
  view.caloriesDaily.textContent = data.caloriesDaily
  view.ratioText.textContent = data.ratio + '%'
  for (let i = 0; i < data.history.length; i += 2) {
    prependHistory(data.history[i], data.history[i + 1])
  }

  document.querySelector('#save').addEventListener('click', () => {
    data.weight = view.weight.value
    data.ratio = view.ratio.value
    view.caloriesDaily.textContent = data.caloriesDaily
    save()
  })
  document.querySelector('#eat').addEventListener('click', () => {
    const v = +view.consume.value
    prependHistory(Date.now(), v)
    data.history.unshift(Date.now(), v)
    data.calories -= v
    view.consume.value = ''
    save()
  })

  view.ratio.addEventListener('input', e => {
    view.ratioText.textContent = e.target.value + '%'
  })

  setInterval(() => {
    data.calories += data.caloriesDaily / secondsDaily
    view.calories.textContent = data.calories.toFixed(2)
    view.calories.style.color = data.calories > 0 ? 'green' : 'red'
  }, 1000)
}

function save() {
  Object.entries(data).forEach(([k, v]) => {
    localStorage.setItem(k, v)
  })
  localStorage.setItem('lastTime', Date.now())
}

document.addEventListener('DOMContentLoaded', start)
