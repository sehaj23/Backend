'use-strict';

import app from "../app";

const routes = []

export default function  PrintRoutes(){
    app._router.stack.forEach(printRoutes.bind(null, []))
    for(let i = 0; i < routes.length; i++){
        const r = routes[i]
        console.log(`${i+1} ${r}`)
    }
}

function printRoutes(path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(printRoutes.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(printRoutes.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
        const routePath = `${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`
        if(!routes.includes(routePath)){
            routes.push(routePath)
        }
    }
}


function split(thing) {
    if (typeof thing === 'string') {
        return thing.split('/')
    } else if (thing.fast_slash) {
        return ''
    } else {
        var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>'
    }
}