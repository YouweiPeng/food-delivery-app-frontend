import React, { useState } from 'react';


const AddOn = ({ coke, setCoke, sevenUp, setSevenUp, sprite, setSprite, canadaDry, setCanadaDry, icetea, setIcetea }) => {
    const [isExpand, setIsExpand] = useState(false);
    return (
        <div className='flex flex-col'>
            需要加饮料吗？(3 元一瓶)
            <button
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
            onClick={() => setCoke(coke+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
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
            onClick={() => setSevenUp(sevenUp+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
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
            onClick={() => setCanadaDry(canadaDry+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
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
            onClick={() => setIcetea(icetea+1)}
            >+</button>
            
        </div>

        
        <div className="flex justify-between mt-2">
            <button
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
            onClick={() => setSprite(sprite+1)}
            >+</button>
            
        </div>
        </div>
        )}
        </div>
     );
}
 
export default AddOn;