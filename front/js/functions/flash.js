
/**
 * 
 * @param {string} statusCode "error status code"
 * @param {string} statusMessage the message to display
 * @param {string} errorType "danger, success, warning"
 * @returns {HTMLElement} HTMLElement
 */

export const flash = {
    statusCode: 0,
    success(message = ''){
        buildflashDOM(this.statusCode, message, "success")
    },
    error(message = ''){
        buildflashDOM(this.statusCode, message, "danger")
    },
    info(message = ''){
        buildflashDOM(this.statusCode, message, "info")
    },
    warning(message = ''){
        buildflashDOM(this.statusCode, message, "warning")
    }
}
/**
 * 
 * @param {number} statusCode 
 * @param {string} message 
 * @param {string} errorType 
 */
function buildflashDOM(statusCode = 0, message = '', errorType = '') {
    
    const body = document.body
    let flashContainer = document.getElementById("flash-container");
    let style = getStyleRules("style")
   
        if(!flashContainer){
            let container = `<div id="flash-container"></div>`
            style.insertRule(
            '#flash-container {position:fixed; right:5px; top:5px; width:300px; height:auto; background:transparent;}',0)
            body.insertAdjacentHTML('afterbegin', container)
            flashContainer = document.getElementById("flash-container");
        }
        let messageId = flashContainer.children.length;
        console.log(messageId)
        let flashMessage = `<div id="${"message--"+messageId}" class="flash-message">${message}</div>`
        let progressBar = `<span id="${"progress-bar--"+messageId}" class="flash-progress-bar"></span>`
        style.insertRule(
            `.flash-message {position: relative; color: #FFFFFF;font-size:12px; max-width: 100%; height: auto; margin-bottom: 5px; padding:20px; border-radius:10px; background: ${getColorErrorType(errorType)};}`
        )
        style.insertRule('.flash-message:before {content: "X"; cursor:pointer; font-size:15px; font-weight:500; position:absolute; top:5px; right:10px;}'
        )
        style.insertRule(`.flash-progress-bar {content: ""; position:absolute; left:0%; right:7px; bottom:0; padding:1.5px 0;border-radius: 23px; background:#757575 }`
        )
        
        flashContainer.insertAdjacentHTML('afterbegin', flashMessage)
        let flashedMessage = document.getElementById(`${"message--"+messageId}`)
        
        if(flashedMessage){
            flashedMessage.insertAdjacentHTML('beforeend', progressBar)
            let progBar = document.getElementById(`${"progress-bar--"+messageId}`)
            handleProgressBar(progBar, 50)
            flashedMessage.addEventListener('click', function(e){
                e.target.remove()
            })
        }
    
} 

/**
 * 
 * @param {string} errorType
 * @param {number} alpha transparency 0 to 1
 * @returns {string} RGB color
 */
function getColorErrorType(errorType, alpha = 1){

    let color = `rgba(124, 188, 232, ${alpha})`;
    if(errorType === "danger"){
        return color = `rgba(239, 139, 129, ${alpha})`
        
    }else if(errorType === "success"){
        return color = `rgba(20, 160, 133, ${alpha})`

    }else if(errorType === "warning"){
        return color = `rgba(247, 191, 102, ${alpha})`
    }
    else{
        return color
    }
}

/**
 * 
 * @param {string} sheetName CSS FileName 
 * @returns {object} stylesheet.sheet
 */
function getStyleRules(cssFileName) {
    let stylesheet = document.querySelector('link[href*=' + cssFileName + ']')
    if(!stylesheet){
        return null;
    }
    return stylesheet = stylesheet.sheet
}

function handleProgressBar(elem, timer = 30){
    let left = 0;
    let interval = setInterval(frame, timer)
    
    function frame(){
        if(left >= 100 ){
            clearInterval(interval)
            left = 100;
            elem.parentElement.remove()
        }else{
            left++;
            elem.style.left = `${ left+"%"}`;
        }

    }
}

