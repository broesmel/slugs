const ifWord = 'if',
    loopWord = 'while',
    equalWord = 'is',
    notEqualWord = 'is_not',
    thenWord = 'then',
    andWord = 'and',
    orWord = 'or',
    stopWord = 'stop',
    showWord = 'tell',
    editWord = 'replace',
    deleteWord = 'forget';

let wordsAction = ['eat', stopWord, 'flee']

let wordsFirst = ['intro', 'start'].concat(wordsAction).concat([ifWord, loopWord, showWord, editWord, deleteWord, 'help', 'clear'])
const wordsForCmdString = [].concat(wordsFirst.slice(0, 2));
let wordsIfConditionLeft = [].concat(ENTITY_TYPES);
let wordsIfConditionRight = [].concat(SIZES, COLORCATS_HR, TEXTURES, SHAPES);
const wordsBoolean = [thenWord, equalWord, notEqualWord] //orWord, ;

let wordsLoop1 = ['fruit'];
let wordsLoop2 = [equalWord];
let wordsLoop3 = ['on', ] // 'close'
let wordsLoop4 = ['plant']


let wordsToShow = ATTRIBUTES.concat(EDITABLE_withSingular);

let wordsAll = wordsFirst.concat(wordsIfConditionLeft, wordsIfConditionRight, equalWord, notEqualWord, wordsBoolean, wordsAction, wordsToShow, wordsLoop1, wordsLoop2, wordsLoop3, wordsLoop4).concat(['hunting', , 'rule', 'routine', 1, 2, 3, 4, 5, 7, 8, 9]);

let wordsFilter = ['the', 'a', 'my', 'me', 'there']

let wordsAllArrays = [wordsAction, wordsFirst, wordsIfConditionLeft, wordsIfConditionRight, wordsBoolean, wordsToShow];
let wordsAllArraysStrings = ['wordsAction', 'wordsFirst', 'wordsIfConditionLeft', 'wordsIfConditionRight', 'wordsBoolean', 'wordsToShow'];

let logCount = 0;
let logMax = 5;

let logId = 0;

const terminal_container = document.getElementById('terminal_container');
const terminal_log = document.getElementById('terminal_log');
const terminal_log_input = document.getElementById('terminal_log_input');
const terminal_log_output = document.getElementById('terminal_log_output');
const autocomplete = document.getElementById('autocomplete');
const autocomplete_suggestions = document.getElementById('autocomplete_suggestions');
const terminal_input = document.getElementById('terminal_input');
const toBottomBtn = document.getElementById('toBottom');

let rgbaError = 'rgba(255,102,0)'
let rgbaOutput ='rgba(175,143,233)'
let rgbaInput = 'rgba(240,160,75)'


function clearInput() {
  terminal_input.value = '';
  autocomplete.innerHTML = '';
  autocomplete_suggestions.innerHTML = '';
}

var createRingBuffer = function(length){
  /* https://stackoverflow.com/a/4774081 */
  var pointer = 0, buffer = []; 

  return {
    get  : function(key){
        if (key < 0){
            return buffer[pointer+key];
        } else if (key === false){
            return buffer[pointer - 1];
        } else{
            return buffer[key];
        }
    },
    push : function(item){
      if(buffer[-1] === item) {
        return item;
      }
      buffer[pointer] = item;
      pointer = (pointer + 1) % length;
      return item;
    },
    prev : function(){
        var tmp_pointer = (pointer - 1) % length;
        if (buffer[tmp_pointer]){
            pointer = tmp_pointer;
            return buffer[pointer];
        }
    },
    next : function(){
      if (buffer[pointer]){
        pointer = (pointer + 1) % length;
        return buffer[pointer];
      }
    }
  };
};

let buffer = createRingBuffer(50);
let suggestions = []
let wordsToCompare = []

let eventTypes = ['keyup'];
eventTypes.forEach(t => {
 terminal_input.addEventListener(t, (e) => {
  if(terminal_input.value.length > 0 ) {
    // clean up input
    if(e.key==' ' && (terminal_input.value.at(e.target.Selectionstart-1) == ' ' )) {
      terminal_input.value = terminal_input.value.trimStart()
      return;
    }
    let input = terminal_input.value.replace('is not', 'is_not');
    terminal_input.value = input;
    let checkAgainst = input;

    wordsToCompare = wordsFirst;
    
    let wordsInput = input.match(/\w+/g);
    let wordsOfInterest = wordsInput;
    let current_word = wordsInput.at(-1);
    let last_word = (' ' + current_word).slice(1);
    
    if(wordsOfInterest[0] == ifWord) {
      wordsToCompare = wordsIfConditionLeft;
      checkAgainst = wordsOfInterest.at(-1);
      let i = 1
      for( ; i < wordsOfInterest.length; i++) {
        if(!wordsAll.includes(wordsOfInterest[i])) {
          wordsOfInterest = wordsOfInterest.slice(0, i);
          current_word = wordsOfInterest[i-1];
          break
        }
      }
      if(i == wordsInput.length) {
        checkAgainst = '';
      }
      // parse condition
      if(wordsOfInterest.length > 0) {
        // TODO: FIX AUTOCOMPLETE RENDER WITH WHITESPACE IN MIDDLE
        // IF even number of words, then we have...
        // if xx is yy then zz ... 
        if(wordsAction.includes(current_word)) {
          return;
        }
        else if(current_word == 'intro') {
          wordsToCompare = [1, 2, 3, 4]
        }
        // if XX is YY..., 
        else if(current_word == notEqualWord) {
          wordsToCompare = wordsIfConditionRight;
        }
        else if(wordsIfConditionRight.includes(current_word) || wordsOfInterest.at(-2) == equalWord) {
                    wordsToCompare = [thenWord];
        }
        // OR if XX ..., OR if XX is YY and ZZ ... 
        else if(wordsOfInterest.at(-2) == ifWord || wordsBoolean.includes(wordsOfInterest.at(-2))) {
          wordsToCompare = [equalWord]; 
          if(current_word == 'fruit') {
            wordsToCompare.push(notEqualWord)
          }
        }
        else if(current_word == thenWord) {
          wordsToCompare = ['eat'];
          if(wordsOfInterest.at(-4) == 'other_creature') {
            wordsToCompare = ['flee'];
          }
        } 
        // ELSE we have ...
        if(wordsBoolean.includes(current_word)) {
          // if XX is YY then ...,
          if(current_word == thenWord) {
            wordsToCompare = ['eat'];
            if(wordsOfInterest.at(-4) == 'other_creature') {
              wordsToCompare = ['flee'];
            }
          }
          // if XX is ..., 
          else if(current_word == equalWord || current_word == notEqualWord) {
            if(wordsOfInterest.includes('fruit')) {
              wordsToCompare = wordsIfConditionRight;
            } else if(wordsOfInterest.at(-2) == 'other_creature') {
              wordsToCompare = ['hunting']
            }
          }
          // OR if XX is YY and ... 
          else if(wordsBoolean.includes(wordsOfInterest.at(-2))) {
            wordsToCompare = wordsIfConditionLeft;
          }
        }
      }
    } else if(wordsOfInterest[0] == showWord) {
      wordsToCompare = wordsToShow;
      checkAgainst = wordsOfInterest.at(-1);
      let i = 1
      for( ; i < wordsOfInterest.length; i++) {
        if(!wordsAll.includes(wordsOfInterest[i])) {
          wordsOfInterest = wordsOfInterest.slice(0, i);
          current_word = wordsOfInterest[i-1];
          break
        }
      }
      if(i == wordsInput.length) {
        checkAgainst = '';
      }
      if(i>1) {
        return;
      }
    } else if(wordsOfInterest[0] == 'help') {
      wordsToCompare = wordsFirst;
      checkAgainst = wordsOfInterest.at(-1);
      let i = 1
      for( ; i < wordsOfInterest.length; i++) {
        if(!wordsAll.includes(wordsOfInterest[i])) {
          wordsOfInterest = wordsOfInterest.slice(0, i);
          current_word = wordsOfInterest[i-1];
          break
        }
      }
      if(i == wordsInput.length) {
        checkAgainst = '';
      }
      if(i>1) {
        return;
      }
    } else if(wordsOfInterest[0] == deleteWord || wordsOfInterest[0] == editWord) {
      wordsToCompare = EDITABLE_withSingular;
      if(wordsOfInterest[0] == deleteWord) {
        wordsToCompare = ['rule', 'routine']
      }
      checkAgainst = wordsOfInterest.at(-1);
      let i = 1
      for( ; i < wordsOfInterest.length; i++) {
        if(!wordsAll.includes(wordsOfInterest[i])) {
          wordsOfInterest = wordsOfInterest.slice(0, i);
          current_word = wordsOfInterest[i-1];
          break
        }
      }
      if(i == wordsInput.length) {
        checkAgainst = '';
      }
      if(i>1) {
        return;
      }
    } else if(wordsOfInterest[0] == loopWord) {
      wordsToCompare = wordsLoop1;
      checkAgainst = wordsOfInterest.at(-1);
      let i = 1
      for( ; i < wordsOfInterest.length; i++) {
        if(!wordsAll.includes(wordsOfInterest[i])) {
          wordsOfInterest = wordsOfInterest.slice(0, i);
          current_word = wordsOfInterest[i-1];
          break
        }
      }
      if(i == wordsInput.length) {
        checkAgainst = '';
      }
      // parse condition
      if(wordsOfInterest.length > 1) {
        if(wordsLoop1.includes(current_word)) {
          wordsToCompare = wordsLoop2;
        }
        else if(wordsLoop2.includes(current_word)) {
          wordsToCompare = wordsLoop3
        } else if(current_word == 'on') {
          wordsToCompare = wordsLoop4;
        } else if(wordsLoop4.includes(current_word) || current_word == 'close') {
          wordsToCompare = ['eat']; // wordsAction
        }
        if(current_word == 'eat') {
          return;
        }
      }
    }
    
    autocomplete.innerHTML = wrapCmd(input);
    let nextWord = '';
    let regex = new RegExp(`^${escapeRegExp(checkAgainst)}.*`, 'igm');
    for(let i = 0; i < wordsToCompare.length; i++){
      if(wordsToCompare[i].match(regex)){
        if(wordsAll.includes(last_word)) {
          autocomplete.innerHTML += ' ';
        }
        else {
          autocomplete.innerHTML = autocomplete.innerHTML.trimEnd();
        }
        nextWord = wordsToCompare[i].slice(checkAgainst.length, wordsToCompare[i].length);
      	autocomplete.innerHTML += wrapCmd(nextWord);
        // if(wordsToCompare != wordsIfConditionLeft && wordsToCompare != wordsAction && wordsToCompare != wordsBoolean && wordsToCompare != wordsToShow) {
          // permuteArray(wordsToCompare)
        // }
        break;
      }
    }
    suggestions = [];
    // if a next word is suggested, also suggest other possibilities
    if(autocomplete.innerText.includes(nextWord) && nextWord != '' && wordsToCompare.includes(nextWord)) {
      let r = new RegExp(`(?:(?!${nextWord}).)*`);
      let m = r.exec(autocomplete.innerText)
      let t = [...wordsToCompare]
      t.splice(wordsToCompare.indexOf(nextWord), 1);
      suggestions = t;
      let suggestion_block = ``;
      suggestions.forEach(e => {
        let span = document.createElement('span');
        span.innerHTML=wrapCmd(e);
        span.firstChild.classList.add('suggestion')
        let spanString=span.innerHTML;
        suggestion_block += `${'&nbsp;'.repeat(m[0].trim().length-(checkAgainst.length-1))}${spanString}<br>`
      })
      if(suggestions.length < wordsToCompare.length-1) {
        suggestion_block += `<span class='suggestion'>${'&nbsp;'.repeat(m[0].trim().length-(checkAgainst.length-1))}...</span><br>`
      }
      autocomplete_suggestions.innerHTML = suggestion_block
      goToBottom(terminal_container);
    } else {
      autocomplete_suggestions.innerHTML = ''
    }
    if(wordsAll.includes(autocomplete.innerText.split(' ').at(-1))) {
      let t = autocomplete.innerText
      autocomplete.innerHTML = '';
      t.split(' ').forEach(e => {
        autocomplete.innerHTML += wrapCmd(e) + ' ';
      })
    }
	}
 })
})

terminal_input.addEventListener('keydown', (e) => {
  switch(e.key) {  
    case 'Backspace':
    case 'Delete':
      autocomplete.innerHTML = '';
      autocomplete_suggestions.innerHTML = ''
      return;
    case 'ArrowRight':
      if(autocomplete.innerText.length >= terminal_input.value.length) {
        e.preventDefault();
      }
    case 'Tab':
      e.preventDefault();
      terminal_input.value = autocomplete.innerText;
      terminal_input.dispatchEvent(new KeyboardEvent('keyup',{'key':''}));
      return;
    case 'ArrowLeft':
      if(autocomplete.innerText.length >= terminal_input.value.length && terminal_input.value.split(' ').length>1) {
        e.preventDefault();
        terminal_input.value = terminal_input.value.split(' ').slice(0, -1).join(' ');
        terminal_input.dispatchEvent(new KeyboardEvent('keyup',{'key':''}));
      }
      return;
    
    case 'ArrowUp': {
      e.preventDefault();
      if(autocomplete_suggestions.childElementCount) {
        permuteArray(wordsToCompare, -1);
      } else {
        let prev = buffer.prev();
        if(prev!==undefined){
            terminal_input.value = prev.join(' ');
        }
      }
      break;
    }
    case 'ArrowDown': {
      e.preventDefault();
      if(autocomplete_suggestions.childElementCount) {
        permuteArray(wordsToCompare, 1);
      } else {
        let next = buffer.next();
        if(next!==undefined){
            terminal_input.value = next.join(' ');
        }
      }
      break;
    }
    case ' ': {
      if(terminal_input.value.at(-1) == ' ' || ! (wordsAll.includes(terminal_input.value.split(' ').at(-1)))) {
        e.preventDefault();
        tagWithClass(terminal_input, 'blink');
        tagWithClass(terminal_input, 'shake');
      }
      break;
    } 
    case 'Enter': {
      e.preventDefault()
      let cmd = terminal_input.value.toLowerCase().match(/\w+/g).filter(word => !wordsFilter.includes(word))
      if(!cmd) { return; }
      while(buffer.next() !== undefined) {};
      buffer.push(cmd)
      switch (cmd[0]) {
        case 'clear':
          clearLog();
          break;
          default: {
            let CmdEvent = new CustomEvent('cmd', { 
              detail: { value: cmd }
            });
            terminal_input.dispatchEvent(CmdEvent);
            // addToLog(cmd);
          }
        }
        clearInput();
        return;
      }
  }
})

terminal_container.onclick = function(event) {
  if(event.target == autocomplete || event.target == autocomplete_suggestions) {
    terminal_input.focus();
  }
  if(!(event.target.classList.contains('cmd'))) {
    return;
  }
  appendToInput(event.target.innerText);
}


// TERMINAL IO FUNCTIONS

function addToLog(output) {
  let id = `logId-${logId}`
  let wrap = document.createElement('div');
  let logDiv = terminal_log 
  let lastChild = logDiv.lastChild;
  if(logDiv.getElementsByClassName(id).length) {
    wrap = logDiv.getElementsByClassName(id)[0];
  } else {
    wrap.classList.add(id)
    wrap.classList.add('logSegment');
  }

  let div = document.createElement('div');
  if(!(output instanceof HTMLDivElement) ) {
    // if output is already a stringified div, don't create a nested one.
    if(output.slice(0,4) == '<div') {
      div.innerHTML = `${output}`;
      div = div.firstElementChild;
    } else {
      div.innerHTML = output;
    }
  }
  else {
    div = output;
  }
  /*;
  if(div.classList.contains('input')) {
    logDiv = terminal_log_input;
  } else {
    logDiv = terminal_log_output;
  }*/

  div.classList.add(`logEntry`);
  div.classList.add(id)
  try {
    let divText = div.innerText.replaceAll(/\s/g, "")
    let lastChildText = lastChild.innerText.replaceAll(/\s/g, "")
    let lastLastChildText = lastChild.lastChild.innerText.replaceAll(/\s/g, "")
    if(divText == lastChildText || divText == lastLastChildText) {
      tagWithClass(lastChild, 'blink');
      tagWithClass(lastChild, 'bounce');
    }
    else {
      wrap.appendChild(div);
      logDiv.appendChild(wrap);
      logCount++;
    }
  } catch (error) {
    wrap.appendChild(div);
    logDiv.appendChild(wrap);
    logCount++;
  }
/*
  while(getTotalChildrenHeights(terminal_container) > getCanvasHeight() && logCount > 0 && terminal_container.children.length) {
    logDiv.firstChild.remove();
    logCount--;
  }*/
  if(isOverflown(terminal_container)) {
    // toBottomBtn.style.display = 'block';
    goToBottom(terminal_container)
  }
}

function logOutput(output) {
  let div = document.createElement('div');
  // output = colorize(output, rgbaOutput);
  div.innerHTML = output;
  // div = div.firstElementChild;
  div.classList.add('output');
  addToLog(div);
}

function logInput(input) {
  let div = document.createElement('div');
  // input = colorize(input, rgbaInput);
  div.innerHTML = input;
  // div = div.firstElementChild;
  div.classList.add('input');
  addToLog(div);
}

function logError(error) {
  let div = document.createElement('div');
  // error = colorize(error, rgbaError);
  div.innerHTML = error
  // div = div.firstElementChild;
  div.classList.add('error');
  addToLog(div);
  tagWithClass(div, 'blink');
  tagWithClass(div, 'shake');
}

function clearLog() {
  terminal_log.innerHTML = '';
  logCount = 0;
}

function getTotalChildrenHeights(element) {
  let totalHeight = 0;
  for(let i = 0; i < element.children.length; i++) {
    totalHeight += element.children[i].clientHeight; // true = include margins
  }
  return totalHeight;
}

function wrapCmd(cmd, classesToAdd = []) {
  if(!(cmd.trim())) {
    return '';
  }
  let cmdArr = cmd.split(' ')
  if(cmdArr.length > 1) {
    let r = '<span class="cmd-wrap">'
    cmdArr.forEach(e => {
      let wrapped;
      let delims = [':', ';', '-', ',']
      if(delims.includes(e)) wrapped = e;
      else if(e.length>1 && delims.includes(e.at(-1)) ) wrapped = wrapCmd(e.slice(0,-1), classesToAdd)+e.at(-1)
      else wrapped = wrapCmd(e, classesToAdd);
      r += `${wrapped} `;
    });
    return r.trimEnd()+'</span>';
  }
  let i = 0;
  let classList = `cmd ${cmd} `
  for(i; i<wordsAllArrays.length; i++) {
      if(wordsAllArrays[i].includes(cmd)) {
        classList += `${wordsAllArraysStrings[i]} `;
        break;
      }
  }
  classesToAdd.forEach(e => {
    classList += `${e} `
  })
  return `<span class='${classList}'>${cmd}</span>`
}

// STRING HELPERS
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


// INPUT PARSING
function parseEncased(parentheses, input_arr) {
  let exception_if = `uh oh, an if rule needs to be of the form ${wrapCmd('if (X) {Y}')}!`;
  let encased = '';
  let i = 0;
  word = input_arr[i];
  while(word.at(0) != parentheses[0]) {
    i++;
    word = input_arr[i];
  } word = input_arr[i].slice(1);
  while(word.at(-1) != parentheses[1]) {
    if(i >= input_arr.length) {
      logOutput(exception_if);
      return;
    }
    encased += ` ${word}`;
    word = input_arr[i];
    i++; 
  } encased += ` ${word.slice(0, -1)}`;
  return encased
}


async function tagWithClass(e = document.getElementById('id'), className='blink') {
  e.classList.remove('old')
  setTimeout(function() {
     e.classList.add(className);
  }, 200);
  setTimeout(function() {
     e.classList.remove(className)
  }, 800);
}

function permuteArray(array, down=1) {
  if(down==1) {
    let temp = array.shift();
    array.push(temp);
  } else {
    let temp = array.pop();
    array.unshift(temp);
  }
}

function startNewLogSegment() {
  Array.from(terminal_log.children).forEach( e => {
    if(e.classList.contains('logSegment')) {
      e.classList.add('old');
    }
  })
  logId++;
}

function goToBottom(element=terminal_log.lastChild){
  if(isOverflown(element)) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }
}

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function appendToInput(text) {
  if(terminal_input.value.includes(text)) {
    return;
  }
  if(text.includes(terminal_input.value.split(' ').at(-1))) {
    text = text.slice(terminal_input.value.split(' ').at(-1).length)
  }
  if(terminal_input.value.length && terminal_input.value.at(-1) != ' ' && text.at(0) != ' ' && wordsAll.includes(text)) {
    text = ' ' + text;
  }
  terminal_input.value += text;
  terminal_input.dispatchEvent(new KeyboardEvent('keyup',{'key':''}));
  terminal_input.focus()
}