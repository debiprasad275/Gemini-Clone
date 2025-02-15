import { createContext, useState } from "react";
import run from "../config/gemini";


export const Context = createContext();

const ContextProvider = (props) =>{

    const [input ,setInput] =  useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");  //show the data in main
    
    const delayPara =(index,nextWord) =>{
        setTimeout(() =>{
            setResultData(prev=>prev+nextWord);
        }, 75*index)

    }

    const newChat = ()=>{
        setLoading(false);
        setShowResult(false);
    }


    const onSent = async(prompt) =>{


        setResultData("")  //To remove the prev response
        setLoading(true);
        setShowResult(true);
        let response;

        if(prompt !== undefined){
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input);
           
            response = await run(input);
        }
        
        let responseArray = response.split("**");
        let newResponse =" " ;
        for(let i =0; i<responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }

        let newLine = newResponse.split("*").join("</br>");
        let newResponseArray = newLine.split(" ");
        for(let i = 0; i < newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }


        setResultData(newLine)     //result showing
        setLoading(false);
        setInput("");

    }

    // onSent("what is react js")

    const contextvalue ={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
        
    }
    return( 
    <Context.Provider value={contextvalue}>
            {props.children}
        </Context.Provider>)
   
}


export default ContextProvider;
