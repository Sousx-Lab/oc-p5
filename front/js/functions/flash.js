/**
 * display a flash message 
 */
export const Flash = {
    success(statusCode = 0, message = ''){
        buildflashDOM(statusCode, message, "success")
    },
    error(statusCode = 0, message = ''){
        buildflashDOM(statusCode, message, "danger")
    },
    info(statusCode = 0, message = ''){
        buildflashDOM(statusCode, message, "info")
    },
    warning(statusCode = 0, message = ''){
        buildflashDOM(statusCode, message, "warning")
    }
}
/**
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
       
        let flashMessage = `<div id="${"message--"+messageId}" class="flash-message--${errorType}">${message} ${statusCode !== 0 ? statusCode : ''}</div>`
        let progressBar = `<span id="${"progress-bar--"+messageId}" class="flash-progress-bar"></span>`
        style.insertRule(
            `.flash-message--${errorType} {position: relative; color: #FFFFFF;font-size:12px; max-width: 100%; height: auto; margin-bottom: 5px; padding:20px; border-radius:8px; background: ${getColorErrorType(errorType)};}`
        )
        style.insertRule(`.flash-message--${errorType}:before {content: "X"; cursor:pointer; font-size:15px; font-weight:500; position:absolute; top:5px; right:10px;}`
        )
        style.insertRule(`.flash-progress-bar {content: ""; position:absolute; left:0%; right:7px; bottom:0; padding:1.5px 0;border-radius: 23px; background:#757575 }`
        )
        
        flashContainer.insertAdjacentHTML('afterbegin', flashMessage)
        let flashedMessage = document.getElementById(`${"message--"+messageId}`)
        
        if(flashedMessage){
            flashedMessage.insertAdjacentHTML('beforeend', progressBar)
            let progBar = document.getElementById(`${"progress-bar--"+messageId}`)
            handleProgressBar(flashContainer, progBar, 50)
            
            flashedMessage.addEventListener('click', function(e){
                e.target.remove()
                if(flashContainer.children.length === 0){
                    flashContainer.remove()
                }
                e.target.removeEventListener('click', ()=>{})
            })
        }
} 

/**
 * 
 * @param {string} errorType
 * @param {number} alpha transparency 0 to 1
 * @returns {string} RGBA color
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
 * Get CSS in link balise
 * @param {string} sheetName CSS FileName 
 * @returns {CSSStyleSheet} CSSStyleSheet object
 */
function getStyleRules(cssFileName) {
    let stylesheet = document.querySelector('link[href*=' + cssFileName + ']')
    if(!stylesheet){
        return null;
    }
    return stylesheet = stylesheet.sheet
}

/**
 * handle progressbar
 * @param {HTMLElement} container
 * @param {HTMLElement} elem 
 * @param {number} timer
 * @returns {void} void
 */
function handleProgressBar(container, elem, timer = 30){
    let left = 0;
    let interval = setInterval(frame, timer)
    
    function frame(){
        if(left >= 100 ){
            clearInterval(interval)
            left = 100;
            elem.parentElement.remove()
            if(container.children.length === 0){
                container.remove()
            }
        }else{
            left++;
            elem.style.left = `${ left+"%"}`;    
        }
        
    }
}

