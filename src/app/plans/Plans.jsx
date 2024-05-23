"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState } from 'react'
import { subscriptionPlans } from '@/constants'
import { ReloadIcon } from '@radix-ui/react-icons'

const Plans = () => {

    var [loading,setLoading] = useState(false)

    const getCheckoutSession = async (stripePriceID) =>{
        try {
            setLoading(true)
            var {data} = await axios.get(`/api/stripe/get-checkout-session?stripePriceID=${stripePriceID}`)
            if(data?.success){
                window.location.href = data?.data?.checkoutUrl                
            }else{
                alert("Something went wrong!")
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className='max-w-3xl mx-auto p-4'>
        <h2 className='text-2xl font-bold text-center'>Plans</h2>
        <div className='grid grid-cols-3 gap-4 my-10'>

            {
                subscriptionPlans?.map((v,i)=>{
                    return(
                        <div className='border p-4 rounded-lg text-center'>
                        <h3 className='text-lg font-semibold'>{v.label}</h3>
                        <h4 className='text-3xl font-bold mb-4'>{v.price} <sup className='text-sm font-medium'>MYR / {v.duration}</sup> </h4>
                        <Button disabled={loading} onClick={()=>getCheckoutSession(v.stripePriceID)}>
                            {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Subscribe Now
                        </Button>
                    </div>
                    )
                })
            }

           
            
        </div>
    </div>
  )
}

export default Plans