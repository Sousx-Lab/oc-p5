/**
 * display a flash message 
 */
export const Flash = {
    /**
     * @param {number|null} statusCode 
     * @param {string} message 
     */
    success(statusCode = null, message){
        buildflashDOM(statusCode, message, "success")
    },

    /**
     * @param {number|null} statusCode 
     * @param {string} message 
     */
    error(statusCode = null, message){
        buildflashDOM(statusCode, message, "danger")
    },

    /**
     * @param {number|null} statusCode 
     * @param {string} message 
     */
    info(statusCode = null, message){
        buildflashDOM(statusCode, message, "info")
    },

    /**
     * @param {number|null} statusCode 
     * @param {string} message 
     */
    warning(statusCode = null, message){
        buildflashDOM(statusCode, message, "warning")
    }
}
/**
 * @param {number} statusCode 
 * @param {string} message 
 * @param {string} errorType 
 */
function buildflashDOM(statusCode = null, message, errorType = '') {
    
    const body = document.body
    let container = document.getElementById("flash-container");
    let style = getStyleRules("style")

        if(null === container){
            container = `<div id="flash-container"></div>`
            style.insertRule(
            `#flash-container{ 
                position:fixed; 
                right:5px; 
                top:5px; 
                width:300px; 
                height:auto; 
                background:transparent;
                }`
            )
            body.insertAdjacentHTML('afterbegin', container)
            container = document.getElementById("flash-container");
        }
        let messageId = container.children.length;
        
        /**delete css rules if exist */
        deleteStyleRules(style, errorType, messageId)

        let flashMessage = `<div id="${"message--"+messageId}" class="flash-message--${errorType}">${message} ${statusCode ? statusCode : ''}</div>`
        let progressBar = `<span id="${"progress-bar--"+messageId}" class="flash-progressBar--${errorType}"></span>`
        
        /**Insert CSS rules for Flah message div */
        style.insertRule(
        `.flash-message--${errorType}{
            position: relative; 
            color: #000000;
            font-size:12px; 
            max-width: 100%;
            height: 15px; 
            margin-bottom: 5px;
            padding: 20px 25px;
            border-radius: 8px 4px 4px 8px; 
            background: #FFFFFF;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: all 500ms 0s;
            }`
        )

        /** Insert CSS rules for close button*/
        style.insertRule(
        `.flash-message--${errorType}:before{
            content: "X"; 
            cursor:pointer; 
            font-size:15px; 
            font-weight:500; 
            position:absolute; 
            top:5px; 
            right:10px;
            }`
        )
        style.insertRule(
        `.flash-message--${errorType}:after{
            content: ""; 
            width: 12px;
            position:absolute; 
            left:0;
            border: 1px solid ${getColorByErrorType(errorType)};
            top:0;
            bottom:0;
            background: ${getColorByErrorType(errorType)};
            }`
        )

        /**Insert CSS rules for ProgressBar span */
        style.insertRule(
        `.flash-progressBar--${errorType}{ 
            content: ""; 
            position:absolute; 
            left:0; 
            right:0; 
            bottom:0; 
            padding:1.5px 0;
            border-radius: 23px; 
            background: ${getColorByErrorType(errorType)};
            }`
        )
        
        container.insertAdjacentHTML('afterbegin', flashMessage)
        let flashedMessage = document.getElementById(`${"message--"+messageId}`)
        
        if(flashedMessage){
            flashedMessage.insertAdjacentHTML('beforeend', progressBar)
            let progBar = document.getElementById(`${"progress-bar--"+messageId}`)
            handleProgressBar(container, progBar, 50)
            
            flashedMessage.addEventListener('click', function(e){
                e.target.remove()
                if(container.children.length === 0){
                    container.remove()
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
function getColorByErrorType(errorType, alpha = 1){

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
 * 
 * @param {CSSStyleSheet} style 
 * @param {string} errorType 
 * @param {number} messageId
 * @returns {void}
 */
function deleteStyleRules(style, errorType, messageId){
    if(style.cssRules) {
        for (let i=0; i< style.cssRules.length; i++) {
            
            if (style.cssRules[i].selectorText === `.flash-message--${errorType}`){
                style.deleteRule(i);
            }
            if(style.cssRules[i].selectorText === `.flash-progressBar--${errorType}`){
                style.deleteRule(i);
            }
            
            if(style.cssRules[i].selectorText === `#progress-bar--${messageId}`){
                style.deleteRule(i);
            }
            
            if(style.cssRules[i].selectorText === `.flash-message--${errorType}::before`){
                style.deleteRule(i);
            }
            
            if(style.cssRules[i].selectorText === `.flash-message--${errorType}::after`) {
                style.deleteRule(i);
            }
        }
    }
    
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
    let right = -100
    elem.parentElement.style.right = `${right+"%"}`;

    let interval = setInterval(frame, timer)
    function frame(){
        if(right < 0){
            right += 25
            elem.parentElement.style.right = `${right+"%"}`;
            return
        }

        if(left === 90 ){
            elem.parentElement.style.transform = "translateX(100%)"
        }
        if(left >= 100){
                clearInterval(interval)
                left = 100;
                elem.parentElement.remove()

            if(container.children.length === 0){
                container.remove()
            }
        }else{
            left++;
            elem.style.left = `${left+"%"}`;    
        }
        
    }
}

