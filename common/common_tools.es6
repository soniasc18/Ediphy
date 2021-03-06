import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import {
    addDefaultContainerPlugins, addDefaultContainerPluginsReact,
    parsePluginContainers, parsePluginContainersReact,
} from './plugins_inside_plugins';
import { ID_PREFIX_BOX } from './constants';
let html2json = require('html2json').html2json;
import i18n from 'i18next';
export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas", customSize = 0) {
    // change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let parent = document.getElementById(idParent);
    let canvas = document.getElementById(idEl);

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */
    if (customSize === 0) {
        console.log(canvas);
        canvas.style.height = "100%";
        canvas.style.width = "100%";
        if(window.canvasRatio === undefined) {
            window.canvasRatio = ratio; // https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
        } else {
            ratio = window.canvasRatio;
        }
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        canvas.style.marginTop = 0 + 'px';
        if (w > ratio * h) {
            canvas.style.width = (ratio * h) + "px";
        } else if (h > w / ratio) {
            let newHeight = w / ratio;
            canvas.style.height = newHeight + "px";
            if (parent) {
                canvas.style.marginTop = ((parent.offsetHeight - canvas.offsetHeight) / 2 - 5) + 'px';
            }
        }
    } else if (customSize.width > parent.offsetWidth) {
        canvas.style.height = (customSize.height / ratio) + 'px';
        canvas.style.width = (customSize.width / ratio) + 'px';
        canvas.style.marginTop = ((parent.offsetHeight - canvas.offsetHeight) / 2 - 5) + 'px';
    } else{
        canvas.style.height = customSize.height + 'px';
        canvas.style.width = customSize.width + 'px';
        canvas.style.marginTop = '0px';
        canvas.style.marginBottom = '10px';
    }
}

export function toggleFullScreen(element) {
    if(!element) {
        element = document.documentElement;
    }

    if (isFullScreenOn()) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    else if (!element.fullscreenElement && // alternative standard method
        !element.mozFullScreenElement && !element.webkitFullscreenElement && !element.msFullscreenElement) { // current working methods
        if (element.requestFullscreen) {
            element.requestFullscreen();
            document.body.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
            document.body.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            document.body.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }

    }

}

export function isFullScreenOn() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

export function fullScreenListener(callback, set) {
    if (set) {
        document.addEventListener('webkitfullscreenchange', callback);
        document.addEventListener('mozfullscreenchange', callback);
        document.addEventListener('fullscreenchange', callback);
        document.addEventListener('MSFullscreenChange', callback);
    } else {
        document.removeEventListener('webkitfullscreenchange', callback);
        document.removeEventListener('mozfullscreenchange', callback);
        document.removeEventListener('fullscreenchange', callback);
        document.removeEventListener('MSFullscreenChange', callback);
    }
}

/**
 * Calculate if a click was released on top of any element of a kind
 * Example: Check if plugin was dropped on top of another plugin. Check in which sortable it was dropped, etc.
 * @param releaseClick Element where the click was released
 * @param name Prefix of the className of the parent we are looking for
 * @returns {*}
 */
export function releaseClick(releaseClickEl, name, isComplex) {
    let isComp = isComplex;
    if (releaseClickEl && releaseClickEl.getAttribute) {
    // Get element that has been clicked
        let release = releaseClickEl.getAttribute('id') || "noid";
        let counter = 12;
        // Check recursively the parent of the element clicked to check if any of them has the name that we are looking for
        while (release && release.indexOf(name) === -1 && counter > 0 && releaseClickEl.parentNode) {
            releaseClickEl = releaseClickEl.parentNode;
            if (releaseClickEl && releaseClickEl.getAttribute) {
                release = releaseClickEl.getAttribute('id') || "noid";
                if(release.indexOf(name) !== -1 && releaseClickEl.parentNode && isComp) {
                    isComp = false;
                    releaseClickEl = releaseClickEl.parentNode;
                    release = releaseClickEl.getAttribute('id') || "noid";
                }
            } else {
                counter = 0;
                break;
            }
            counter--;
        }
        if (counter > 0 && release && release.indexOf(name) !== -1) {
            let partialID = release.split(name);
            if (partialID && partialID.length > 0) {
                return partialID[1];

            }

        }
    }
    return undefined;
}

export function instanceExists(name) {
    let isCV = $('#containedCanvas').css('display') !== 'none';
    let alreadyOne = false;
    let query = (isCV ? '#containedCanvas' : '#canvas') + ' .wholebox';
    $(query).each((ind, el)=>{
        if (el.getAttribute('name') === name) {
            alreadyOne = true;
            return;
        }
    });

    return alreadyOne;
}

export function scrollElement(node, options) {
    let cfg = options || { duration: 300, centerIfNeeded: true, easing: 'easeInOut' };
    if (node) {
        scrollIntoViewIfNeeded(node, cfg);
    }
}

export function findBox(id) {
    return document.getElementById('box-' + id);
}

export function letterFromNumber(ind) {
    if (!isNaN(ind)) {
        const abc = 'abcdefghijklmnopqrstuvwxyz';
        return abc[ind % abc.length];
    }
    return ind;
}

export function createBox(ids, name, slide, addBox, boxes, styleCustom = {}) {
    let apiPlugin = Ediphy.Plugins.get(name);
    if (!apiPlugin) {
        return;
    }
    let { initialParams, template, config, toolbar, state } = apiPlugin.getInitialParams(ids);
    let styles = {};
    try {
        if (toolbar.main && toolbar.main.accordions && toolbar.main.accordions.style) {
            Object.keys(toolbar.main.accordions.style.buttons).map((e) => {
                styles[e] = toolbar.main.accordions.style.buttons[e].value;
            });
        }
        styles = { ...styles, ...styleCustom };
    } catch(e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }

    let newBoxes = [];
    let newPluginState = {};
    if (state.__pluginContainerIds) {
        if (config.flavor !== "react") {
            addDefaultContainerPlugins(ids, template, boxes, newBoxes);
            parsePluginContainers(template, newPluginState);
        } else {
            addDefaultContainerPluginsReact(ids, template, boxes, newBoxes);
            parsePluginContainersReact(template, newPluginState);
        }
        state.__pluginContainerIds = newPluginState;
    }
    addBox(ids, true, slide, template, styles, state, undefined, initialParams);
    let basePrefix = ID_PREFIX_BOX + Date.now();
    newBoxes.map((box, ind) => {
        box.ids.id = basePrefix + ind;
        if (box.ids && ids.exercises) {
            if (box.ids.container === 'sc-Question') {
                box.ids.text = ids.exercises.question || box.ids.text;
            }
            let ans = box.ids.container.match(/sc-Answer(\d+)/);
            if(ans && ans.length > 1 && !isNaN(ans[1])) {
                box.ids.text = ids.exercises.answers[ans[1]] || box.ids.text;
            }
            if (box.ids.container === 'sc-Feedback') {
                box.ids.text = ids.exercises.feedback || box.ids.text;
            }
        }

        createBox(box.ids, box.name, false, addBox, boxes);

    });
    setTimeout(()=>{
        let boxCreated = findBox(ids.id);
        scrollElement(boxCreated);
    }, 40);

}

export function blurCKEditor(id, callback) {
    if (CKEDITOR.instances[id]) {
        CKEDITOR.instances[id].focusManager.blur(true);
        let data = CKEDITOR.instances[id].getData();
        if (data.length === 0) {
            data = '<p>' + i18n.t("text_here") + '</p>';
            CKEDITOR.instances[id].setData((data));
        }
        callback(encodeURI(data), html2json(encodeURI(data)));
        let airlayer = document.getElementById("airlayer");
        if (airlayer) {
            airlayer.focus();
        } else {
            document.body.focus();
        }

    }
}

export function getRandomColor() {
    return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`;
}

function rgbtoHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) {return "00";}
    n = Math.max(0, Math.min(n, 255));
    let num = "0123456789ABCDEF".charAt((n - n % 16) / 16)
    + "0123456789ABCDEF".charAt(n % 16);
    return num;
}

export function toColor(rgba) {
    let regex = /rgba\((\d+),(\d+),(\d+),(.+)\)/;
    let oldColor = regex.exec(rgba);
    if(oldColor && oldColor.length > 0) {
        let newColor = '#' + rgbtoHex(oldColor[1]) + rgbtoHex(oldColor[2]) + rgbtoHex(oldColor[3]);
        return { newColor: newColor, alpha: oldColor[4] * 100 };
    }
    return { newColor: rgba, alpha: 100 };
}
