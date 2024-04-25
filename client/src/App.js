

import React,{useState} from 'react'
import axios from 'axios'
import {BarLoader} from 'react-spinners'


function App() {
 


  const [isLoading, setIsLoading] = useState(false);

  const[arg,setarg]=useState('')
  const [show,setshow]=useState(false)
  const [srcimg,setsrc]=useState('')
  const[cont,setcont]=useState('')

const getscreenshot=async(argss)=>{
  let arg=argss
  setIsLoading(true)

  if(arg.endsWith("/"))
  {arg=arg.slice(0,-1)}

  if(arg.startsWith("www."))
  {arg='https://'+arg}
  console.log(arg);

  const resp=await axios.post('/getscreenshot',{url:arg})
  
    if(resp.data.err){
      window.alert(resp.data.err)
      
      setIsLoading(false)
      setshow(false)
      return
    }
   
   
  const{data}=resp
  
  const {url}=data
  const d1=await axios.post('/uploadcloud',{url})
  console.log(d1.data);

  
  
  setIsLoading(false)
  setshow(true)
  setsrc(d1.data.xx)
  setcont(`The image is ${d1.data.size} bytes,and was created at ${d1.data.time}`)
  


    
}



  return (
    
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <BarLoader color="#36D7B7" />
        </div>
      )}
      {show && <img src={srcimg} alt="Screenshot" style={{ marginTop: '20px', maxWidth: '100%' }} />}
      {show && <div>{cont}</div>}

      <input
        type="text"
        placeholder="Enter URL"
        onChange={(e) => setarg(e.target.value)}
        style={{ margin: '20px', padding: '10px' }}
      />
      
      <button onClick={() => getscreenshot(arg)} style={{ padding: '10px 20px', backgroundColor: '#36D7B7', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Get Screenshot</button>
    </div>
  );
}

export default App;
