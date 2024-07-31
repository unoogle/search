/**

    Barbequery - a lightweight easy to use DOM library
    All code written by Vexcess available under the MIT license (https://opensource.org/license/mit/)

    TODO:
        - implement logical query operators
        - implement server side rendering???
**/

{
    class BElement {
        constructor(el) {
            this.native = el;

            for (const key in el.$methods) {
                this[key] = el.$methods[key];
            }
        }
    
        prependTo(a) {
            (a.native ?? a).prepend(this.native);
            return this;
        }
        
        appendTo(a) {
            (a.native ?? a).append(this.native);
            return this;
        }
        
        addClass(...args) {
            this.native.classList.add(...args);
            return this;
        }
        
        removeClass(...args) {
            this.native.classList.remove(...args);
            return this;
        }
        
        setId(a) {
            this.native.id = a;
            return this;
        }
        
        html(a) {
            if (a === undefined) return this.native.innerHTML;
            this.native.innerHTML = a;
            return this;
        }
        
        text(a) {
            if (this.native.value) {
                if (a === undefined) return this.native.value;
                this.native.value = a;
            } else {
                if (a === undefined) return this.native.textContent;
                this.native.textContent = a;
            }
            return this;
        }
    
        replaceChild(a, b) {
            this.native.replaceChild(a.native ?? a, b.native ?? b);
            return this;
        }
    
        removeChild(a) {
            this.native.removeChild(a.native ?? a);
            return this;
        }
        
        on(a, b, c) {
            this.native.addEventListener(a, b, c);
            return this;
        }
        
        css(c) {
            if (typeof c === "string") {
                let pairs = c.split(";"), colonIdx, key, val;
                for (let i = 0; i < pairs.length; i++) {
                    colonIdx = pairs[i].indexOf(":");
                    key = pairs[i].slice(0, colonIdx).trim();
                    if (key.length > 0) {
                        val = pairs[i].slice(colonIdx + 1).trim();
                        this.native.style[key] = val;
                    }
                }
            } else {
                for (let p in c) {
                    this.native.style[p] = c[p];
                }
            }
            return this;
        }
        
        attr(a, b) {
            if (typeof a === "object") {
                for (let p in a) {
                    this.native[p] = a[p];
                }
            } else {
                this.native[a] = b;
            }
            return this;
        }
    
        prepend(...args) {
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].native ?? args[i];
            }
            this.native.prepend(...args);
            return this;
        }
        
        append(...args) {
            for (let i = 0; i < args.length; i++) {
                args[i] = args[i].native ?? args[i];
            }
            this.native.append(...args);
            return this;
        }
    
        $(query, initObj) {
            return B(query, initObj, this.native);
        }

        get parentEl() {
            return B(this.native.parentElement);
        }
    
        insertBefore(newEl, refEl) {
            this.native.insertBefore(newEl.native ?? newEl, refEl.native ?? refEl);
            return this;
        }
    }

    const EL_PROPS = {
        props: "value,textContent,nodeValue,autoPictureInPicture,disablePictureInPicture,kind,srclang,label,default,dateTime,wrap,placeholder,readOnly,required,rows,autofocus,cols,defaultValue,maxLength,minLength,caption,tHead,tFoot,span,rowSpan,scope,col,colgroup,row,rowgroup,colSpan,abbr,media,sizes,srcset,size,selectedIndex,length,multiple,name,type,async,defer,noModule,cite,selected,defaultSelected,userMap,data,reversed,start,height,low,max,min,optimum,charset,content,httpEquiv,href,hreflang,rel,as,htmlFor,patterns,selectionEnd,selectionStart,selectionDirection,alt,accept,files,webkitdirectory,webkitEntries,checked,defaultChecked,indeterminate,disabled,formAction,formEnctype,formMethod,formNoValidate,formTarget,step,valueAsDate,valueAsNumber,dirName,inputmode,useMap,decoding,isMap,loading,crossOrigin,referrerPolicy,sandbox,srcdoc,allow,method,action,encoding,enctype,acceptCharset,autocomplete,noValidate,validationMessage,validity,willValidate,returnValue,open,width,tabIndex,volume,src,srcObject,preload,preservesPitch,playbackRate,loop,muted,currentTime,defaultMuted,defaultPlaybackRate,disableRemotePlayback,controls,audioTracts,autoplay,coords,host,hostname,target,username,search,protocol,port,pathname,password,hash,download,accessKey,contentEditable,dir,draggable,enterKeyHint,hidden,inert,innerText,inputMode,popover,lang,nonce,outerText,spellcheck,style,title,translate,className,id,innerHTML,outerHTML,part,scrollLeft,scrollTop,slot".split(","),
        read_props: "previousSibling,parentElement,parentNode,ownerDocument,nodeType,nodeName,nextSibling,lastChild,isConnected,firstChild,childNodes,baseURI,videoHeight,videoWidth,readyState,track,textLength,cells,rowIndex,sectionRowIndex,tBodies,headers,cellIndex,sheet,selectedOptions,options,position,index,areas,relList,control,form,labels,list,x,y,naturalHeight,naturalWidth,currentSrc,complete,contentDocument,contentWindow,elements,validateMessage,textTracks,videoTracks,seekable,seeking,played,networkState,paused,duration,ended,error,mediaKeys,controlsList,buffered,reList,origin,accessKeyLabel,attributeStyleMap,isContentEditable,dataset,offsetHeight,offsetLeft,offsetParent,offsetTop,offsetWidth,assignedSlot,attributes,childElementCount,children,classList,clientHeight,clientLeft,clientTop,clientWidth,firstElementChild,lastElementChild,localName,namespaceURI,nextElementSibling,prefix,previousElementSibling,scrollHeight,scrollWidth,shadowRoot,tagName".split(","),
        methods: "normalize,lookupNamespaceURI,lookupPrefix,isSameNode,isEqualNode,isDefaultNamespace,hasChildNodes,getRootNode,contains,compareDocumentPosition,cloneNode,appendChild,getVideoPlaybackQuality,requestPictureInPicture,setRangeText,setSelectionRange,checkValidity,setCustomValidity,deleteRow,insertRow,deleteCell,insertCell,createTHead,deleteTHead,createTFoot,deleteTFoot,createTBody,createCaption,deleteCaption,assign,assignedNodes,assignedElements,item,namedItem,remove,blur,click,focus,select,showPicker,reportValidity,stepDown,stepUp,decode,requestSubmit,reset,submit,close,show,showModal,captureStream,getContext,toDateURL,toBlob,transferControlToOffscreen,addTextTrack,canPlayType,faskSeek,load,pause,play,setMediaKeys,setSinkId,toString,attachInternals,hidePopover,showPopover,togglePopover,after,attachShadow,animate,before,closest,computedStyleMap,dispatchEvent,getAnimations,getAttribute,getAttributeNames,getAttributeNode,getAttributeNodeNS,getAttributeNS,getBoundingClientRect,getClientRects,getElementsByClassName,getElementsByTagName,getElementsByTagNameNS,hasAttribute,hasAttributeNS,hasAttributes,hasPointerCapture,insertAdjacentElement,insertAdjacentHTML,insertAdjacentText,matches,querySelector,querySelectorAll,releasePointerCapture,removeAttribute,removeAttributeNode,removeAttributeNS,removeEventListener,replaceChildren,replaceWith,requestFullscreen,requestPointerLock,scroll,scrollBy,scrollIntoView,scrollTo,setAttribute,setAttributeNode,setAttributeNodeNS,setAttributeNS,setPointerCapture,toggleAttribute".split(",")
    };

    // extend BElement from all native elements
    let obj = {};
    for (let name of EL_PROPS.props) {
        obj[name] = {
            get() {
                return this.native[name];
            },
            set(val) {
                this.native[name] = val;
            }
        };
    }
    for (let name of EL_PROPS.read_props) {
        obj[name] = {
            get() {
                return this.native[name];
            }
        };
    }
    for (let name of EL_PROPS.methods) {
        obj[name] = {
            get() {
                return this.native[name].bind(this.native);
            }
        };
    }
    Object.defineProperties(BElement.prototype, obj);

    const validTags = "a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,search,section,select,small,source,span,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr".split(',');
    const selfClosingTags = "area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr".split(",");

    class VirtualEl {
        tag;
        attributes;
        innerHTML;
        children;
    
        constructor(tag, attributes, innerHTML) {
            this.tag = tag;
            this.attributes = B.parseAttributes(attributes);
            this.innerHTML = innerHTML;
            this.children = B.parseHTML(innerHTML);
        }

        createInstance() {
            const native = document.createElement(this.tag);

            // create children
            for (let i = 0; i < this.children.length; i++) {
                const childNode = this.children[i];
                let nativeChild;
                if (childNode instanceof VirtualEl) {
                    if (B.components[childNode.tag]) {
                        nativeChild = instantiateComponent(B.components[childNode.tag]).native;
                    } else {
                        nativeChild = childNode.createInstance();
                    }
                } else {
                    nativeChild = new Text(childNode);
                }
                native.append(nativeChild);
            }

            // set attributes
            for (const key in this.attributes) {
                const value = this.attributes[key];
                if (key === "class") {
                    native.className = value;
                } else if (key.startsWith("data-")) {
                    native.dataset[key] = value;
                } else {
                    native[key] = value;
                }
            }

            return native;
        }
    }

    function instantiateComponent(component) {
        // console.log("component", component)

        const template = component.template;
        // console.log("template", template)

        let createdElement = null;

        if (component.isNative) {
            for (let i = 0; i < template.children.length; i++) {
                const childNode = template.children[i];
                if (childNode instanceof VirtualEl && !(childNode.tag === "script" && childNode.attributes["type"] === "methods")) {
                    const nativeComponent = childNode.createInstance();
                    // console.log('native comp', nativeComponent)
                    createdElement = nativeComponent;
                    break;
                }
            }
        } else {
            createdElement = template.createInstance();
        }

        // copy prototype
        createdElement.$methods = {};
        const wrapped = B(createdElement);
        const boundPrototype = component.boundPrototype;
        const keys = Object.getOwnPropertyNames(boundPrototype);
        for (let i = 0; i < keys.length; i++) {
            const prop = keys[i];
            if (prop !== "constructor") {
                createdElement.$methods[prop] = boundPrototype[prop].bind(wrapped);
            }
        }
        // run callback
        if (component.callback) {
            component.callback.bind(wrapped)(initObj, wrapped);
        }

        return wrapped;

        // let componentCode = component.template;

        // // set id and class if given
        // if (initObj && (initObj.id || initObj.class)) {
        //     const openTagIdx = B.noStringIdxOf(componentCode, "<");
        //     const spaceIdx = openTagIdx + componentCode.slice(openTagIdx).indexOf(" ");
        //     if (initObj.id) {
        //         componentCode = componentCode.slice(0, spaceIdx) + ` id="${initObj.id}"` + componentCode.slice(spaceIdx);
        //     }
        //     if (initObj.class) {
        //         if (componentCode.includes("class=")) {
        //             let classIdx = B.noStringIdxOf(componentCode, "class=") + 7;
        //             componentCode = componentCode.slice(0, classIdx) + `${initObj.class} ` + componentCode.slice(classIdx);
        //         } else {
        //             componentCode = componentCode.slice(0, spaceIdx) + ` class="${initObj.class}"` + componentCode.slice(spaceIdx);
        //         }
        //     }
        // }

        // console.log(componentCode)
        
        // let code = B.template(componentCode, initObj, "\\");
        
        // for (let compName in components) {
        //     // find index of component in parent component code
        //     let compIdx = B.noStringIdxOf(code, "<" + compName);
        //     while (compIdx > -1) {
        //         // if there is a component, find the end of its opening tag
        //         let j = B.noStringIdxOf(code, ">", compIdx);
        //         // get content of component opening tag
        //         let inputData = code.slice(compIdx, j);
        //         inputData = inputData.slice(inputData.indexOf(" "));
                
        //         // split content into key values pairs
        //         let chunks = inputData.split("=");
        //         let pairs = Array((chunks.length - 1) * 2);
        //         let pairsIdx = 0;
        //         pairs[pairsIdx++] = chunks[0].trim();
        //         for (let i = 1; i < chunks.length - 1; i++) {
        //             let str = chunks[i];
        //             let k = str.length - 2;
        //             while (k > 0) {
        //                 if (str[k] === '"' || str[k] === "'") {
        //                     pairs[pairsIdx++] = str.slice(0, k+1).trim();
        //                     pairs[pairsIdx++] = str.slice(k+1).trim();
        //                     break;
        //                 }
        //                 k--;
        //             }
        //         }
        //         pairs[pairsIdx++] = chunks[chunks.length - 1].trim();

        //         // create object from key value pairs
        //         let inputObj = {};
        //         for (let i = 0; i < pairs.length; i += 2) {
        //             inputObj[pairs[i]] = pairs[i+1].slice(1, pairs[i+1].length - 1);
        //         }

        //         // get html of sub component
        //         let templ = B("template");
        //         templ.content.append(B(compName, inputObj).native);
                
        //         // I forgot how this works, but it does
        //         code =  code.slice(0, compIdx) + 
        //                 templ.innerHTML +
        //                 code.slice(j + 1);
        //         compIdx = B.noStringIdxOf(code, "<" + compName);
        //     }
        // }
    }

    function B(a, b, c) {
        const element = a;

        // convert Element to BElement
        if (element instanceof Element) return new BElement(element);

        // if already a BElement simply return it
        if (element instanceof BElement) element;

        const query = a;
        const initObj = b;
        const queryParent = c;

        // Selection queries/create Element
        let selectors = query.split(">");

        let result = null;

        // for each multiselector
        for (let i = 0; i < selectors.length; i++) {
            let select = selectors[i].trim();
            let param = select.slice(1);
            switch (select.charAt(0)) {
                // id selector
                case "#":
                    if (Array.isArray(queryParent)) {
                        let newEls = [];
                        for (let i = 0; i < queryParent.length; i++) {
                            newEls.push(queryParent.getElementById(param));
                        }
                        result = newEls;
                    } else {
                        result = (queryParent ?? document).getElementById(param);
                    }
                break;

                // class selector
                case ".":
                    if (Array.isArray(queryParent)) {
                        let newEl = [];
                        for (let i = 0; i < queryParent.length; i++) {
                            let res = queryParent[i].getElementsByClassName(param);
                            for (let j = 0; j < res.length; j++) {
                                newEl.push(res[j]);
                            }
                        }
                        result = newEl;
                    } else {
                        result = (queryParent ?? document).getElementsByClassName(param);
                    }
                break;

                // element selector
                case "*":
                    if (Array.isArray(queryParent)) {
                        let newEl = [];
                        for (let i = 0; i < queryParent.length; i++) {
                            let res = queryParent[i].getElementsByTagName(param);
                            for (let j = 0; j < res.length; j++) {
                                newEl.push(res[j]);
                            }
                        }
                        result = newEl;
                    } else {
                        result = (queryParent ?? document).getElementsByTagName(param);
                    }
                break;

                default:
                    const component = B.components[select];

                    // does the component exist?   
                    if (component) {
                        return instantiateComponent(component);
                    } else {
                        result = document.createElement(select);
                    }
                break;
            }
        }

        // wrap output
        if (result instanceof Element) {
            // single result
            result = new BElement(result);
        } else if (result === null || result === undefined) {
            // not result
            result = null;
        } else {
            // many results
            let arr = new Array(result.length);
            for (let i = result.length - 1; i >= 0; i--) {
                arr[i] = new BElement(result[i]);
            }
            result = arr;
        }
        
        return result;
    }

    B.BElement = BElement;

    B.html = String.raw;

    B.noStringIdxOf = (str, targetStr, start=0) => {
        let i = start, inString = false, strType = "", strTypes = ['"', "'", "`"];
        while (i < str.length) {
            let c = str.charAt(i);
            if (strTypes.includes(c)) {
                if (inString) {
                    if (c === strType) {
                        inString = false;
                    }
                } else {
                    inString = true;
                    strType = c;
                }
            }
            if (str.slice(i, i + targetStr.length) === targetStr && !inString) {
                return i;
            }
            i++;
        }
        return -1;
    };

    B.parseAttributes = source => {
        let attributes = {};

        let idx = 0;
        while (idx < source.length) {
            // has found start of attribute
            if (source[idx] !== " ") {
                // find end of key
                let keyStart = idx;
                idx++;
                while (source[idx] !== " " && source[idx] !== "=" && idx < source.length) {
                    idx++;
                }
                const key = source.slice(keyStart, idx);
    
                // find next token
                while (source[idx] === " " && idx < source.length) {
                    idx++;
                }
    
                // check if the next token is equal sign
                let hasValue = source[idx] === "=";
                if (hasValue) {
                    idx++;
                }
    
                // find value
                if (hasValue) {
                    while (source[idx] === " " && idx < source.length) {
                        idx++;
                    }
                }
    
                // parse value
                let value = "";
                if (source[idx] === '"') {
                    // double quoted value
                    idx++;
                    const stringStart = idx;
                    while (source[idx] !== '"' && idx < source.length) {
                        idx++;
                    }
                    value = source.slice(stringStart, idx);
                } else if (source[idx] === "'") {
                    // single quoted value
                    idx++;
                    const stringStart = idx;
                    while (source[idx] !== "'" && idx < source.length) {
                        idx++;
                    }
                    value = source.slice(stringStart, idx);
                } else if (hasValue) {
                    // non-quoted value
                    const stringStart = idx;
                    while (source[idx] !== " " && idx < source.length) {
                        idx++;
                    }
                    value = source.slice(stringStart, idx);
                } else {
                    // empty attribute
                    idx--;
                }
    
                attributes[key] = value;
            }
            idx++;
        }

        return attributes;
    };

    B.parseHTML = source => {
        let virtualElements = [];
        let idx = 0;
        let endOfLastComponent = 0;
    
        while (idx < source.length) {
            // hit start of component
            if (source[idx] === "<") {
                if (source[idx+1] === "!") {
                    idx += source.slice(idx).indexOf("-->") + 3;
                    endOfLastComponent = idx;
                } else {
                    // capture text node
                    if (idx !== endOfLastComponent) {
                        virtualElements.push(source.slice(endOfLastComponent, idx));
                    }
        
                    // parse opening tag
                    idx++;
                    const temp = source.slice(idx);
                    const headerEndIdx = B.noStringIdxOf(temp, ">");
                    const componentHeader = temp.slice(0, headerEndIdx);
                    const isSelfClosing = componentHeader[componentHeader.length - 1] === "/";
                    
                    // parse out tag name
                    let tagEndIdx = componentHeader.indexOf(" ");
                    if (tagEndIdx === -1) {
                        tagEndIdx = isSelfClosing ? componentHeader.length - 1 : componentHeader.length;
                    }
                    const tagName = componentHeader.slice(0, tagEndIdx);

                    // increment idx to element's body
                    idx += headerEndIdx + 1;
                    
                    // parse body
                    let content = "";
                    if (!isSelfClosing && !selfClosingTags.includes(tagName)) {
                        content = source.slice(idx);
                        
                        // find index of closing tag
                        let closingIdx = 0;
                        let depth = 1;
                        while (depth !== 0 && closingIdx < content.length) {
                            const slc = content.slice(closingIdx);

                            if (slc.startsWith(`<${tagName}`)) {
                                depth++;
                            } else if (slc.startsWith(`</${tagName}`)) {
                                depth--;
                            }

                            if (depth !== 0) {
                                const nextOpening = B.noStringIdxOf(slc, "<", 1);
                                if (nextOpening === -1) {
                                    break;
                                } else {
                                    closingIdx += nextOpening;
                                }
                            }
                        }

                        content = content.slice(0, closingIdx);

                        // increment idx to very end of element
                        idx += content.length + (tagName.length + 2 + 1);
                        // if (tagName === "default") {
                        //     content = `<template>${content}</template>`;
                        // }
                    }

                    virtualElements.push(new VirtualEl(
                        tagName,
                        componentHeader.slice(tagEndIdx, isSelfClosing ? componentHeader.length - 1 : componentHeader.length),
                        content
                    ));

                    endOfLastComponent = idx;
                }
            } else {
                idx++;
            }
        }
    
        // capture remaining text node
        if (idx !== endOfLastComponent) {
            virtualElements.push(source.slice(endOfLastComponent, idx));
        }
    
        return virtualElements;
    }
    
    B.template = (str, obj, specialChar) => {
        let newStr = "";
        let i = 0;
        let escapeChar = specialChar ?? "$";
        let currChar;
        while (i < str.length) {
            currChar = str.charAt(i);
            if (currChar === escapeChar && str.charAt(i + 1) === "{") {
                let props = "";
                i += 2;
                while (str.charAt(i) !== "}" && i < str.length) {
                    props += str.charAt(i);
                    i++;
                }
                props = props.split(".");
                let val = obj;
                for (let n = 0; n < props.length; n++) {
                    val = val?.[props[n]];
                }
                if (typeof val === "string") {
                    val = val
                    .replaceAll("&", "&amp;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll('"', "&quot;");
                }
                newStr += val;
            } else {
                newStr += currChar;
            }
            i++;
        }
        return newStr;
    };
    
    B.getJSON = async (url, callback) => {
        let res = await fetch(url);
        let json;
        try {
            json = await res.json();
        } catch (err) {
            json = undefined;
        }
    
        if (callback !== undefined) {
            callback(json);
        }
        return json;
    };

    B.getText = async (url, callback) => {
        let res = await fetch(url);
        let txt;
        try {
            txt = await res.text();
        } catch (err) {
            txt = undefined;
        }
    
        if (callback !== undefined) {
            callback(txt);
        }
        return txt;
    };
    
    B.getJSONP = (url, callback) => {
        let callbackId = Math.random().toString().replace(".", "");
        let script = document.createElement("script");
        B.getJSON["c" + callbackId] = function (json) {
            script.remove();
            callback(json);
        };
        script.src = url + (url.match(/\?/) ? "&" : "?") + "callback=$.getJSON.c" + callbackId;
        document.body.append(script);
    };

    B.loadScript = url => {
        B("script")
            .attr("src", url)
            .appendTo(document.body)
    };
    
    B.components = {};

    function createComponentFromNode(node, callback) {
        let methodsDefinition = undefined;
        for (let i = 0; i < node.children.length; i++) {
            const childNode = node.children[i];
            if (childNode instanceof VirtualEl && childNode.tag === "script" && childNode.attributes["type"] === "methods") {
                methodsDefinition = childNode.innerHTML;
            }
        }

        let boundPrototype = {};
        if (methodsDefinition) {
            boundPrototype = Function(`return class {${methodsDefinition}}`)().prototype;
        }

        let isNative = false;
        if (node.tag.startsWith("native-")) {
            isNative = true;
            node.tag = node.tag.slice("native-".length);
        }

        B.components[node.tag] = {
            template: node,
            isNative,
            callback,
            boundPrototype
        };
    }
    
    B.createComponent = (name, code, callback) => {
        const domTree = B.parseHTML(source);
        let theElement = undefined;
        for (let i = 0; i < domTree.length; i++) {
            const node = domTree[i];
            if (node instanceof VirtualEl) {
                theElement = new VirtualEl(name, "", code);
            }
        }

        if (theElement) {
            createComponentFromNode(theElement, callback)
        }

        return initObj => B(name, initObj);
    };

    B.createComponents = source => {
        const domTree = B.parseHTML(source);
        for (let i = 0; i < domTree.length; i++) {
            const node = domTree[i];
            if (node instanceof VirtualEl) {
                createComponentFromNode(node);
            }
        }
    };
    
    B.deleteComponent = (...args) => {
        for (let i = 0; i < args.length; i++) {
            delete B.components[args[i]];
        }
    };

    B.render = () => {
        $("default").appendTo(document.body);
        // const body = B(document.body);
        // body.html("");
        // // body.append(B("default"));
        // const template = B("default");
        // if (template && template.content) {
        //     body.replaceChildren(...template.content.children)
        // }
        
        // const elements = template.content.children;
        // for (let i = 0; i < elements.length; i++) {
        //     template.removeChild(elements[i]);
        //     body.append(elements[i]);
        // }
    };
    
    if (typeof window !== "undefined") {
        window.$ = B;
    } else {
        module.exports = B;
    }
}