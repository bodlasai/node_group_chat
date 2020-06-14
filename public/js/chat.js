const socket=io()

//$ used for naming convertion that we are using form dom 
const $messageForm=document.querySelector('#mesg-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#location')

const $message=document.querySelector('#messages')
const $messagetemplate=document.querySelector('#message-template').innerHTML

const $locationtemplate=document.querySelector('#location-template').innerHTML


const $sidebartemplate=document.querySelector('#sidebar-template').innerHTML



// socket.on('countupadate',(count)=>{
//     const mesg1=document.querySelector('p');
//     mesg1.textContent=count
//     console.log('this is new count',count)
// })
// document.querySelector('#inc').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })
// document.querySelector('#dec').addEventListener('click',()=>{
//     console.log('clicked -ve')
//     socket.emit('decrement')
// })

const {username,room}=Qs.parse(location.search ,{ ignoreQueryPrefix:true})


const autoscroll=()=>{
    const $newMessage = $message.lastElementChild
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // Visible height
    const visibleHeight = $message.offsetHeight
    const containerHeight = $message.scrollHeight
 // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
   
    }
}

socket.on('thismesg',(message)=>{
   // console.log(message)
    const html=Mustache.render($messagetemplate,{
        username:username,
        message:message.text,
        //moment is include in html script if u want check moment.js website
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('locationmessage',(data)=>{
    //console.log(data)
    const html=Mustache.render($locationtemplate,{
        username:data.username,
        url:data.url,
        createdAt:moment(data.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
   
})



socket.on('getData',({room,users})=>{
    // console.log(room)
    // console.log(users)
    const html=Mustache.render($sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html;
})


const searchvalue=document.querySelector('input');
//check this is written in a different way using prevent default //14 min
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const data=searchvalue.value;    
    socket.emit('sendmessage',data,(error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
           return console.log(error)
        }
        console.log('message delivered')
    });
})

// socket.on('newmesg',(data1)=>{
//     console.log(data1)
// })



$locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('update browser');
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position.coords.latitude)
        //sending to server the object data
        //enabling it
         $locationButton.removeAttribute('disabled')
        socket.emit('coordinates',{
            lat:position.coords.latitude,
            long:position.coords.longitude
        },(loc)=>{
            console.log(loc);
        })
    })
})


socket.emit('join',{ username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})