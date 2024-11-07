import React, { useState } from 'react';


const AddOn = ({ coke, setCoke, sevenUp, setSevenUp, sprite, setSprite, canadaDry, setCanadaDry, icetea, setIcetea }) => {
    const [isExpand, setIsExpand] = useState(false);
    return (
        <div className='flex flex-col'>
            需要加饮料吗？(3 元一瓶)
            <button
            className='bg-blue-500 text-white px-2 py-1 rounded-md'
            onClick={() => 
            {
                setIsExpand(!isExpand)}

            }
            >
                {isExpand ? '收起' : '点击展开'}
            </button>
        { isExpand && (

        <div>

        <div className="flex justify-between mt-2">
            <button

            className='bg-white text-black'
            onClick={()=>{
                if(coke>0){
                    setCoke(coke-1)
                }
            }}
            >-</button>
            <div>
            <p
            className=""
            > 可乐 </p>
            <div>
                <p> {coke} </p>
            </div>
            </div>
            <button
            className='bg-white text-black'
            onClick={() => setCoke(coke+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button

            className='bg-white text-black'
            onClick={()=>{
                if(sevenUp>0){
                    setSevenUp(sevenUp-1)
                }
            }}
            >-</button>
            <div>
            <p
            className=""
            > 七喜 </p>
            <div>
                <p> {sevenUp} </p>
            </div>
            </div>
            <button
            className='bg-white text-black'
            onClick={() => setSevenUp(sevenUp+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
            className='bg-white text-black'
            onClick={()=>{
                if(canadaDry>0){
                    setCanadaDry(canadaDry-1)
                }
            }}
            >-</button>
            <div>
            <p
            className=""
            > Canada Dry </p>
            <div>
                <p> {canadaDry} </p>
            </div>
            </div>
            <button
            className='bg-white text-black'
            onClick={() => setCanadaDry(canadaDry+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
            className='bg-white text-black'
            onClick={()=>{
                if(icetea>0){
                    setIcetea(icetea-1)
                }
            }}
            >-</button>
            <div>
            <p
            className=""
            > 冰红茶 </p>
            <div>
                <p> {icetea} </p>
            </div>
            </div>
            <button
            className='bg-white text-black'
            onClick={() => setIcetea(icetea+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
            className='bg-white text-black'
            onClick={()=>{
                if(sprite>0){
                    setSprite(sprite-1)
                }
            }}
            >-</button>
            <div>
            <p
            className=""
            > 雪碧 </p>
            <div>
                <p> {sprite} </p>
            </div>
            </div>
            <button
            className='bg-white text-black'
            onClick={() => setSprite(sprite+1)}
            >+</button>
            
        </div>
        </div>
        )}
        </div>
     );
}
 
export default AddOn;