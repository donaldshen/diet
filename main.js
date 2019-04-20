function main() {
  const view = {
    weight: document.querySelector('#weight'),
    height: document.querySelector('#height'),
    ratio: document.querySelector('#ratio'),
    ratioText: document.querySelector('#ratio-text'),
    calories: document.querySelector('#calories'),
  }
  const data = {
    weight: localStorage.getItem('weight') || 0,
    height: localStorage.getItem('height') || 0,
    ratio: localStorage.getItem('ratio') || 0,
    calories: localStorage.getItem('calories') || 0,
  }
  view.ratio.addEventListener('input', e => {
    console.log(e)
    view.ratioText.textContent = e.target.value + '%'
  })
}

document.addEventListener('DOMContentLoaded', main)
