Hyper
-----------------------------
The Hypertext Transfer Protocol (HTTP) is an application protocol for distributed, collaborative, and hypermedia information systems. HTTP is the foundation of data communication for the World Wide Web


Feedback:
----------------

```js
const hyper = require('hyper')
hyper.get(url).then(({
    base64, //() => Base64 encoded text
    buffer, //(from_type='uft8') => Buffer
    json, //() => JSON object
    text //()=> text
})=>{

    const data = json()

})
```