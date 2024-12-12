import { PaymentMethods } from '@/types/globals'
import React from 'react'
import BinanceIDPayment from './BinanceIDPayment';


interface MethodProps {
    method: PaymentMethods | string;
    setMethod: (newMethod: PaymentMethods | string) => void;
}


const PaymentProcess = ({ method, setMethod }: MethodProps) => {

    const methodType = (method as PaymentMethods);

    return (
        <main 
            className={`fixed top-0 right-0 left-0 bottom-0 justify-center items-center bg-color-60 bg-opacity-30 cursor-pointer ${
                typeof method === 'object' ? 'flex' : 'hidden'
            }`}
        >
            <div className='w-[95%] md:w-4/5 px-6 py-10 flex gap-5 flex-col bg-light-gradient-135deg rounded-md'>
                {methodType.payId && (
                    <BinanceIDPayment methodType={methodType} setMethod={setMethod} />
                )}
            </div>
        </main>
    )
}

export default PaymentProcess