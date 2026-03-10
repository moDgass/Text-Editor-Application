//all of the client side behaviour is in this file

// helper to update counters
function updateCounters() {
  const text = editor.innerText

  // character count is length of innerText
  const charCount = text.length
  charCountSpan.textContent = 'Chars: ' + charCount

  // words are separated by whitespace
  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  wordCountSpan.textContent = 'Words: ' + words.length

  // lines count by newline characters
  const lines = text.split(/\n/).length
  lineCountSpan.textContent = 'Lines: ' + lines
}

// start a timer when the editor is focused
let secondsElapsed = 0
let timerInterval = null
function startTimer() {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    secondsElapsed++
    const m = String(Math.floor(secondsElapsed / 60)).padStart(2, '0')
    const s = String(secondsElapsed % 60).padStart(2, '0')
    timerSpan.textContent = `Time: ${m}:${s}`
  }, 1000)
}

// simple function to create palette picker
// I will reuse this for both text and background
function createColorPicker(container, label, applyFn) {
  // container is an element where I append controls
  const input = document.createElement('input')
  input.type = 'color'
  input.value = '#000000'
  input.addEventListener('input', () => {
    applyFn(input.value)
  })
  const lab = document.createElement('label')
  lab.textContent = label + ' ' // add a space after label for better spacing
  lab.appendChild(input)
  container.appendChild(lab)
}

// reference main elements after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.editor = document.getElementById('editor')
  window.charCountSpan = document.getElementById('charCount')
  window.wordCountSpan = document.getElementById('wordCount')
  window.lineCountSpan = document.getElementById('lineCount')
  window.timerSpan = document.getElementById('timer')

  // initial counter update
  updateCounters()

  // font family change
  document.getElementById('fontFamily').addEventListener('change', e => {
    editor.style.fontFamily = e.target.value
  })

  // font size selectors
  const sizeSelect = document.getElementById('fontSize')
  sizeSelect.addEventListener('change', e => {
    editor.style.fontSize = e.target.value
  })

  document.getElementById('increaseSize').addEventListener('click', () => {
    const current = parseInt(window.getComputedStyle(editor).fontSize)
    editor.style.fontSize = (current + 2) + 'px'
  })
  document.getElementById('decreaseSize').addEventListener('click', () => {
    const current = parseInt(window.getComputedStyle(editor).fontSize)
   if(current > 8) editor.style.fontSize = (current - 2) + 'px'
  })

  // formatting buttons
  document.getElementById('boldBtn').addEventListener('click', () => {
    document.execCommand('bold')
  })
  document.getElementById('italicBtn').addEventListener('click', () => {
    document.execCommand('italic')
  })
  document.getElementById('underlineBtn').addEventListener('click', () => {
    document.execCommand('underline')
  })

  // alignment
  document.querySelectorAll('.align').forEach(btn => {
    btn.addEventListener('click', () => {
      // map simple keyword to the proper execCommand name
      const map = {
        left: 'justifyLeft',
        center: 'justifyCenter',
        right: 'justifyRight',
        justify: 'justifyFull'
      };
      document.execCommand(map[btn.dataset.align]);

      // active styling for selected alignment
      document.querySelectorAll('.align').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  // color pickers
  createColorPicker(document.getElementById('textColorPicker'), 'Text', value => {
    document.execCommand('foreColor', false, value)
  })
  createColorPicker(document.getElementById('bgColorPicker'), 'Background', value => {
    document.execCommand('hiliteColor', false, value)
  })

  // find replace toggle
  const findDiv = document.getElementById('findReplace')
  document.getElementById('toggleFind').addEventListener('click', () => {
    findDiv.classList.toggle('hidden')
  })
  document.getElementById('doReplace').addEventListener('click', () => {
    const findValue = document.getElementById('findInput').value
    const replaceValue = document.getElementById('replaceInput').value
    if (findValue) {
      const html = editor.innerHTML
      editor.innerHTML = html.split(findValue).join(replaceValue)
    }
    updateCounters()
  })

  // image insertion
  document.getElementById('insertImage').addEventListener('click', () => {
    const url = document.getElementById('imgUrl').value
    if (url) {
      const img = document.createElement('img')
      img.src = url
      img.style.maxWidth = '100%'
      document.getElementById('images').appendChild(img)
      document.getElementById('imgUrl').value = ''
    }
  })

  // counters and timer updates when editing
  editor.addEventListener('input', () => {
    updateCounters()
  })
  editor.addEventListener('focus', () => {
    startTimer()
  })

  // margin and padding control
  document.getElementById('marginCtrl').addEventListener('input', e => {
    editor.style.margin = e.target.value + 'px'
  })
  document.getElementById('paddingCtrl').addEventListener('input', e => {
    editor.style.padding = e.target.value + 'px'
  })

  // timer reset
  document.getElementById('resetTimer').addEventListener('click', () => {
    secondsElapsed = 0
    timerSpan.textContent = 'Time: 00:00'
  })

  // theme selection for toolbar and editor styling
  document.getElementById('themeSelector').addEventListener('change', e => {
    const theme = e.target.value
    const toolbar = document.getElementById('toolbar')
    toolbar.className = theme

    // Keep editor theme in sync with toolbar
    editor.className = theme + 'Theme'
  })

  // set initial theme class
  document.getElementById('themeSelector').dispatchEvent(new Event('change'))
})
